import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "bathhub-token";

function getSecret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "bathhub-dev-secret"
  );
}

export type SessionPayload = {
  sub: string; // userId
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
};

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Server-only helpers (use next/headers — only call from Route Handlers / Server Components)
export async function setAuthCookie(payload: SessionPayload) {
  const { cookies } = await import("next/headers");
  const token = await signToken(payload);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAuthCookie() {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
