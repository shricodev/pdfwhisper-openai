import { ZodError } from "zod";
import { NextResponse } from "next/server";

import { db } from "@/db";

import { getUserId } from "@/lib/getUserDetailsServer";
import { AuthCallbackValidator } from "@/lib/validators/authCallback";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    // Parse the body with zod to make sure the request is what we expect.
    const { email, id } = AuthCallbackValidator.parse(body);

    // Validate all the data is there.
    // id is sent from the frontend. They both are same.
    if (!userId || !email || !id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: userId,
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
