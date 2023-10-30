import { z } from "zod";

export const PaymentValidator = z.object({
  customer_info: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
});
