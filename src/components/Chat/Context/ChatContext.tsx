"use client";

import { createContext, useRef, useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { TAddMessageValidator } from "@/lib/validators/addMessage";
import { trpc } from "@/app/_trpc/client";
import { MESSAGES_INFINITE_QUERY_LIMIT } from "@/config/config";

interface Props {
  pdfId: string;
  children: React.ReactNode;
}

export type TChatContext = {
  message: string;
  addMessage: () => void;
  handleUserInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<TChatContext>({
  message: "",
  addMessage: () => { },
  handleUserInputChange: () => { },
  isLoading: false,
});

export const ChatContextProvider = ({ pdfId: fileId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userMsgBackup = useRef<string>("");

  const { toast } = useToast()
  const utils = trpc.useContext();

  // We want to stream the response to the client.Currently trpc does not support
  // response streaming.So, we will be using a regular NextJS API route.
  const { mutate: sendMessage } = useMutation({
    mutationKey: ["addMessage"],
    mutationFn: async ({ message }: { message: string }) => {
      const payload: TAddMessageValidator = {
        fileId,
        message,
      }
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
        throw new Error("There was a problem sending this message");
      }
      return response.body;
    },
    onMutate: async ({ message }) => {
      userMsgBackup.current = message;
      setMessage("");

      // Cancel any other outgoing request.
      await utils.getPDFMessages.cancel()

      const prevMessages = utils.getPDFMessages.getInfiniteData()
      // Add the msg to the UI for optimistic update.
      utils.getPDFMessages.setInfiniteData(
        { pdfId: fileId, messagesLimit: MESSAGES_INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            // Need to comply with the React Query's expected return type
            return {
              pages: [],
              pageParams: [],
            }
          }

          let newPages = [...old.pages]
          let latestPage = newPages[0]!

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages
          ]
          newPages[0] = latestPage

          return {
            ...old,
            pages: newPages
          }
        }
      )

      setIsLoading(true);
      return {
        prevMessages: prevMessages?.pages.flatMap((page) => page.messages) ?? []
      }
    },

    onError: (_, __, context) => {
      setMessage(userMsgBackup.current),
        utils.getPDFMessages.setData(
          { pdfId: fileId },
          { messages: context?.prevMessages ?? [] }
        )
    },

    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
      }
      const reader = stream.getReader();
      const decoder = new TextDecoder()
      let done = false;

      // Total response from the AI
      let aiAccumulatedResponse = ""
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        aiAccumulatedResponse += chunkValue
        utils.getPDFMessages.setInfiniteData(
          { pdfId: fileId, messagesLimit: MESSAGES_INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) {
              return {
                pages: [],
                pageParams: [],
              }
            }
            let isAiResponseCreated = old.pages.some((page) => page.messages.some((msg) => msg.id === "ai-response"))
            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages;
                if (!isAiResponseCreated) {
                  updatedMessages = [{
                    createdAt: new Date().toISOString(),
                    id: "ai-response",
                    text: aiAccumulatedResponse,
                    isUserMessage: false,
                  },
                  ...page.messages
                  ]
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: aiAccumulatedResponse
                      }
                    }
                    return message;
                  })
                }
                return {
                  ...page,
                  messages: updatedMessages
                }
              }
              return page
            })
            return { ...old, pages: updatedPages }
          },
        )
      }

    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.getPDFMessages.invalidate({ pdfId: fileId })
    },
  });

  const addMessage = () => sendMessage({ message });

  const handleUserInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => setMessage(event.target.value);

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        handleUserInputChange,
        isLoading,
        message,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
