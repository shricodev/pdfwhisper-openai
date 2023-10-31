"use client";

import { useState, useEffect, HTMLAttributes, useContext } from "react";

import { useRouter } from "next/navigation";
import { Hanko } from "@teamhanko/hanko-elements";

import { UserDataContext } from "../Providers/UserDataContext";

import { Button, buttonVariants } from "../ui/Button";

interface LogoutButtonProps extends HTMLAttributes<HTMLDivElement> {}

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL ?? "";

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const { setUserData } = useContext(UserDataContext);
  const [hanko, setHanko] = useState<Hanko>();

  useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ Hanko }) =>
      setHanko(new Hanko(hankoApi)),
    );
  }, []);

  const logout = async () => {
    try {
      await hanko?.user.logout();
      setUserData({
        id: "",
        email: "",
        loggedIn: false,
        setUserData,
      });
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
