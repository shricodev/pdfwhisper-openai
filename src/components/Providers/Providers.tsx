"use client";

import { PropsWithChildren, useEffect, useState } from "react";

import { User } from "@teamhanko/hanko-elements";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { UserDataProvider } from "./UserDataContext";
import { getUserData, isUserLoggedIn } from "@/lib/userActions";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <UserDataProvider>{children}</UserDataProvider>
    </QueryClientProvider>
  );
};

export default Providers;
