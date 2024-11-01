"use client";

import { useState } from "react";

import { File } from "@prisma/client";
import axios from "axios";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import Dropzone from "react-dropzone";

import {
  DROPDOWN_ACCEPTED_FILE_TYPES,
  SUBSCRIBED_USER_FILE_SIZE,
  UNSUBSCRIBED_USER_FILE_SIZE,
} from "@/config/config";

import { toast } from "@/hooks/use-toast";

import { useUploadThing } from "@/lib/uploadThing";
import { TGetPDF } from "@/lib/validators/getUserPDF";

import { Progress } from "../ui/Progress";

const FileUploadDropzone = () => {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { startUpload } = useUploadThing("pdfUploader");

  // This is a simulation of progress. UploadThing does not provide a progress
  // status till the upload is complete.
  const startUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);
    return interval;
  };

  // Create an object of Accept type for Dropzone to understand.
  const acceptFileTypes = () => {
    const resultObject: { [key: string]: string[] } = {};
    DROPDOWN_ACCEPTED_FILE_TYPES.forEach(
      (fileType) => (resultObject[fileType] = []),
    );
    return resultObject;
  };

  return (
    <Dropzone
      multiple={false}
      accept={acceptFileTypes()}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const progress = startUploadProgress();
        const uploadResponse = await startUpload(acceptedFile);
        if (!uploadResponse) {
          setIsUploading(false);
          clearInterval(progress);
          console.log("this is the error with the upload response");
          return toast({
            variant: "destructive",
            title: "Something went wrong",
            description:
              "There was an error uploading your file. Please try again later.",
          });
        }
        const [fileUploadResponse] = uploadResponse;
        const key = fileUploadResponse?.key;
        if (!key) {
          setIsUploading(false);
          clearInterval(progress);
          console.log("this is the error with the upload key");

          return toast({
            variant: "destructive",
            title: "Something went wrong",
            description:
              "There was an error uploading your file. Please try again later.",
          });
        }

        clearInterval(progress);
        setUploadProgress(100);

        try {
          const payload: TGetPDF = { key };
          const { data, status }: { data: File; status: number } =
            await axios.post("/api/get-pdf", payload);
          if (status === 200) {
            router.push(`/dashboard/${data.id}`);
          }
        } catch (error) {
          return toast({
            variant: "destructive",
            title: "Something went wrong. Please try again later.",
          });
        }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="m-4 h-64 rounded-lg border border-dashed border-gray-300"
        >
          <div className="flex h-full w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 "
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <UploadCloud className="mb-2 h-8 w-8 text-zinc-500 dark:text-zinc-100" />
                <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-50">
                  <span className="font-semibold">Click to upload</span> or{" "}
                  <span className="font-light">drag and drop</span>
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-100">
                  PDF (up to{" "}
                  <span className="font-semibold">
                    {true
                      ? SUBSCRIBED_USER_FILE_SIZE
                      : UNSUBSCRIBED_USER_FILE_SIZE}
                    MB
                  </span>
                  )
                </p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200 dark:bg-black dark:outline-zinc-600">
                  <div className="grid h-full place-items-center px-3 py-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {/* Adding this input tag is required in some browsers to show the file upload popup. */}
              {/* Refer to this issue for Firefox: https://github.com/react-dropzone/react-dropzone/issues/1294 */}
              <input
                {...getInputProps()}
                type="file"
                id="dropzone-pdf"
                className="hidden"
              />

              {isUploading ? (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full rounded-xl bg-zinc-200 dark:bg-zinc-500"
                    progressColor={uploadProgress === 100 ? "bg-green-500" : ""}
                  />
                  {uploadProgress >= 50 && uploadProgress < 100 ? (
                    <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700 dark:text-zinc-100">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      Almost There...✨
                    </div>
                  ) : null}
                  {uploadProgress === 100 ? (
                    <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700 dark:text-zinc-100">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      Redirecting...🚀
                    </div>
                  ) : null}
                </div>
              ) : null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default FileUploadDropzone;
