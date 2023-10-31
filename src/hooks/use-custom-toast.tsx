import Link from "next/link";

import { cn } from "@/lib/utils";

import { toast } from "./use-toast";

import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login to continue",
      description: "You need to login to perform this operation",
      className: "rounded-xl",
      action: (
        <Link
          href="/login"
          onClick={() => dismiss()}
          className={cn(
            buttonVariants({
              variant: "subtle",
            }),
          )}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
};
