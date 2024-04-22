import { StripeBillingForm } from "@/components/StripeBillingForm/StripeBillingForm";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const Page = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <StripeBillingForm subscriptionPlan={subscriptionPlan} />;
};

export default Page;
