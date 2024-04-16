import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();

    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await getUser();
    const userId = user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(req.url);
    const fileId = url.searchParams.get("fileId");

    if (!fileId) return new NextResponse("Invalid query", { status: 400 });

    const requestedFile = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!requestedFile) {
      return NextResponse.json({ uploadStatus: "PENDING" as const });
    }

    return NextResponse.json({ uploadStatus: requestedFile.uploadStatus });
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      return new NextResponse(error.message as string, {
        status: (error as { status?: number }).status ?? 500,
      });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
