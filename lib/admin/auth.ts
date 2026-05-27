export interface ExpectedCreds {
  user: string;
  password: string;
}

function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    let _decoy = 0;
    for (let i = 0; i < a.length; i++) _decoy |= a.charCodeAt(i) ^ a.charCodeAt(i);
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function checkBasicAuth(authHeader: string | null, expected: ExpectedCreds): boolean {
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;
  const b64 = authHeader.slice(6).trim();
  let decoded: string;
  try {
    decoded = atob(b64);
  } catch {
    return false;
  }
  const idx = decoded.indexOf(":");
  if (idx < 0) return false;
  const user = decoded.slice(0, idx);
  const password = decoded.slice(idx + 1);
  const userOk = timingSafeStringEqual(user, expected.user);
  const passOk = timingSafeStringEqual(password, expected.password);
  return userOk && passOk;
}
