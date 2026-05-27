import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkBasicAuth } from "@/lib/admin/auth";

type AttemptRecord = { fails: number; firstFailAt: number; lockUntil: number };
const adminFailures = new Map<string, AttemptRecord>();
const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

function getIp(req: NextRequest): string {
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const last = xff.split(",").map((s) => s.trim()).filter(Boolean).pop();
    if (last) return last;
  }
  return "__unknown__";
}

function recordFail(ip: string): boolean {
  const now = Date.now();
  const entry = adminFailures.get(ip);
  if (!entry || now - entry.firstFailAt > WINDOW_MS) {
    adminFailures.set(ip, { fails: 1, firstFailAt: now, lockUntil: 0 });
    return false;
  }
  entry.fails += 1;
  if (entry.fails >= MAX_FAILS) {
    entry.lockUntil = now + LOCKOUT_MS;
    return true;
  }
  return false;
}

function isLocked(ip: string): boolean {
  const entry = adminFailures.get(ip);
  if (!entry) return false;
  if (entry.lockUntil > Date.now()) return true;
  if (entry.lockUntil > 0 && entry.lockUntil <= Date.now()) {
    adminFailures.delete(ip);
  }
  return false;
}

function recordSuccess(ip: string): void {
  adminFailures.delete(ip);
}

export function middleware(req: NextRequest) {
  const redirectBase = process.env.LEGACY_REDIRECT_TO;
  if (redirectBase) {
    const target = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      redirectBase,
    );
    return NextResponse.redirect(target, 308);
  }

  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const ip = getIp(req);

  if (isLocked(ip)) {
    return new NextResponse("Too many failed attempts. Try again later.", {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(LOCKOUT_MS / 1000)) },
    });
  }

  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new NextResponse("Admin auth not configured", { status: 503 });
  }

  const authHeader = req.headers.get("authorization");
  if (checkBasicAuth(authHeader, { user: expectedUser, password: expectedPassword })) {
    recordSuccess(ip);
    return NextResponse.next();
  }

  const locked = recordFail(ip);
  if (locked) {
    return new NextResponse("Too many failed attempts. Try again later.", {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(LOCKOUT_MS / 1000)) },
    });
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="BirLiy Admin"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
