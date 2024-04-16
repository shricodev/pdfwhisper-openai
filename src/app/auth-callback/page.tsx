"use client";

import Error from "next/error";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

import { trpc } from "@/app/_trpc/client";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginToast } = useCustomToast();

  const originParam = searchParams.get("origin");

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        router.push(originParam ? `/${originParam}` : `/dashboard`);
      }
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        return loginToast();
      }
      toast({
        title: "Something went wrong. Please try again later",
        description: error.message,
        variant: "default",
      });
      return <Error statusCode={500} />;
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="flex h-[calc(100vh-112px)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h3 className="text-xl font-semibold">
          Setting up your account. Please hold tight... 🫡
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
