import { db } from "@/db";
import { publicProcedure, router } from "./trpc";
import { getUserId } from "@/lib/getUserID";
import { TRPCError } from "@trpc/server";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const appRouter = router({
  authCallback: publicProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string(),
      })
    )
    .query(async ({ input }) => {
      const userId = await getUserId();

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      try {
        // Check if the user is in the database.
        const dbUserId = await db
          .select()
          .from(user)
          .where(eq(user.id, userId));

        // If there is no dbUser, it means that the user is first time logging in.
        if (dbUserId.length === 0) {
          await db.insert(user).values({
            id: userId,
            email: input.email,
          });
        }
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }

      return { success: true };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
