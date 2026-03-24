import { redis } from "./redis";

// ambil module dari URL (bagian terakhir)
function getModuleFromPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

// helper cache utama
export async function withCacheRequest(req, fn, options = {}) {
  const { ttl = 60, prefix = "kasir", module } = options;

  const url = new URL(req.url);
  const pathname = url.pathname;

  // auto module kalau tidak dikasih
  const moduleName = module || getModuleFromPath(pathname);

  const searchParams = Object.fromEntries(url.searchParams.entries());

  const sortedParams = Object.keys(searchParams)
    .sort()
    .reduce((acc, key) => {
      acc[key] = searchParams[key];
      return acc;
    }, {});

  const key = `${prefix}:${moduleName}:${pathname}:${JSON.stringify(sortedParams)}`;

  try {
    const cached = await redis.get(key);

    if (cached) {
      console.log("⚡ HIT:", key);
      return JSON.parse(cached);
    }

    const result = await fn();

    if (result && (Array.isArray(result) ? result.length > 0 : true)) {
      await redis.set(key, JSON.stringify(result), "EX", ttl);
    }

    console.log("💾 MISS:", key);
    return result;
  } catch (error) {
    console.error("Cache error:", error);
    return await fn();
  }
}

// delete by pattern
export async function deleteCacheByPattern(pattern) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(keys);
  }
}
