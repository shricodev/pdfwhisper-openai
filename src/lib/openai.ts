import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createOpenAIResponse = async (
  formattedPrevMessages: { role: "user" | "assistant"; content: string }[],
  results: { pageContent: string }[],
  message: string,
) => {
  return await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `
            Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know in a polite fashion, don't try to make up an answer.
                  
            ----------------
            
            PREVIOUS CONVERSATION:
            ${formattedPrevMessages.map((msg) => {
          if (msg.role === "user") return `User: ${msg.content}\n`;
          return `Assistant: ${msg.content}\n`;
        })}
            
            ----------------
            
            CONTEXT:
            ${results.map((r) => r.pageContent).join("\n\n")}
            
            USER INPUT: ${message}
        `,
      },
    ],
  });
};
