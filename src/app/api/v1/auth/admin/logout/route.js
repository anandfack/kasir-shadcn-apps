import jsonResponse from "@/lib/jsonResponse";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({ message: "Berhasil Logout" });

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}
