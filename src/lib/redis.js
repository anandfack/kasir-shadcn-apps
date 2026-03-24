import Redis from "ioredis";

const globalForRedis = globalThis;

export const redis =
  globalForRedis.redis ||
  new Redis({
    host: "127.0.0.1",
    port: 6379,
    password: "123456",
  });

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
