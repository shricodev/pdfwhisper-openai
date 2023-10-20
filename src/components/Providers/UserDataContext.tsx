import { createContext } from "react";

interface UserDataContextType {
  id: string;
  email: string;
}

export const UserDataContext = createContext<UserDataContextType>({
  id: "",
  email: "",
});
