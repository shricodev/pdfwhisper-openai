import { ZodError } from "zod";
import { OpenAIError } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

import { db } from "@/db";

import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";

import { AddMessageValidator } from "@/lib/validators/addMessage";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isAuth = await isAuthenticated();

    if (!isAuth) return new NextResponse("Unauthorized", { status: 401 });

    const user = await getUser();
    const userId = user?.id;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const pinecone = await getPineconeClient();

    const body = await req.json();
    const { fileId, message } = AddMessageValidator.parse(body);

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) return new NextResponse("File not found", { status: 404 });

    await db.message.create({
      data: {
        text: message,
        isUserMessage: true,
        fileId,
        userId,
      },
    });

    // vectorize the incoming user message
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      // ! The namespace feature is not supported for the free tier of Pinecone.
      // namespace: file.id,
    });

    const results = await vectorStore.similaritySearch(message, 4);
    const prevMessages = await db.message.findMany({
      where: {
        fileId: file.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 6,
    });

    const formattedPrevMessages = prevMessages.map((message) => ({
      role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: message.text,
    }));

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
        },
        {
          role: "user",
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
          
    \n----------------\n
    
    PREVIOUS CONVERSATION:
    ${formattedPrevMessages.map((message) => {
      if (message.role === "user") return `User: ${message.content}\n`;
      return `Assistant: ${message.content}\n`;
    })}
    
    \n----------------\n
    
    CONTEXT:
    ${results.map((r) => r.pageContent).join("\n\n")}
    
    USER INPUT: ${message}`,
        },
      ],
    });

    const stream = OpenAIStream(openaiResponse, {
      async onCompletion(completion) {
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId: file.id,
            userId,
          },
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }

    if (error instanceof OpenAIError) {
      return new NextResponse(error.message, { status: 500 });
    }

    if (error && typeof error === "object" && "message" in error) {
      return new NextResponse(error.message as string, {
        status: (error as { status?: number }).status ?? 500,
      });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
