"use client";

import Link from "next/link";
import { format } from "date-fns";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Bomb, Ghost, Loader2, PlusCircle, Text } from "lucide-react";

import FileUploadButton from "@/components/FileUploadButton/FileUploadButton";

import { Button } from "@/components/ui/Button";
import { trpc } from "@/app/_trpc/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { getUserSubscriptionPlan } from "@/lib/stripe";

interface Props {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

// For displaying the Skeletons for loading state.
const SkeletonList = ({ count }: { count: number }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <Skeleton
      // It's important to provide a unique key for each child in a list
      key={index}
      height={100}
      className="my-2 flex items-center"
      count={1}
    />
  ));

  return <>{skeletons}</>;
};

const Dashboard = ({ subscriptionPlan }: Props) => {
  const { data: userPDFs, isLoading: isFetchingUserPDFs } =
    trpc.getUserPDFs.useQuery();

  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = trpc.useContext();

  const { mutate: deletePDF } = trpc.deletePDF.useMutation({
    onSuccess: () => {
      toast({
        title: "File deleted successfully",
        description: "The file has been successfully deleted",
      });
      utils.getUserPDFs.invalidate();
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 px-5 pb-5 sm:flex-row sm:items-center sm:gap-0 md:px-0">
        <h1 className="mb-3 hidden text-4xl font-bold text-gray-900 md:block">
          Your Uploads 📂
        </h1>
        <FileUploadButton isSubscribed={subscriptionPlan.isSubscribed} />
      </div>
      {userPDFs && userPDFs.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 px-2 md:grid-cols-2 md:px-0 lg:grid-cols-3">
          {userPDFs
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((pdf) => {
              return (
                <li
                  key={pdf.id}
                  className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                >
                  <Link
                    href={`/dashboard/${pdf.id}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                      <Text className="h-10 w-10" />
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-lg font-medium text-zinc-900">
                            {pdf.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="mt-4 grid grid-cols-2 place-items-center gap-6 px-6 py-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      {format(new Date(pdf.createdAt), "MMM d yyyy")}
                    </div>

                    <Button
                      onClick={() => deletePDF({ id: pdf.id })}
                      size="sm"
                      className="w-full"
                      variant="destructive"
                    >
                      {currentlyDeletingFile === pdf.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <Bomb className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </li>
              );
            })}
        </ul>
      ) : isFetchingUserPDFs ? (
        <div className="mt-8 grid grid-cols-1 gap-5 px-4 lg:grid-cols-3 lg:px-0">
          <SkeletonTheme baseColor="#fff" highlightColor="#f1fdfa">
            <SkeletonList count={6} />
          </SkeletonTheme>
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-2">
          <Ghost className="h-10 w-10 text-zinc-800" />
          <h3 className="text-xl font-semibold">
            You have not uploaded any PDFs.
          </h3>
          <p>Start by uploading your first PDF file 🗃️</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
