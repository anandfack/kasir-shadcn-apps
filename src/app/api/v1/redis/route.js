import { redis } from "@/lib/redis";

export async function GET() {
  await redis.set("test", "redis jalan");
  const value = await redis.get("test");

  return Response.json({ value });
}