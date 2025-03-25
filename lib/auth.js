import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Check if JWT_SECRET is available
if (!process.env.JWT_SECRET) {
  // In development, show a clear error message
  if (process.env.NODE_ENV === "development") {
    console.error(
      "JWT_SECRET is missing. Please add JWT_SECRET to your .env.local file"
    );
  } else {
    // In production, log the error
    console.error(
      "JWT_SECRET is missing. Please add JWT_SECRET to your environment variables in Vercel"
    );
  }
}

// Use a fallback secret for development only (not secure for production)
const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-for-development-only";

export async function signJWT(payload) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(JWT_SECRET));
}

export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  return payload;
}
