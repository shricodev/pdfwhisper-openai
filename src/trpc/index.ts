import { db } from "@/db";
import { absoluteUrl } from "@/lib/utils";
import { privateProcedure, publicProcedure, router } from "@/trpc/trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PLANS } from "@/config/plans";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";

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

  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const billingUrl = absoluteUrl("/dashboard/billing");

    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    // If the user is subscribed, redirect them to the subscription management portal.
    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((plan) => plan.slug === "pro")?.price.priceIds.test,
          // This will always be of quantity 1, as we are creating a subscription.
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    });

    return { url: stripeSession.url };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
