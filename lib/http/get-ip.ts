export function getClientIp(req: Request): string | null {
  const real = req.headers.get("x-real-ip");
  if (real) {
    const trimmed = real.trim();
    if (trimmed) return trimmed;
  }
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const last = xff
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .pop();
    if (last) return last;
  }
  return null;
}
