import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import jsonResponse from "@/lib/jsonResponse";

export async function getUserPermissions(loginpemakaiId) {
  try {
    const cached = await redis.smembers(
      `user:permissions:${loginpemakaiId}`,
    );

    if (cached.length > 0) {
      return cached;
    }

    const userRoles = await prisma.userRole.findMany({
      where: { loginpemakai_id: loginpemakaiId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const permissions = [
      ...new Set(
        userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.name),
        ),
      ),
    ];

    if (permissions.length > 0) {
      await redis.sadd(`user:permissions:${loginpemakaiId}`, ...permissions);
      await redis.expire(`user:permissions:${loginpemakaiId}`, 1800);
    }

    return permissions;
  } catch (error) {
    console.error("getUserPermissions error:", error);
    return [];
  }
}

export async function clearUserPermissionCache(loginpemakaiId) {
  try {
    await redis.del(`user:permissions:${loginpemakaiId}`);
  } catch (error) {
    console.error("clearUserPermissionCache error:", error);
  }
}

export async function requirePermission(loginpemakaiId, permissionName) {
  const permissions = await getUserPermissions(loginpemakaiId);

  if (!permissions.includes(permissionName)) {
    throw new ForbiddenError(
      `Akses ditolak, memerlukan permission: ${permissionName}`,
    );
  }
}

export async function requireAnyPermission(loginpemakaiId, permissionNames) {
  const permissions = await getUserPermissions(loginpemakaiId);

  const hasAny = permissionNames.some((p) => permissions.includes(p));

  if (!hasAny) {
    throw new ForbiddenError(
      `Akses ditolak, memerlukan salah satu permission: ${permissionNames.join(", ")}`,
    );
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Akses ditolak") {
    super(message);
    this.name = "ForbiddenError";
    this.status = 403;
  }
}

export function handlePermissionError(error) {
  if (error instanceof ForbiddenError) {
    return jsonResponse({ message: error.message }, 403);
  }

  return jsonResponse({ message: "Internal Server Error" }, 500);
}
