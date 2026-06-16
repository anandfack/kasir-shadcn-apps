import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (req.nextUrl.pathname.startsWith("/auth-admin/login")) {
    if (token) {
      const decoded = await verifyToken(token);

      if (decoded?.role_ids?.length > 0) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth-admin/login", req.url));
    }

    const decoded = await verifyToken(token);

    if (!decoded || !decoded.id) {
      return NextResponse.redirect(new URL("/auth-admin/login", req.url));
    }

    if (!decoded.role_ids || decoded.role_ids.length === 0) {
      return NextResponse.redirect(new URL("/auth-admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth-admin/login", "/api/v1/admin/:path*"],
};
