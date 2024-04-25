import { ZodError } from "zod";
import { OpenAIError } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

import { db } from "@/db";

import { createOpenAIResponse } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";

import { AddMessageValidator } from "@/lib/validators/addMessage";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { FREE_PREV_MESSAGES, PRO_PREV_MESSAGES } from "@/config/config";

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

    if (!file) return new NextResponse("PDF not found", { status: 404 });

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

    // If we are here, we can be sure that pinecone has an index with the PINECONE_INDEX_NAME name.
    // Because the pinecone client creation handles the index creation if not exist.
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    const isSubscribed = dbUser && Boolean(
      dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd &&
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now(), // 86400000 = 1 day
    );

    // This is the entire logic of our application.
    const results = await vectorStore.similaritySearch(message, 4);
    const prevMessages = await db.message.findMany({
      where: {
        fileId: file.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      // Feed the AI with the correct amount of previous messages based on the user's subscription status.
      take: isSubscribed ? PRO_PREV_MESSAGES : FREE_PREV_MESSAGES,
    });

    const formattedPrevMessages = prevMessages.map((message) => ({
      role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: message.text,
    }));

    const openaiResponse = await createOpenAIResponse(
      formattedPrevMessages,
      results,
      message,
    );

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
