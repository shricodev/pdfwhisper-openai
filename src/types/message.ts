import { TAppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";

type TRouterOutput = inferRouterOutputs<TAppRouter>
type TMessages = TRouterOutput["getPDFMessages"]["messages"]

type TOmitText = Omit<TMessages[number], 'text'>

type TExtendedText = {
  text: string | JSX.Element
}

export type TExtendedMessage = TOmitText & TExtendedText
