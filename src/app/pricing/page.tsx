import UpgradeButton from "@/components/UpgradeButton/UpgradeButton";
import { buttonVariants } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import {
  SUBSCRIBED_USER_FILE_SIZE,
  UNSUBSCRIBED_USER_FILE_SIZE,
} from "@/config/config";
import WrapWidth from "@/helpers/WrapWidth";
import { isAuth } from "@/lib/getUserDetailsServer";
import { cn } from "@/lib/utils";
import { ArrowRight, BadgeHelp, Check, Minus } from "lucide-react";
import Link from "next/link";

const page = async () => {
  const isAuthenticated = await isAuth();

  const pricingItems = [
    {
      plan: "Free",
      tagline: "For small side projects.",
      quota: 5,
      features: [
        {
          text: "5 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: `${UNSUBSCRIBED_USER_FILE_SIZE}MB file size limit`,
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
          negative: true,
        },
        {
          text: "Priority support",
          negative: true,
        },
      ],
    },
    {
      plan: "Pro",
      tagline: "For larger projects with higher needs.",
      quota: 20,
      features: [
        {
          text: "20 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: `${SUBSCRIBED_USER_FILE_SIZE}MB file size limit`,
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
      ],
    },
  ];

  return (
    <>
      <WrapWidth className="mx-auto mb-8 mt-24 max-w-5xl text-center">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing 💸</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Whether you&apos;re just trying out our service or upgrade to a PRO
            Plan, we&apos;ve got you covered. 🔥🚀
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 pt-12 lg:grid-cols-2">
          <TooltipProvider>
            {pricingItems.map(({ plan, tagline, features, quota }) => {
              // ! check if the user is subscribed user.
              const priceForSubscription = plan === "Pro" ? 10 : 0;
              // const isSubscribed =

              return (
                <div
                  key={quota}
                  className={cn("relative rounded-2xl bg-white shadow-lg", {
                    "border-2 border-purple-600 shadow-purple-200":
                      plan === "Pro",
                    "border border-gray-200": plan !== "Pro",
                  })}
                >
                  {plan === "Pro" && (
                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white selection:text-gray-800">
                      Upgrade Now
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display my-3 text-center text-3xl font-bold">
                      {plan}
                    </h3>
                    <p className="text-gray-500">{tagline}</p>
                    <p className="font-display my-5 text-6xl font-semibold">
                      ${priceForSubscription}
                    </p>
                    <p className="text-gray-500">per month</p>
                  </div>
                  <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-1">
                      <p>{quota.toLocaleString()} PDFs/mo included</p>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="ml-1.5 cursor-default">
                          <BadgeHelp className="h-4 w-4 text-zinc-500" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          The number of PDFs you can upload per month
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <ul className="my-10 space-y-5 px-8">
                    {features.map(({ text, footnote, negative }) => (
                      <li key={text} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          {negative ? (
                            <Minus className="h-6 w-6 text-gray-300" />
                          ) : (
                            <Check className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        {footnote ? (
                          <div className="flex items-center space-x-1">
                            <p
                              className={cn("text-gray-400", {
                                "text-gray-600": negative,
                              })}
                            >
                              {text}
                            </p>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="ml-1.5 cursor-default">
                                <BadgeHelp className="h-4 w-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2">
                                {footnote}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <p
                            className={cn("text-gray-400", {
                              "text-gray-600": negative,
                            })}
                          >
                            {text}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200" />
                  <div className="p-5">
                    {plan === "Free" ? (
                      <Link
                        href={isAuthenticated ? "/dashboard" : "/login"}
                        className={buttonVariants({
                          className: "w-full",
                          variant: "secondary",
                        })}
                      >
                        {isAuthenticated ? "Dashboard" : "Login"}
                        <ArrowRight className="ml-1.5 h-5 w-5" />
                      </Link>
                    ) : isAuthenticated ? (
                      <UpgradeButton />
                    ) : (
                      <Link
                        href="/login"
                        className={buttonVariants({
                          className: "w-full",
                        })}
                      >
                        {isAuthenticated ? "Upgrade now" : "Sign up"}
                        <ArrowRight className="ml-1.5 h-5 w-5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
      </WrapWidth>
    </>
  );
};

export default page;
