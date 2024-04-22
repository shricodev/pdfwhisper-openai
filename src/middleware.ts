import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  return withAuth(req, {
    isReturnToCurrentPage: true,
  });
}

// Do not let unauthenticated users to access these endpoints.
export const config = {
  matcher: ["/dashboard/:path*", "/auth-callback"],
};
