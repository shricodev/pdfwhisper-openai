import { createUploadthing } from "uploadthing/next";

import { db } from "@/db";

import { getUserId, isAuth } from "@/lib/getUserDetailsServer";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      const isAuthenticated = await isAuth();
      if (!isAuthenticated) throw new Error("Unauthorized");
      const userId = await getUserId();
      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          // The file.url throws timeout error sometimes. So, we are directly using the S3 url.
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const pdfResponse = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        );
        const pdfBlob = await pdfResponse.blob();
        const loader = new PDFLoader(pdfBlob);
        const pageLevelDocs = await loader.load();
        const pagesAmount = pageLevelDocs.length;

        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          // ! The namespace feature is not supported for the free tier of Pinecone.
          // namespace: createdFile.id,
        });
        await db.file.update({
          where: {
            id: createdFile.id,
            userId: metadata.userId,
          },
          data: {
            uploadStatus: "SUCCESS",
          },
        });
      } catch (error) {
        await db.file.update({
          where: {
            id: createdFile.id,
            userId: metadata.userId,
          },
          data: {
            uploadStatus: "FAILED",
          },
        });
      }
    }),
};

export type OurFileRouter = typeof ourFileRouter;
