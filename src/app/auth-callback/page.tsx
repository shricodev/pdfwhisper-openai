"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";
import Error from "next/error";
import getUserData from "@/lib/getUserData";

// eslint-disable-next-line @next/next/no-async-client-component
const Page = () => {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const router = useRouter();

  // const userData = await getUserData();

  trpc.authCallback.useQuery(
    { email: "random@gmail.com", id: "slkdjfslfjslkdfjsf-1231231" },
    {
      onSuccess: (data) => {
        if (data.success) {
          // user is in the database
          router.push(origin ? `/${origin}` : `/dashboard`);
        }
      },
      onError: (err) => {
        if (err.data?.code === "UNAUTHORIZED") {
          router.push("/login");
        }

        if (err.data?.code === "INTERNAL_SERVER_ERROR") {
          return <Error statusCode={500} />;
        }
      },
    }
  );

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">
          Setting up your account. Please hold tight... 🫡
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
