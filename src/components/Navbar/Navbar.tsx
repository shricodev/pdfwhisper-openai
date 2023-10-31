import Link from "next/link";
import { Github, LogInIcon, Rocket } from "lucide-react";

import UserAccountDropdown from "../UserAccountDropdown/UserAccountDropdown";

import WrapWidth from "@/helpers/WrapWidth";

import { isAuth } from "@/lib/getUserDetailsServer";

import { buttonVariants } from "../ui/Button";

const Navbar = async () => {
  const isAuthenticated = await isAuth();
  return (
    <nav className="sticky inset-x-0 top-0 z-50 h-14 w-full border-b border-gray-200 bg-white/75 pr-4 backdrop-blur-lg transition-all">
      <WrapWidth>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link
            href="/"
            className="z-60 ml-4 flex items-center gap-1 font-semibold"
          >
            <Rocket className="h-6 w-6" />
            pdfwhisper.
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <a
                href="https://github.com/shricodev/pdfwhisper-openai"
                target="_blank"
                rel="noopener"
                className={buttonVariants({
                  variant: "subtle",
                  size: "sm",
                })}
              >
                <Github className="h-5 w-5" />
                <span className="ml-[2px] font-medium">GitHub</span>
              </a>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>
              {isAuthenticated ? (
                <UserAccountDropdown />
              ) : (
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                  })}
                >
                  Login
                  <LogInIcon className="ml-px h-5 w-5" />
                </Link>
              )}
            </>
          </div>
        </div>
      </WrapWidth>
    </nav>
  );
};

export default Navbar;
