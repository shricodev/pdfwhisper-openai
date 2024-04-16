import { ZodError } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { AuthCallbackValidator } from "@/lib/validators/authCallback";
import { trpc } from "@/app/_trpc/client";

export async function POST(req: NextRequest) {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();

    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await getUser();
    const userId = user?.id;

    const body = await req.json();
    // Parse the body with zod to make sure the request is what we expect.
    const { email, id } = AuthCallbackValidator.parse(body);

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: userId ?? "",
          email: email,
        },
      });
    }
    return NextResponse.json({ success: true });
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
