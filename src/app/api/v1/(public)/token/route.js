import jsonResponse from "@/lib/jsonResponse";
import jwt from "jsonwebtoken";

export async function GET() {
  const token = jwt.sign(
    {
      type: "public",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
    },
  );

  return jsonResponse({
    token,
  });
}
