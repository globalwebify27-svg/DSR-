import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit } from "../src/lib/rate-limit.js";

describe("Sliding Window Rate Limiter", () => {
  test("allows requests under the rate limit threshold", () => {
    const key = `test-user-${Date.now()}`;
    const r1 = checkRateLimit(key, 3, 1000);
    const r2 = checkRateLimit(key, 3, 1000);
    const r3 = checkRateLimit(key, 3, 1000);

    assert.equal(r1.allowed, true);
    assert.equal(r2.allowed, true);
    assert.equal(r3.allowed, true);
    assert.equal(r3.remaining, 0);
  });

  test("blocks requests when rate limit threshold is exceeded", () => {
    const key = `test-block-${Date.now()}`;
    checkRateLimit(key, 2, 5000);
    checkRateLimit(key, 2, 5000);

    const blocked = checkRateLimit(key, 2, 5000);
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.remaining, 0);
    assert.ok(blocked.retryAfterSec > 0);
  });
});

