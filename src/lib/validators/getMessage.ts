import { z } from "zod";

export const GetMessageValidator = z.object({
  limit: z.number().min(1).max(100).optional(),
  cursor: z.string().optional(),
  fileId: z.string(),
});

export type TGetMessageValidator = z.infer<typeof GetMessageValidator>;
