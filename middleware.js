import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(request) {
  // Check if the request is for the API routes that need protection
  if (request.nextUrl.pathname.startsWith("/api/cv")) {
    // Get the token from the Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { valid, expired } = verifyToken(token);

    if (!valid) {
      return NextResponse.json(
        { message: expired ? "Token expired" : "Invalid token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/cv/:path*"],
};
