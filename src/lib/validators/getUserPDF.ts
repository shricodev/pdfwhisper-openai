import { z } from "zod";

export const GetPDFValidator = z.object({
  key: z.string(),
});

export type TGetPDF = z.infer<typeof GetPDFValidator>;
