import axios from "axios";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Convert } from "easy-currencies";
import { NextRequest, NextResponse } from "next/server";

import { PAID_PLAN_PRICE } from "@/config/config";

import { db } from "@/db";

import { absoluteUrl } from "@/lib/utils";
import { getUserSubscriptionPlan } from "@/lib/khalti";
import { PaymentValidator } from "@/lib/validators/payment";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isAuth = await isAuthenticated();

    if (!isAuth) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await getUser();
    const userId = user?.id;

    // Not so necessary as it is already handled above, but just to be sure.
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan();
    if (subscriptionPlan.isSubscribed) return;

    // Parse the body with zod to make sure the request is what we expect.
    const body = await req.json();

    const { customer_info } = PaymentValidator.parse(body);

    const amountFromUSDtoNPR = await Convert(PAID_PLAN_PRICE)
      .from("USD")
      .to("NPR");
    const websiteURL = absoluteUrl("/");
    const payload = {
      amount: amountFromUSDtoNPR * 100, // convert to paisa
      customer_info,
      // the name equals "userId" since we don't have a name for the user yet from hanko, so use the userId for now.
      purchase_order_id: uuidv4() + "_" + customer_info.name,
      purchase_order_name: "Langchain Subscription",
      return_url: `${websiteURL}dashboard`,
      website_url: websiteURL,
    };

    const { data } = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_LIVE_SECRET_KEY}`,
        },
      },
    );

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse(error.message, { status: 422 });
    }

    if (error && typeof error === "object" && "message" in error) {
      return new NextResponse(error.message as string, {
        status: (error as { status?: number }).status ?? 500,
      });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
