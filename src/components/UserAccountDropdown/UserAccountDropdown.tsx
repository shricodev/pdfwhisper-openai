"use client";

import { useContext } from "react";

import Link from "next/link";

import LogoutButton from "../HankoLogout/LogoutBotton";

import { UserDataContext } from "../Providers/UserDataContext";

import UserAvatar from "../UserIcon/UserIcon";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/DropdownMenu";

const UserAccountDropdown = () => {
  const { email } = useContext(UserDataContext);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar className="h-10 w-10 sm:h-7 sm:w-7" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {email && (
              <p className="w-[200px] truncate text-sm text-zinc-700 dark:text-zinc-300">
                {email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/pricing">Pricing</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <LogoutButton className="w-full" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountDropdown;
