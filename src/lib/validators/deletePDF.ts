import { z } from "zod";

export const DeletePDFValidator = z.object({
  id: z.string(),
});

export type DeletePDFType = z.infer<typeof DeletePDFValidator>;
