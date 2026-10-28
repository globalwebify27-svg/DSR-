export const COOKIE_NAME = "dsr_auth_session";

function getSecret(): string {
  return process.env.AUTH_SECRET || "dsr_default_secure_secret_key_2026";
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
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [data, sig] = parts;
  const expected = await signData(data);
  if (expected !== token) return false;

  // Check expiration (7 days)
  const [, timestamp] = data.split(":");
  const created = Number(timestamp);
  if (!created || Date.now() - created > 7 * 24 * 60 * 60 * 1000) {
    return false;
  }

  return true;
}

