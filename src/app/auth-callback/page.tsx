"use client";

import { useContext, useEffect } from "react";

import Error from "next/error";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

import { AuthCallbackType } from "@/lib/validators/authCallback";

import { UserDataContext } from "@/components/Providers/UserDataContext";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginToast } = useCustomToast();
  const { email, id } = useContext(UserDataContext);

  const originParam = searchParams.get("origin");

  const { mutate: authCallback } = useMutation({
    mutationFn: async () => {
      const payload: AuthCallbackType = {
        id,
        email,
      };

      await axios.post("/api/auth-callback", payload);
    },
    onSuccess: () => {
      router.push(originParam ? `/${originParam}` : `/dashboard`);
    },
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      toast({
        title: "Something went wrong. Please try again later",
        description: error.message,
        variant: "default",
      });
      return <Error statusCode={500} />;
    },
  });

  useEffect(() => {
    if (id && email) authCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, email]);

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
