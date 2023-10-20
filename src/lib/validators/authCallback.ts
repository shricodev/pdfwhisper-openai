import { z } from "zod";

export const AuthCallbackValidator = z.object({
  id: z.string().min(3),
  email: z.string().email(),
});

export type AuthCallbackType = z.infer<typeof AuthCallbackValidator>;
