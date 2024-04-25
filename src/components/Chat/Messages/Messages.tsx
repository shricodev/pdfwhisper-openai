import { useContext, useEffect, useRef, } from "react";

import Skeleton from "react-loading-skeleton";
import { Loader2, MessageCircle } from "lucide-react";

import { ChatContext } from "@/components/Chat/Context/ChatContext";

import Message from "@/components/Chat/Message/Message";

import { MESSAGES_INFINITE_QUERY_LIMIT } from "@/config/config";
import { useIntersection } from "@mantine/hooks"

import { trpc } from "@/app/_trpc/client";

const Messages = ({ fileId }: { fileId: string }) => {
  const { isLoading: isThinking } = useContext(ChatContext);

  const lastMsgRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage } = trpc.getPDFMessages.useInfiniteQuery({
    pdfId: fileId,
    messagesLimit: MESSAGES_INFINITE_QUERY_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    keepPreviousData: true,
  })

  const { ref, entry } = useIntersection({
    root: lastMsgRef.current,
    threshold: 1
  })

  const messages = data?.pages.flatMap((page) => page.messages)

  const loadingMessage = {
    id: "loading-message",
    text: (
      <span className="flex h-full items-center justify-center">
        I'm thinking...
        <Loader2 className="ml-1.5 h-3 w-3 animate-spin text-primary" />
      </span>
    ),
    isUserMessage: false,
    createdAt: new Date().toISOString(),
  };

  const combinedMessages = [
    ...(isThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [fetchNextPage, entry])


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
                ref={ref}
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
          <p className="text-sm text-zinc-500">
            Ask your first question to the PDFwhisper bot.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
