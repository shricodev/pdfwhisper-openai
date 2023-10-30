"use client";

import axios from "axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";

import ChatInput from "../ChatInput/ChatInput";

import Messages from "../Messages/Messages";

import { buttonVariants } from "@/components/ui/Button";
import { useEffect } from "react";
import { ChatContextProvider } from "../Context/ChatContext";

interface Props {
  fileId: string;
}

const WrapChat = ({ fileId }: Props) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-upload-status"],
    enabled: false,
    queryFn: async () => {
      if (!fileId) return;
      const { data } = await axios.get(
        `/api/get-upload-status?fileId=${fileId}`,
      );
      type UploadStatus = "SUCCESS" | "PENDING" | "FAILURE" | "PROCESSING";
      return data?.uploadStatus as UploadStatus;
    },
    refetchInterval: (dataStatus) =>
      dataStatus === "SUCCESS" || dataStatus === "FAILURE" ? false : 500,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (data === "PROCESSING") {
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

  if (data === "FAILURE") {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="text-xl font-semibold">Too many pages in PDF</h3>
            <p className="text-sm text-zinc-500">
              Your <span className="font-medium">Free</span> plan supports up to{" "}
              5 pages per PDF.
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
    <ChatContextProvider fileId={fileId}>
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col justify-between">
          <Messages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default WrapChat;
