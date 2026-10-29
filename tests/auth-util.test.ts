import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  signData,
  verifySessionToken,
  timingSafeCompare,
} from "../src/lib/auth-util.js";

describe("Authentication Utilities (HMAC Token Security)", () => {
  test("timingSafeCompare compares strings correctly", () => {
    assert.equal(timingSafeCompare("secret123", "secret123"), true);
    assert.equal(timingSafeCompare("secret123", "secret124"), false);
    assert.equal(timingSafeCompare("secret123", "secret"), false);
    assert.equal(timingSafeCompare("", ""), true);
  });

  test("signData creates valid signed token with signature", async () => {
    const data = "admin:1730000000000";
    const token = await signData(data);

    assert.ok(token.startsWith(data));
    assert.equal(token.split(".").length, 2);
    const signature = token.split(".")[1];
    assert.equal(signature.length, 64); // SHA-256 hex is 64 chars
  });

  test("verifySessionToken validates legitimate token", async () => {
    const data = `admin:${Date.now()}`;
    const token = await signData(data);
    const isValid = await verifySessionToken(token);

    assert.equal(isValid, true);
  });

  test("verifySessionToken rejects tampered signature", async () => {
    const data = `admin:${Date.now()}`;
    const token = await signData(data);
    const tampered = token.slice(0, -4) + "0000";

    const isValid = await verifySessionToken(tampered);
    assert.equal(isValid, false);
  });

  test("verifySessionToken rejects tampered data payload", async () => {
    const data = `admin:${Date.now()}`;
    const token = await signData(data);
    const signature = token.split(".")[1];
    const forged = `attacker:${Date.now()}.${signature}`;

    const isValid = await verifySessionToken(forged);
    assert.equal(isValid, false);
  });

  test("verifySessionToken rejects expired token (> 7 days)", async () => {
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    const data = `admin:${eightDaysAgo}`;
    const token = await signData(data);

    const isValid = await verifySessionToken(token);
    assert.equal(isValid, false);
  });

  test("verifySessionToken rejects null, empty, or malformed strings", async () => {
    assert.equal(await verifySessionToken(null), false);
    assert.equal(await verifySessionToken(undefined), false);
    assert.equal(await verifySessionToken(""), false);
    assert.equal(await verifySessionToken("invalid-token-no-dot"), false);
    assert.equal(await verifySessionToken("a.b.c"), false);
  });
});

