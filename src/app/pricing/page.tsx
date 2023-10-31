import Link from "next/link";
import { AlertCircle, ArrowRight, BadgeHelp, Check, Minus } from "lucide-react";

import {
  SUBSCRIBED_USER_FILE_SIZE,
  UNSUBSCRIBED_USER_FILE_SIZE,
} from "@/config/config";

import WrapWidth from "@/helpers/WrapWidth";

import { cn } from "@/lib/utils";
import { isAuth } from "@/lib/getUserDetailsServer";

import { buttonVariants } from "@/components/ui/Button";
import UpgradeButton from "@/components/UpgradeButton/UpgradeButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

const page = async () => {
  const isAuthenticated = await isAuth();

  const pricingItems = [
    {
      plan: "Free",
      tagline: "For small side projects.",
      quota: 5,
      features: [
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
      <div className="mx-auto max-w-5xl pt-5 md:pt-8">
        <Alert className="shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Heads Up!</AlertTitle>
          <AlertDescription>
            This feature is not ready for production as it is in review. No
            proper payment gateway like{" "}
            <span className="text-base text-primary">Stripe</span>,{" "}
            <span className="text-base text-primary">Razorpay</span>, are
            available in <span className="font-semibold">Nepal</span>. However,
            I have implemented{" "}
            <span className="text-base text-primary">Khalti</span> payment
            gateway for testing.
            <h3 className="font-primary my-2 flex h-10 items-center border-l-4 border-orange-300 font-semibold">
              <span className="pl-2">Test Credentials</span>
            </h3>
            <p className="text-zinc-700">
              <span className="font-semibold">Mobile Number:</span> 9800000000,
              9800000001, 9800000002
            </p>
            <p className="text-zinc-700">
              <span className="font-semibold">MPIN:</span> 1111
            </p>
            <p className="text-zinc-700">
              <span className="font-semibold">OTP:</span> 987654
            </p>
          </AlertDescription>
        </Alert>
      </div>
      <WrapWidth className="mx-auto mb-8 mt-24 max-w-5xl text-center">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing 💸</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Whether you&apos;re just trying out our service or upgrade to a PRO
            Plan, I&apos;ve got you covered. 🔥🚀
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
