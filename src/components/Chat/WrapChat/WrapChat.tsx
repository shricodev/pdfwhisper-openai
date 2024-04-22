"use client";

import Link from "next/link";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";

import ChatInput from "@/components/Chat/ChatInput/ChatInput";

import { ChatContextProvider } from "@/components/Chat/Context/ChatContext";

import Messages from "@/components/Chat/Messages/Messages";
import { PLANS } from "@/config/plans";

import { buttonVariants } from "@/components/ui/Button";
import { trpc } from "@/app/_trpc/client";

interface Props {
  pdfID: string;
  isSubscribed: boolean;
}

const WrapChat = ({ pdfID, isSubscribed }: Props) => {
  const { data, isLoading } = trpc.getPDFUploadStatus.useQuery(
    {
      id: pdfID,
    },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    },
  );

  if (isLoading) {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h3 className="text-xl font-semibold">
              Loading...Hang on tight ✨
            </h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h3 className="text-xl font-semibold">Processing PDF...🚀</h3>
            <p className="text-sm text-zinc-500">
              This shouldn&apos;t take long.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  // The file rendering is going to fail if the number of pages is more than specified in the quota.
  if (data?.status === "FAILED") {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="text-xl font-semibold">Too many pages in PDF</h3>
            <p className="text-sm text-zinc-500">
              {/* TODO: Change this value to dynamic based on the user's plan. */}
              Your{" "}
              <span className="font-medium">
                {isSubscribed ? "Pro" : "Free"}
              </span>{" "}
              plan supports up to
              {isSubscribed
                ? PLANS.find((plan) => plan.slug === "pro")?.pagesPerPdf
                : PLANS.find((plan) => plan.slug === "free")?.pagesPerPdf}{" "}
              pages per PDF.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeft className="mr-1.5 h-3 w-3" />
              Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  return (
    <ChatContextProvider pdfId={pdfID}>
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col justify-between">
          <Messages fileId={pdfID} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default WrapChat;
