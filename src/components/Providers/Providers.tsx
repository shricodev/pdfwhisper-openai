"use client";

import { PropsWithChildren, useEffect, useState } from "react";

import { User } from "@teamhanko/hanko-elements";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import getUserData, { isUserLoggedIn } from "@/lib/getUserData";

import { UserDataContext } from "./UserDataContext";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [userData, setUserData] = useState<User>();
  useEffect(() => {
    async function fetchUserData() {
      const isLoggedIn = isUserLoggedIn();

      if (!isLoggedIn) return;
      const userData = await getUserData();
      if (!userData) return;
      setUserData(userData);
    }
    fetchUserData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserDataContext.Provider value={userData ?? { id: "", email: "" }}>
        {children}
      </UserDataContext.Provider>
    </QueryClientProvider>
  );
};

export default Providers;
