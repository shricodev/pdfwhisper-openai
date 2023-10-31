"use client";

import { createContext, useRef, useState } from "react";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast";

import { TAddMessageValidator } from "@/lib/validators/addMessage";

interface Props {
  fileId: string;
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
  addMessage: () => {},
  handleUserInputChange: () => {},
  isLoading: false,
});

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const backupMessage = useRef<string>("");

  const { mutate: sendMessage } = useMutation({
    mutationKey: ["addMessage"],
    mutationFn: async ({ message }: { message: string }) => {
      const payload: TAddMessageValidator = {
        fileId,
        message,
      };
      const { data, status } = await axios.post("/api/message", payload);
      if (status !== 200) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }
      return data;
    },
    onMutate: () => {
      backupMessage.current = message;
      setMessage("");
    },
    onError: () => {
      setMessage(backupMessage.current);
    },
    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const addMessage = () => {
    sendMessage({ message });
  };

  const handleUserInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessage(event.target.value);
  };

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
