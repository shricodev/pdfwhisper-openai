import { redirect } from "next/navigation";

import { db } from "@/db";

import { getUserId } from "@/lib/getUserDetailsServer";

import Dashboard from "@/components/Dashboard/Dashboard";

const Page = async () => {
  const userId = await getUserId();
  const isAuthenticated = !!userId;

  if (!isAuthenticated) redirect("/login");

  // search for user in database with userId
  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <Dashboard />;
};

export default Page;
