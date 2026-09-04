import "server-only";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "./env";

export const SESSION_COOKIE = "zk_admin_session";
export const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

export function signAdminToken() {
  const options = { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions;
  return jwt.sign({ role: "admin" }, env.JWT_SECRET, options);
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    jwt.verify(token, env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminToken(store.get(SESSION_COOKIE)?.value);
}

/** Call at the top of every admin route handler; returns a 401 response to return early, or null if authorized. */
export async function requireAdmin(): Promise<NextResponse | null> {
  const ok = await isAdminRequest();
  if (!ok) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return null;
}
