"use client";

import { useEffect, useCallback, useState, useContext } from "react";

import { useRouter } from "next/navigation";
import { register, Hanko } from "@teamhanko/hanko-elements";

import { UserDataContext } from "../Providers/UserDataContext";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL ?? "";

export default function HankoAuth() {
  const router = useRouter();

  const { setUserData } = useContext(UserDataContext);
  const [hanko, setHanko] = useState<Hanko>();

  useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ Hanko }) =>
      setHanko(new Hanko(hankoApi))
    );
  }, []);

  const redirectAfterLogin = useCallback(() => {
    router.replace("/dashboard");
  }, [router]);

  useEffect(
    () =>
      hanko?.onAuthFlowCompleted(() => {
        setUserData((prev) => ({ ...prev, loggedIn: true }));
        redirectAfterLogin();
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hanko, redirectAfterLogin]
  );

  useEffect(() => {
    register(hankoApi).catch((error) => {
      console.error("Registration failed", error);
    });
  }, []);

  return <hanko-auth />;
}
