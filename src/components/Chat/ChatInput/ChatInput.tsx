import { useContext, useRef } from "react";

import { SendHorizonal } from "lucide-react";

import { ChatContext } from "../Context/ChatContext";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface Props {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: Props) => {
  const { addMessage, handleUserInputChange, isLoading, message } =
    useContext(ChatContext);

  const tareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="absolute bottom-8 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-2 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex w-full flex-grow flex-col p-3">
            <div className="relative">
              <Textarea
                rows={1}
                autoFocus
                maxRows={4}
                value={message}
                onChange={handleUserInputChange}
                ref={tareaRef}
                placeholder="Ask your questions..."
                className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch resize-none rounded-lg py-3 pr-12 text-base"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    addMessage();
                    tareaRef.current?.focus();
                  }
                }}
              />
              <Button
                disabled={isDisabled || isLoading}
                className="absolute bottom-1.5 right-[8px]"
                onClick={(event) => {
                  event.preventDefault();
                  addMessage();
                  tareaRef.current?.focus();
                }}
                aria-label="Send message"
                size="icon"
              >
                <SendHorizonal className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-fit items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-white px-5 shadow-md backdrop-blur transition-all hover:border-2 hover:border-gray-200 hover:bg-white/80">
        <p className="text-sm font-semibold text-gray-700">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/shricodev"
            className="text-semibold text-primary"
            target="_blank"
            rel="noopener"
          >
            @shricodev
          </a>
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
