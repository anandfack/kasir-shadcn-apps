import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (e) {
    return null; // token invalid / expired
  }
}

export async function middleware(req) {
  // console.log("🔥 Middleware executed for:", req.nextUrl.pathname);

  const token = req.cookies.get("token")?.value;
  // console.log("🔑 Token found?", token ? "YES" : "NO");

  // =============================
  // 1. Cek akses ke login admin
  // =============================
  if (req.nextUrl.pathname.startsWith("/auth-admin/login")) {
    // console.log("📌 Akses ke halaman /auth-admin/login");

    if (token) {
      const decoded = await verifyToken(token);
      console.log("🧪 Token decoded (login page):", decoded);

      if (decoded?.role === "admin") {
        // console.log("➡️ Redirect ke /admin/dashboard");
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }
  }

  // =============================
  // 2. Proteksi halaman admin
  // =============================
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // console.log("🛡️ Proteksi halaman admin");

    if (!token) {
      // console.log("❌ Tidak ada token → redirect ke login admin");
      return NextResponse.redirect(new URL("/auth-admin/login", req.url));
    }

    const decoded = await verifyToken(token);
    // console.log("🔍 Token decoded (admin area):", decoded);

    if (!decoded || decoded.role !== "admin") {
      // console.log("⛔ Token invalid atau bukan admin → redirect");
      return NextResponse.redirect(new URL("/auth-admin/login", req.url));
    }
  }

  // console.log("✅ Lolos middleware → lanjut");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth-admin/login", "/api/v1/admin/:path*"],
};
