import { z } from "zod";

export const AddMessageValidator = z.object({
  fileId: z.string(),
  message: z.string().min(1),
});

export type TAddMessageValidator = z.infer<typeof AddMessageValidator>;
