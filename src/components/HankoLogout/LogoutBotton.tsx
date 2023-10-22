"use client";

import { useState, useEffect, HTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { Hanko } from "@teamhanko/hanko-elements";
import { Button, buttonVariants } from "../ui/Button";

interface LogoutButtonProps extends HTMLAttributes<HTMLDivElement> {}

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL ?? "";

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [hanko, setHanko] = useState<Hanko>();

  useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ Hanko }) =>
      setHanko(new Hanko(hankoApi)),
    );
  }, []);

  const logout = async () => {
    try {
      await hanko?.user.logout();
      router.push("/login");
      router.refresh();
      return;
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <Button
      className={buttonVariants({
        variant: "default",
        className,
      })}
      onClick={logout}
    >
      Logout
    </Button>
  );
}
