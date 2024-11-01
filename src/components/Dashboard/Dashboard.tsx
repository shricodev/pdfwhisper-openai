"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";
import { File } from "@prisma/client";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Bomb, Ghost, Loader2, PlusCircle, Text } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import FileUploadButton from "../FileUploadButton/FileUploadButton";

import { toast } from "@/hooks/use-toast";

import { TDeletePDF } from "@/lib/validators/deletePDF";

import { Button } from "../ui/Button";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const {
    refetch: fetchUserFiles,
    data: userFiles,
    isFetching: isFetchingUserFiles,
  } = useQuery({
    queryKey: ["user-files"],
    queryFn: async () => {
      const { data } = await axios.get("/api/get-user-pdfs");
      return data as File[];
    },
  });

  const { mutate: deleteFile } = useMutation({
    mutationFn: async (id: string) => {
      const payload: TDeletePDF = { id };
      await axios.post(`/api/delete-pdf`, payload);
    },
    onMutate: (id: string) => {
      setCurrentlyDeletingFile(id);
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null);
      return toast({
        title: "File deleted successfully",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-files"]);
    },
  });

  useEffect(() => {
    fetchUserFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 px-5 pb-5 sm:flex-row sm:items-center sm:gap-0 md:px-0">
        <h1 className="mb-3 hidden text-4xl font-bold text-gray-900 dark:text-gray-100  md:block">
          Your Uploads 📂
        </h1>
        <FileUploadButton />
      </div>
      {userFiles && userFiles.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 px-2 md:grid-cols-2 md:px-0 lg:grid-cols-3">
          {userFiles
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((file) => {
              return (
                <li
                  key={file.id}
                  className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                >
                  <Link
                    href={`/dashboard/${file.id}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                      <Text className="h-10 w-10" />
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-lg font-medium text-zinc-900  dark:text-zinc-100">
                            {file.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="mt-4 grid grid-cols-2 place-items-center gap-6 px-6 py-4 text-xs text-zinc-500  dark:text-zinc-100">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      {format(new Date(file.createdAt), "MMM d yyyy")}
                    </div>

                    <Button
                      onClick={() => deleteFile(file.id)}
                      size="sm"
                      className="w-full"
                      variant="destructive"
                    >
                      {currentlyDeletingFile === file.id ? (
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
      ) : isFetchingUserFiles ? (
        <div className="mt-8 grid grid-cols-1 gap-5 px-4 lg:grid-cols-3 lg:px-0">
          <SkeletonTheme baseColor="#fff" highlightColor="#f1fdfa">
            <Skeleton
              height={100}
              className="my-2 flex items-center"
              count={1}
            />
            <Skeleton
              height={100}
              className="my-2 flex items-center"
              count={1}
            />
            <Skeleton
              height={100}
              className="my-2 flex items-center"
              count={1}
            />
            <Skeleton
              height={100}
              className="my-2 flex items-center"
              count={1}
            />
            <Skeleton
              height={100}
              className="my-2 flex items-center"
              count={1}
            />
            <Skeleton
              height={100}
              className="my-2 flex items-center"
              count={1}
            />
          </SkeletonTheme>
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-2">
          <Ghost className="h-10 w-10 text-zinc-800  dark:text-zinc-100 " />
          <h3 className="text-xl font-semibold">
            You have not uploaded any files.
          </h3>
          <p>Start by uploading your first PDF file 🗃️</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
