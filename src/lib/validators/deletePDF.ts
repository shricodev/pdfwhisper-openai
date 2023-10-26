import { z } from "zod";

export const DeletePDFValidator = z.object({
  id: z.string(),
});

export type TDeletePDF = z.infer<typeof DeletePDFValidator>;
