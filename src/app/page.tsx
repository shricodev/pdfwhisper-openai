import Link from "next/link";
import { Star } from "lucide-react";
import { redirect } from "next/navigation";
import { Lightbulb, LogInIcon } from "lucide-react";

import WrapWidth from "@/helpers/WrapWidth";

import { Separator } from "@/components/ui/Separator";
import { buttonVariants } from "@/components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();

  if (isAuth) redirect("/dashboard");

  return (
    <>
      <WrapWidth className="mb-12 mt-28 flex flex-col items-center justify-center text-center sm:mt-40">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border-2 border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-2 hover:border-gray-200 hover:bg-white/80">
          <p className="text-sm font-semibold text-gray-700">
            Whisper with your PDF!
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Whisper with your <span className="text-purple-500">PDF</span> in{" "}
          <span className="text-orange-500">seconds</span>
        </h1>
        <p className="mt-4 max-w-prose px-5 text-zinc-700 sm:text-lg">
          PDFwhisper allows you to have a conversation with your PDF documents
        </p>
        <Link
          href="/api/auth/login"
          className={buttonVariants({
            size: "lg",
            className: "mt-2 rounded-[1.5rem]",
          })}
        >
          Get Started <LogInIcon className="ml-2 h-5 w-5" />
        </Link>
      </WrapWidth>

      <Separator className="mx-auto h-[2px] w-72" />

      {/* Features of the site */}
      <div className="mx-auto my-24 max-w-5xl">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 text-4xl font-bold text-gray-900 sm:text-3xl ">
              Start to chat with your PDF in seconds 😲
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Finding information on your PDF files is now easier than ever.
            </p>
          </div>
        </div>

        {/* steps to use the project */}
        <ol className="mx-4 my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="mx-auto flex max-w-5xl flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-purple-600">
                Step 1
              </span>
              <span className="text-xl font-semibold">
                Sign Up for an account
              </span>
              <span className="mt-2 text-zinc-700">
                Start with free plan or choose our{" "}
                <Link
                  href="/pricing"
                  className="text-orange-500 underline underline-offset-2"
                >
                  pro plan
                </Link>
                .
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="mx-auto flex max-w-5xl flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-purple-600">
                Step 2
              </span>
              <span className="text-xl font-semibold">
                Upload your PDF file
              </span>
              <span className="mt-2 text-zinc-700">
                We&apos;ll process your PDF file and you can start to chat with
                it.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="mx-auto flex max-w-5xl flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-purple-600">
                Step 3
              </span>
              <span className="text-xl font-semibold">
                Start asking your questions
              </span>
              <span className="mt-2 text-zinc-700">
                Now you are all ready to whisper with your PDF
              </span>
            </div>
          </li>
        </ol>

        <Separator className="mx-auto h-[2px] w-72" />
      </div>

      {/* Promise from our side */}
      <div className="mx-auto mb-0 mt-24 max-w-5xl">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 text-4xl font-bold text-gray-900 sm:text-3xl ">
              Our Firm Promise - In Security 🔒
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We use the most updated authentication measures using Passkeys 🔑
              provided by{" "}
              <a
                href="https://hanko.io"
                rel="noopener"
                target="_blank"
                className="text-orange-500"
              >
                Hanko
              </a>
              . You can be sure your credentials will not be compromised.
            </p>
          </div>
        </div>
      </div>

      {/* star hanko and the project */}
      <div className="flex flex-wrap justify-center gap-5">
        <div className="mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border-2 border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-2 hover:border-gray-200 hover:bg-white/80">
          <a
            href="https://github.com/teamhanko/hanko"
            target="_blank"
            rel="noopener"
            className="text-sm font-semibold text-gray-700"
          >
            Star Hanko <Star className="ml-2 inline h-5 w-5" />
          </a>
        </div>

        <div className="mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border-2 border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-2 hover:border-gray-200 hover:bg-white/80">
          <a
            href="https://github.com/shricodev/pdfwhisper-openai"
            target="_blank"
            rel="noopener"
            className="text-sm font-semibold text-gray-700"
          >
            Star Project <Star className="ml-2 inline h-5 w-5" />
          </a>
        </div>
      </div>
    </>
  );
}
