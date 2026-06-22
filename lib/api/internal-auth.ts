function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function bearerToken(req: Request): string | null {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export function requireInternalToken(req: Request): Response | null {
  const expected = process.env.AIOS_INTERNAL_TOKEN;
  if (!expected) {
    console.error("AIOS_INTERNAL_TOKEN not configured");
    return new Response("not configured", { status: 503 });
  }

  const received = bearerToken(req);
  if (!received || !timingSafeEqual(received, expected)) {
    return new Response("unauthorized", { status: 401 });
  }

  return null;
}
