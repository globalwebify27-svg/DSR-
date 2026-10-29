"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, signData, timingSafeCompare } from "./auth-util";
import { checkRateLimit } from "./rate-limit";

export async function loginAction(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username !== "string" || typeof password !== "string") {
    return { success: false, error: "Please enter both Login ID and Password." };
  }

  // Rate limit: 5 attempts per 60 seconds per IP / username
  const headerList = await headers();
  const clientIp =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown-ip";
  const rateLimitKey = `login:${clientIp}:${username.trim().toLowerCase()}`;
  const rateCheck = checkRateLimit(rateLimitKey, 5, 60 * 1000);

  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `Too many login attempts. Please wait ${rateCheck.retryAfterSec} seconds before trying again.`,
    };
  }

  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  if (!validUsername || !validPassword) {
    console.error("Fatal: AUTH_USERNAME or AUTH_PASSWORD is not set in environment.");
    return {
      success: false,
      error: "Server configuration error: Authentication credentials not configured.",
    };
  }

  // Timing-safe verification of credentials
  const isUsernameMatch = timingSafeCompare(username.trim(), validUsername.trim());
  const isPasswordMatch = timingSafeCompare(password, validPassword);

  if (!isUsernameMatch || !isPasswordMatch) {
    return { success: false, error: "Invalid Login ID or Password." };
  }

  const token = await signData(`${username.trim()}:${Date.now()}`);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
