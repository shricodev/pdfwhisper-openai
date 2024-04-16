import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "@/trpc/trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isAuth = await isAuthenticated();

    if (!isAuth) throw new TRPCError({ code: "UNAUTHORIZED" });

    const user = await getUser();

    if (!user?.id || !user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }
    return { success: true };
  }),

  getUserPDFs: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),

  getPDF: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const pdf = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!pdf) throw new TRPCError({ code: "NOT_FOUND" });

      return pdf;
    }),

  deletePDF: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const pdf = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!pdf) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
        },
      });

      return pdf;
    }),

  getPDFUploadStatus: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const pdf = await db.file.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });

      if (!pdf) return { status: "PENDING" as const };

      return { status: pdf.uploadStatus };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
