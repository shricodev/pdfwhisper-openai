import { useContext, useEffect } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, MessageCircle } from "lucide-react";
import Skeleton from "react-loading-skeleton";

import { ChatContext } from "../Context/ChatContext";

import Message from "../Message/Message";

import { INFINITE_QUERY_LIMIT } from "@/config/config";

import { TGetMessageValidator } from "@/lib/validators/getMessage";

import { TMessageFetched } from "@/types/message";

interface Props {
  fileId: string;
}

const Messages = ({ fileId }: Props) => {
  const { isLoading: isThinking } = useContext(ChatContext);
  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
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
        Loading...
        <Loader2 className="ml-1.5 h-3 w-3 animate-spin text-primary" />
      </span>
    ),
    isUserMessage: false,
    createdAt: new Date(),
  };

  const messages = data?.pages.flatMap((page) => page.messages);

  const combinedMessages = [
    ...(isThinking ? [loadingMessage] : []),
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
          <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
          <p className="text-sm text-zinc-500  dark:text-zinc-100">
            Ask your first question to the PDFwhisper bot.
          </p>
          <p className="mt-10 font-semibold">🔴 Message to Hanko Reviewers:</p>
          <p className="max-w-2xl text-center text-sm text-zinc-500 dark:text-zinc-100">
            Running low on time, couldn&apos;t add optimistic chat update.
            Please refresh the page to view the message.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
