import { getUserData, isUserLoggedIn } from "@/lib/userActions";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

interface UserDataContextType {
  id: string;
  email: string;
  loggedIn: boolean;
  setUserData: Dispatch<SetStateAction<UserDataContextType>>;
}

const initialUserData: UserDataContextType = {
  id: "",
  email: "",
  loggedIn: false,
  setUserData: () => {},
};

export const UserDataContext =
  createContext<UserDataContextType>(initialUserData);

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userData, setUserData] =
    useState<UserDataContextType>(initialUserData);

  useEffect(() => {
    async function fetchUserData() {
      const isLoggedIn = isUserLoggedIn();

      if (!isLoggedIn) return;
      const userData = await getUserData();

      if (!userData) return;

      setUserData({
        id: userData.id,
        email: userData.email,
        loggedIn: true,
        setUserData,
      });
    }
    fetchUserData();
  }, []);

  return (
    <UserDataContext.Provider value={{ ...userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};
