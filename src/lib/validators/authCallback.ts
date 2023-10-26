import { z } from "zod";

export const AuthCallbackValidator = z.object({
  id: z.string().min(3),
  email: z.string().email(),
});

export type TAuthCallback = z.infer<typeof AuthCallbackValidator>;
