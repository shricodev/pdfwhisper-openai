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
import { getUserId, isAuth } from "@/lib/getUserDetailsServer";

export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await isAuth();

    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = await getUserId();

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
    console.log(body);

    const { customer_info } = PaymentValidator.parse(body);

    const amountFromUSDtoNPR = await Convert(PAID_PLAN_PRICE)
      .from("USD")
      .to("NPR");
    const websiteURL = absoluteUrl("/");
    const payload = {
      // amount: amountFromUSDtoNPR * 100, // convert to paisa
      amount: 900 * 100, // TODO: Switch back to the previous line. This is for testing purposes.
      customer_info,
      purchase_order_id: uuidv4() + "_" + customer_info.name, // the name equals "userId" since we don't have a name for the user yet, so use the userId for now.
      purchase_order_name: "Langchain Subscription",
      return_url: `${websiteURL}dashboard`,
      website_url: websiteURL,
    };

    console.log("this is thee payload", payload);

    const { data, status } = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_LIVE_SECRET_KEY}`,
        },
      },
    );

    console.log(data, status);

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
