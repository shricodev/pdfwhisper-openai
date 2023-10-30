import { useEffect } from "react";

import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { Loader2, MessageCircle } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

import Message from "../Message/Message";

import { INFINITE_QUERY_LIMIT } from "@/config/config";

import { TGetMessageValidator } from "@/lib/validators/getMessage";
import { TMessageFetched } from "@/types/message";

interface Props {
  fileId: string;
}

const Messages = ({ fileId }: Props) => {
  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["get-messages"],
      queryFn: async ({ pageParam = 0 }) => {
        const payload: TGetMessageValidator = {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        };
        const { data, status } = await axios.get(`/api/get-messages`, {
          params: payload,
        });
        if (status !== 200) throw new Error("Error getting messages");
        return data as TMessageFetched;
      },
      getNextPageParam: (lastPage, pages) => lastPage?.nextCursor,
      keepPreviousData: true,
    });

  useEffect(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const loadingMessage = {
    id: "loading-message",
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </span>
    ),
    isUserMessage: false,
    createdAt: new Date(),
  };

  const messages = data?.pages.flatMap((page) => page.messages);

  const combinedMessages = [
    ...(true ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex max-h-[calc(100vh-7rem-7rem)] flex-1 flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, index) => {
          const isNextMessageSamePerson =
            combinedMessages[index - 1]?.isUserMessage ===
            combinedMessages[index]?.isUserMessage;

          if (index === combinedMessages.length - 1) {
            return (
              <Message
                key={message.id}
                isNextMsgSamePerson={isNextMessageSamePerson}
                message={message}
              />
            );
          } else {
            return (
              <Message
                key={message.id}
                isNextMsgSamePerson={isNextMessageSamePerson}
                message={message}
              />
            );
          }
        })
      ) : isLoading ? (
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <MessageCircle className="h-10 w-10 text-primary" />
          <h3 className="text-xl font-semibold">You&apos;r all set!</h3>
          <p className="text-sm text-zinc-500">
            Ask your first question to the PDFwhisper bot.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
