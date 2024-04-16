import { redirect } from "next/navigation";

import { db } from "@/db";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import Dashboard from "@/components/Dashboard/Dashboard";

const Page = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!isAuthenticated) return redirect("/login");

  const user = await getUser();
  const userId = user?.id;
  if (!userId) return redirect("/login");

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
