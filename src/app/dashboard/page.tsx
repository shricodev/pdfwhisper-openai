import { db } from "@/db";
import { user } from "@/db/schema";
import { getUserId } from "@/lib/getUserID";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const Page = async () => {
  const userId = await getUserId();
  const isAuthenticated = !!userId;

  if (!isAuthenticated) redirect("/login");

  // search for user in database with userId
  const dbUserId = await db
    .select({
      id: user.id,
    })
    .from(user)
    .where(eq(user.id, userId));

  if (dbUserId.length === 0) redirect("/auth-callback?origin=dashboard");

  return <div>{userId}</div>;
};

export default Page;
