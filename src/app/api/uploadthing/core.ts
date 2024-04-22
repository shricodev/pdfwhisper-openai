import { createUploadthing } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

import { db } from "@/db";

// import { pinecone } from "@/lib/pinecone";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/plans";
import { FREE_USER_PDF_SIZE, PAID_USER_PDF_SIZE } from "@/config/config";
import { getPineconeClient } from "@/lib/pinecone";

const f = createUploadthing();

const pinecone = getPineconeClient();

const middleware = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isAuth = await isAuthenticated();
  const user = await getUser();

  if (!isAuth) throw new Error("Unauthorized");

  const userId = user?.id;
  if (!userId) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { subscritionPlan: subscriptionPlan, userId };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  // This check is not necessary but its good to validate first than to create two same pdfs.
  const isFileAlreadyExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });
  if (isFileAlreadyExist) return;

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

    const {
      subscritionPlan: { isSubscribed },
    } = metadata;

    const proPagesExceeded =
      pagesAmount > PLANS.find((plan) => plan.slug === "pro")!.pagesPerPdf;

    const freePagesExceeded =
      pagesAmount > PLANS.find((plan) => plan.slug === "free")!.pagesPerPdf;

    // If the user exceeded the page limit, we will mark the file as failed.
    if (
      (!isSubscribed && freePagesExceeded) ||
      (isSubscribed && proPagesExceeded)
    ) {
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

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      // TODO: Fix it
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
};

const freePlanPDFSizeLimit = FREE_USER_PDF_SIZE;
const proPlanPDFSizeLimit = PAID_USER_PDF_SIZE;

// FileRouter for the app, can contain multiple FileRoutes
export const ourFileRouter = {
  freePlanPDFUpload: f({ pdf: { maxFileSize: `${freePlanPDFSizeLimit}MB` } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),

  proPlanPDFUpload: f({ pdf: { maxFileSize: `${proPlanPDFSizeLimit}MB` } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
};

export type OurFileRouter = typeof ourFileRouter;
