export type TChatAgent = "user" | "assistant";

export type TChatMessage = {
  role: TChatAgent;
  content: string;
  sources?: string[];
};
