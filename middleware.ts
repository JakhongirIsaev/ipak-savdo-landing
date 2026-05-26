import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkBasicAuth } from "@/lib/admin/auth";

export function middleware(req: NextRequest) {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new NextResponse("Admin auth not configured", { status: 503 });
  }

  const authHeader = req.headers.get("authorization");
  if (checkBasicAuth(authHeader, { user: expectedUser, password: expectedPassword })) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Ipak Savdo Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
