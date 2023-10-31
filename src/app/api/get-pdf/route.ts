import { ZodError } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";

import { GetPDFValidator } from "@/lib/validators/getUserPDF";
import { getUserId, isAuth } from "@/lib/getUserDetailsServer";

export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await isAuth();

    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = await getUserId();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { key } = GetPDFValidator.parse(body);

    if (!key) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Add a 3 sec sleep time to accomodate the uploadThing onUploadComplete function.
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const file = await db.file.findFirst({
      where: {
        key,
        userId,
      },
    });

    if (!file) {
      return new NextResponse("The requested file was not found", {
        status: 404,
      });
    }

    return NextResponse.json(file);
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
