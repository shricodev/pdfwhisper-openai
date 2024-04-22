import { redirect } from "next/navigation";

import { db } from "@/db";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import Dashboard from "@/components/Dashboard/Dashboard";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const Page = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isAuth = await isAuthenticated();

  if (!isAuth) redirect("/api/auth/login");

  const user = await getUser();
  const userId = user?.id;

  if (!userId) redirect("/api/auth/login");

  // search for user in database with userId
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return <Dashboard subscriptionPlan={subscriptionPlan} />;
};

export default Page;
