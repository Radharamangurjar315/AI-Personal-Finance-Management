import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Skip public routes
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ✅ Get JWT token from cookies
  const token = req.cookies.get("token")?.value;
  if (!token) {
    console.warn("❌ Missing token for", pathname);

    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Unauthorized - No Token" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Verify JWT
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (err) {
    console.error("❌ Invalid token in middleware:", err);

    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Unauthorized - Invalid Token" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/challenges/:path*",
    "/api/transactions/:path*",
    "/api/user/:path*",
  ],
};
