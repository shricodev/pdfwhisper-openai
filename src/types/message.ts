import { Prettify } from "./prettify";

export type TMessageFetched = {
  messages: {
    text: string;
    id: string;
    isUserMessage: boolean;
    createdAt: Date;
  }[];
  nextCursor?: string | undefined;
};

type TOriginalMessage = {
  text: string;
  id: string;
  isUserMessage: boolean;
  createdAt: Date;
  nextCursor?: string | undefined;
};

type TExtendedText = {
  text: string | JSX.Element;
};

export type TOmitText = Omit<TOriginalMessage, "text">;
export type TExtendedMessage = Prettify<TOmitText & TExtendedText>;
