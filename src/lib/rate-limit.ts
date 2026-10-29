interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding-window rate limiter for server actions and API routes.
 *
 * @param key Unique identifier (e.g. IP address, username, or composite)
 * @param maxAttempts Maximum allowed attempts in the window
 * @param windowMs Window duration in milliseconds (default: 60 seconds)
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitMap.get(key) || { timestamps: [] };

  // Retain only timestamps within the current window
  const recent = record.timestamps.filter((ts) => ts > windowStart);

  if (recent.length >= maxAttempts) {
    const oldest = recent[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec,
    };
  }

  recent.push(now);
  rateLimitMap.set(key, { timestamps: recent });

  // Periodic cleanup if the map grows
  if (rateLimitMap.size > 2000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.timestamps.every((ts) => ts <= windowStart)) {
        rateLimitMap.delete(k);
      }
    }
  }

  return {
    allowed: true,
    remaining: maxAttempts - recent.length,
    retryAfterSec: 0,
  };
}

