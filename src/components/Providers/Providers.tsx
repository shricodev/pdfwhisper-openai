"use client";

import { PropsWithChildren, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { UserDataProvider } from "./UserDataContext";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <UserDataProvider>{children}</UserDataProvider>
    </QueryClientProvider>
  );
};

export default Providers;
