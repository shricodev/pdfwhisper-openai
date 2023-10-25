import { z } from "zod";

export const GetPDFValidator = z.object({
  key: z.string(),
});

export type GetPDFType = z.infer<typeof GetPDFValidator>;
