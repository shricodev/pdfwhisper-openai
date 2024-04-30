import { notFound, redirect } from "next/navigation";

import { db } from "@/db";

import RenderPDF from "@/components/RenderPDF/RenderPDF";
import WrapChat from "@/components/Chat/WrapChat/WrapChat";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserSubscriptionPlan } from "@/lib/stripe";

interface Props {
  params: {
    pdfId: string;
  };
}

const Page = async ({ params }: Props) => {
  const { pdfId } = params;
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isAuth = await isAuthenticated();

  if (!isAuth) redirect("/api/auth/login");

  const user = await getUser();
  const userId = user?.id;

  if (!userId) redirect(`/auth-callback?origin=dashboard/${pdfId}`);

  // search for file in database with userId
  const pdf = await db.file.findFirst({
    where: {
      id: pdfId,
      userId,
    },
  });

  const subscriptionPlan = await getUserSubscriptionPlan()

  if (!pdf) notFound();

  return (
    <div className="flex h-[calc(100vh-112px)] flex-1 flex-col justify-between">
      <div className="max-w-8xl mx-auto w-full grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <RenderPDF url={pdf.url} />
          </div>
        </div>

        <div className="flex-[0.75] shrink-0 border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <WrapChat pdfID={pdf.id} isSubscribed={subscriptionPlan.isSubscribed} />
        </div>
      </div>
    </div>
  );
};

export default Page;
