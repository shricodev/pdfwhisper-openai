import { ZodError } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { INFINITE_QUERY_LIMIT } from "@/config/config";

import { db } from "@/db";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { GetMessageValidator } from "@/lib/validators/getMessage";

export async function GET(req: NextRequest) {
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

    const url = new URL(req.url);
    const qfileId = url.searchParams.get("fileId");
    const qlimit = url.searchParams.get("limit");
    const qcursor = url.searchParams.get("cursor");

    const payload = {
      fileId: qfileId,
      limit: qlimit ? parseInt(qlimit) : undefined,
      cursor: qcursor ? qcursor : undefined,
    };

    // Parse the body with zod to make sure the request is what we expect.
    const { fileId, cursor, limit } = GetMessageValidator.parse(
      JSON.parse(JSON.stringify(payload)),
    );

    const messageLimit = limit ?? INFINITE_QUERY_LIMIT;

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    const messages = await db.message.findMany({
      take: messageLimit + 1,
      where: {
        fileId: file.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        isUserMessage: true,
        createdAt: true,
        text: true,
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (messages.length > messageLimit) {
      const nextItem = messages.pop();
      nextCursor = nextItem?.id;
    }

    return NextResponse.json({
      messages,
      nextCursor,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("zod error", { status: 422 });
    }

    if (error && typeof error === "object" && "message" in error) {
      return new NextResponse(error.message as string, {
        status: (error as { status?: number }).status ?? 500,
      });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
