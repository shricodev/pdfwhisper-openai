"use client";

import { useEffect } from "react";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL ?? "";

export default function HankoProfile() {
  useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ register }) =>
      register(hankoApi).catch((error) => {
        console.error("Unexpected Error Occured", error);
      }),
    );
  }, []);

  return (
    <>
      <hanko-profile />
    </>
  );
}
