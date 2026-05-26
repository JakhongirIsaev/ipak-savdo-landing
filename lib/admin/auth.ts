export interface ExpectedCreds {
  user: string;
  password: string;
}

export function checkBasicAuth(authHeader: string | null, expected: ExpectedCreds): boolean {
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;
  const b64 = authHeader.slice(6).trim();
  let decoded: string;
  try {
    decoded = Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return false;
  }
  const idx = decoded.indexOf(":");
  if (idx < 0) return false;
  const user = decoded.slice(0, idx);
  const password = decoded.slice(idx + 1);
  return user === expected.user && password === expected.password;
}
