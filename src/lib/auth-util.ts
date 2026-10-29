export const COOKIE_NAME = "dsr_auth_session";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Fatal: AUTH_SECRET must be configured in environment variables.");
    }
    return "dsr_local_development_secret_key_32bytes_min";
  }
  return secret;
}

// Constant-time string comparison to prevent timing attacks
export function timingSafeCompare(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);

  if (bufA.byteLength !== bufB.byteLength) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < bufA.byteLength; i++) {
    mismatch |= bufA[i] ^ bufB[i];
  }

  return mismatch === 0;
}

export async function signData(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${data}.${hex}`;
}

export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [data] = parts;
  const expected = await signData(data);

  // Constant-time comparison
  if (!timingSafeCompare(expected, token)) {
    return false;
  }

  // Check expiration (7 days)
  const lastColonIndex = data.lastIndexOf(":");
  if (lastColonIndex === -1) return false;

  const timestampStr = data.substring(lastColonIndex + 1);
  const created = Number(timestampStr);
  if (!created || Date.now() - created > 7 * 24 * 60 * 60 * 1000) {
    return false;
  }

  return true;
}
