import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

const JWT_SECRET_KEY = process.env.JWT_SECRET;

// Note: Middleware runs on the edge/server, so we prefer fail-safe behavior.
// However, for security, we must not use a default key.
// If env is missing, verification will simply fail (which is secure).
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_KEY || "");

interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  role: "student" | "teacher";
  name: string;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    if (!process.env.JWT_SECRET) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Validate that payload has required fields
    if (
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      (payload.role === "student" || payload.role === "teacher") &&
      typeof payload.name === "string"
    ) {
      return payload as SessionPayload;
    }

    return null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookies
  const token = request.cookies.get("session")?.value;

  // Verify token
  const session = token ? await verifyToken(token) : null;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "teacher") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect student routes
  if (pathname.startsWith("/student")) {
    if (!session || session.role !== "student") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login" && session) {
    if (session.role === "teacher") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/login"],
};
