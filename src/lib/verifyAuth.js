import jwt from "jsonwebtoken";

export function verifyAuth(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return { error: "Token tidak ditemukan" };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch {
    return { error: "Token tidak valid atau kadaluarsa" };
  }
}
