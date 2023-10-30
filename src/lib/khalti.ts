import { PLANS } from "@/config/plans";

import { db } from "@/db";

import { getUserId, isAuth } from "./getUserDetailsServer";

export async function getUserSubscriptionPlan() {
  const isAuthenticated = await isAuth();

  if (!isAuthenticated) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      khaltiCurrentPeriodEnd: null,
    };
  }

  const userId = await getUserId();

  // Not so necessary as it is already handled above, but just to be sure.
  if (!userId) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      khaltiCurrentPeriodEnd: null,
    };
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      khaltiCurrentPeriodEnd: null,
    };
  }

  const isSubscribed = Boolean(
    dbUser.khaltiPaymentStatus === "Completed" &&
      dbUser.khaltiTransactionId &&
      dbUser.khaltiCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.khaltiCurrentPeriodEnd.getTime() + 86_400_000 > Date.now(),
  );

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.name === "Pro")
    : PLANS[0];

  return {
    ...plan,
    khaltiPaymentStatus: dbUser.khaltiPaymentStatus,
    khaltiCurrentPeriodEnd: dbUser.khaltiCurrentPeriodEnd,
    khaltiPidx: dbUser.khaltiPidx,
    khaltiTransactionId: dbUser.khaltiTransactionId,
    isSubscribed,
  };
}
