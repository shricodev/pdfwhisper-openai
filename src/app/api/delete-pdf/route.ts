import { ZodError } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";

import { getUserId } from "@/lib/getUserDetailsServer";
import { DeletePDFValidator } from "@/lib/validators/deletePDF";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Parse the body with zod to make sure the request is what we expect.
    const { id } = DeletePDFValidator.parse(body);

    // Validate all the data is there.
    // id is sent from the frontend. They both are same.
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const file = await db.file.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!file) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await db.file.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true, file });
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
