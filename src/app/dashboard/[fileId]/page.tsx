import RenderPDF from "@/components/RenderPDF/RenderPDF";
import { db } from "@/db";
import { getUserId, isAuth } from "@/lib/getUserDetailsServer";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    fileId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { fileId } = params;
  const isAuthenticated = await isAuth();

  if (!isAuthenticated) redirect("/login");

  const userId = await getUserId();

  if (!userId) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  // search for file in database with userId
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
      <div className="max-w-8xl mx-auto w-full grow lg:flex xl:px-2">
        <div className="flex-1 outline-dashed xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <RenderPDF url={file.url} />
          </div>
        </div>

        <div className="flex-[0.75] shrink-0 border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          {/* <ChatWrapper isSubscribed={plan.isSubscribed} fileId={file.id} /> */}
        </div>
      </div>
    </div>
  );
};

export default page;
