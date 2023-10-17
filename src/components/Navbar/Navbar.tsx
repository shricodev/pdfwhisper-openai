import Link from "next/link";
import { Flame, LogInIcon } from "lucide-react";

import WrapWidth from "@/helpers/WrapWidth";

import { buttonVariants } from "../ui/Button";

const Navbar = () => {
  return (
    <nav className="h-14 sticky inset-x-0 top-0 z-50 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all pr-4">
      <WrapWidth>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link
            href="/"
            className="flex z-60 font-semibold ml-4 gap-1 items-center"
          >
            <Flame className="w-7 h-7" />
            pdfwhisper.
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "default",
                  size: "sm",
                })}
              >
                Login
                <LogInIcon className="ml-px w-5 h-5" />
              </Link>
            </>
          </div>
        </div>
      </WrapWidth>
    </nav>
  );
};

export default Navbar;
