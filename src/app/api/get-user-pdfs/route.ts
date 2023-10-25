import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";

import { getUserId, isAuth } from "@/lib/getUserDetailsServer";

export async function GET(req: NextRequest) {
  try {
    const isAuthenticated = await isAuth();

    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = await getUserId();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.file.findMany({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      return new NextResponse(error.message as string, {
        status: (error as { status?: number }).status ?? 500,
      });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
