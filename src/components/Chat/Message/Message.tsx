import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

import { TExtendedMessage } from "@/types/message";

import { Icons } from "@/components/Icons/Icons";
import { forwardRef } from "react";

interface Props {
  message: TExtendedMessage;
  isNextMsgSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, Props>(
  ({ message, isNextMsgSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex aspect-square h-6 w-6 items-center justify-center",
            {
              "order-2 rounded-full bg-primary": message.isUserMessage,
              "order-1 rounded-full bg-zinc-200": !message.isUserMessage,
              invisible: isNextMsgSamePerson,
            },
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="h-3/4 w-3/4 fill-zinc-200 text-zinc-200" />
          ) : (
            <Icons.logo className="h-4 w-4 fill-zinc-300" />
          )}
        </div>

        <div
          className={cn("mx-2 flex max-w-md flex-col space-y-2 text-base", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("inline-block rounded-2xl px-4 py-2", {
              "bg-primary text-white": message.isUserMessage,
              "bg-gray-200 text-gray-900": !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose", {
                  "text-zinc-50 selection:text-zinc-800":
                    message.isUserMessage,
                })}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== "loading-message" ? (
              <div
                className={cn("mt-2 w-full select-none text-right text-xs", {
                  "text-purple-300": message.isUserMessage,
                  "text-zinc-500": !message.isUserMessage,
                })}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
)

Message.displayName = "Message";

export default Message;
