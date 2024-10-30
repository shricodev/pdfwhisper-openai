import Link from "next/link";
import { GithubIcon, LogInIcon, Rocket } from "lucide-react";

import UserAccountDropdown from "../UserAccountDropdown/UserAccountDropdown";

import WrapWidth from "@/helpers/WrapWidth";

import { isAuth } from "@/lib/getUserDetailsServer";

import { buttonVariants } from "../ui/Button";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

const Navbar = async () => {
  const isAuthenticated = await isAuth();
  return (
    <nav className="sticky inset-x-0 top-0 z-50 h-14 w-full border-b border-gray-200 bg-white/75 pr-4 backdrop-blur-lg transition-all dark:border-gray-700 dark:bg-gray-900/75">
      <WrapWidth>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-700">
          <Link
            href="/"
            className="z-60 ml-4 flex items-center gap-1 font-semibold text-gray-900 dark:text-gray-100"
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
                <GithubIcon className="h-5 w-5" />
                <span className="ml-[2px] font-medium">GitHub</span>
              </a>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                <span className="text-gray-900 dark:text-gray-100">
                  Pricing
                </span>
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
                  <span className="dark:text-gray-100">
                    Login
                  </span>
                  <LogInIcon className="ml-px h-5 w-5 text-gray-900 dark:text-gray-100" />
                </Link>
              )}
            </>
            <ThemeSwitch />
          </div>
        </div>
      </WrapWidth>
    </nav>
  );
};

export default Navbar;
