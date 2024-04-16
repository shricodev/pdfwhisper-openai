"use client";

import Link from "next/link";

import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/DropdownMenu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { User2 } from "lucide-react";

interface Props {
  email: string | undefined;
  name: string;
  imageUrl: string;
}

const UserAccountDropdown = ({ email, name, imageUrl }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="aspect-square h-8 w-8 rounded-full bg-slate-400">
          <Avatar className="relative h-8 w-8">
            {imageUrl ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  fill
                  src={imageUrl}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{name}</span>
                <User2 className="h-4 w-4 text-zinc-900" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {name && (
              <p className="w-[200px] truncate text-sm text-zinc-700 dark:text-zinc-300">
                {name}
              </p>
            )}
            {email && (
              <p className="w-[200px] truncate text-sm text-zinc-400 dark:text-zinc-300">
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
          <LogoutLink>Logout</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountDropdown;
