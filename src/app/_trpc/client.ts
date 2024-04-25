import { TAppRouter } from "@/trpc";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<TAppRouter>({});
