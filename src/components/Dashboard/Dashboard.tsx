"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";
import { File } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import {
  Bomb,
  Ghost,
  Loader2,
  MessageCircle,
  PlusCircle,
  Text,
} from "lucide-react";

import FileUploadButton from "../FileUploadButton/FileUploadButton";

import { Button } from "../ui/Button";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const {
    refetch,
    data: userFiles,
    isFetching,
  } = useQuery({
    queryKey: ["user-files"],
    enabled: false,
    queryFn: async () => {
      const { data } = await axios.get("/api/get-user-pdfs");
      return data as File[];
    },
  });

  // TODO: Make sure to auto refresh the site after a file was deleted.
  const { mutate: deleteFile } = useMutation({
    mutationFn: async (id: string) => {
      const payload: { id: string } = { id };
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
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 text-4xl font-bold text-gray-900">
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
            .map((file) => (
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
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    {format(new Date(file.createdAt), "MMM d yyyy")}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    10
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
            ))}
        </ul>
      ) : isFetching ? (
        <SkeletonTheme baseColor="#fff" highlightColor="#f1fdfa">
          <Skeleton height={80} className="my-2 flex items-center" count={1} />
          <Skeleton height={80} className="my-2 flex items-center" count={1} />
          <Skeleton height={80} className="my-2 flex items-center" count={1} />
        </SkeletonTheme>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-2">
          <Ghost className="h-10 w-10 text-zinc-800" />
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
