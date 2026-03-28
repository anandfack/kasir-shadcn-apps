// src/lib/verifyPublicJwt.js
import { verifyJwt } from "./verifyJwt";

export async function verifyPublicToken(token) {
  const payload = await verifyJwt(token);

  if (!payload || payload.type !== "public") {
    throw new Error("Unauthorized");
  }

  return payload;
}
