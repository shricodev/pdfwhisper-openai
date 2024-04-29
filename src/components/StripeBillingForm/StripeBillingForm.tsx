"use client";

import { trpc } from "@/app/_trpc/client";
import WrapWidth from "@/helpers/WrapWidth";
import { toast } from "@/hooks/use-toast";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Props {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

export const StripeBillingForm = ({ subscriptionPlan }: Props) => {
  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;
        if (!url)
          toast({
            title: "Server Error!",
            description: "Please try again later.",
            variant: "destructive",
          });
      },
    });

  return (
    <WrapWidth className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(event) => {
          event.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently <strong>{subscriptionPlan.isSubscribed ? "subscribed" : "not subscribed"}</strong> to our plan.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit">
              {isLoading ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? "Manage Subscription"
                : "Upgrade to PRO"}
            </Button>

            {subscriptionPlan.isSubscribed ? (
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled
                  ? "Your plan will be canceled on "
                  : "Your plan renews on "}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}
                .
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </WrapWidth>
  );
};
