import { NextResponse } from "next/server";
import { verifyJWT } from "./lib/auth";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Define paths that are protected (require authentication)
  const isProtectedPath =
    path.startsWith("/dashboard") ||
    path.startsWith("/cv/") ||
    path.startsWith("/api/cv");

  // Define authentication paths
  const isAuthPath = path === "/login" || path === "/register";

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  if (isProtectedPath) {
    // If no token exists, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify token
    const payload = await verifyJWT(token);

    // If token is invalid, redirect to login
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (isAuthPath && token) {
    const payload = await verifyJWT(token);

    if (payload) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Configure the paths that should be checked by the middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cv/:path*",
    "/api/cv/:path*",
    "/login",
    "/register",
  ],
};
