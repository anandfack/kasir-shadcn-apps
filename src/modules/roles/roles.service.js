import { prisma } from "@/lib/prisma";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { requirePermission, ForbiddenError } from "@/lib/permission";

export async function getRoles(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    await requirePermission(auth.user.id, "roles.view");

    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { userRoles: true, rolePermissions: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return jsonResponse({ message: "OK", data: roles }, 200);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return jsonResponse({ message: error.message }, 403);
    }

    console.error("Error getRoles:", error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}

export async function createRole(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    await requirePermission(auth.user.id, "roles.create");

    const { name, label, description } = await req.json();

    const errors = {};

    if (!name || name.trim() === "") {
      errors.name = "Nama role wajib diisi";
    }

    if (!label || label.trim() === "") {
      errors.label = "Label role wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ message: "Validation Error", errors }, 400);
    }

    const existing = await prisma.role.findUnique({ where: { name } });

    if (existing) {
      return jsonResponse({ message: "Nama role sudah digunakan" }, 400);
    }

    const role = await prisma.role.create({
      data: { name, label, description, is_system: false },
    });

    return jsonResponse(
      { message: "Role berhasil ditambahkan", data: role },
      201,
    );
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return jsonResponse({ message: error.message }, 403);
    }

    console.error("Error createRole:", error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}

export async function updateRole(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    await requirePermission(auth.user.id, "roles.edit");

    const { id } = params;
    const { name, label, description } = await req.json();

    const existing = await prisma.role.findUnique({ where: { id: Number(id) } });

    if (!existing) {
      return jsonResponse({ message: "Role tidak ditemukan" }, 404);
    }

    if (existing.is_system) {
      return jsonResponse({ message: "Role sistem tidak bisa diedit" }, 400);
    }

    const errors = {};

    if (!name || name.trim() === "") {
      errors.name = "Nama role wajib diisi";
    }

    if (!label || label.trim() === "") {
      errors.label = "Label role wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ message: "Validation Error", errors }, 400);
    }

    const duplicate = await prisma.role.findFirst({
      where: { name, NOT: { id: Number(id) } },
    });

    if (duplicate) {
      return jsonResponse({ message: "Nama role sudah digunakan" }, 400);
    }

    const role = await prisma.role.update({
      where: { id: Number(id) },
      data: { name, label, description },
    });

    return jsonResponse({ message: "Role berhasil diperbarui", data: role }, 200);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return jsonResponse({ message: error.message }, 403);
    }

    console.error("Error updateRole:", error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}

export async function deleteRole(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    await requirePermission(auth.user.id, "roles.delete");

    const { id } = params;

    const existing = await prisma.role.findUnique({
      where: { id: Number(id) },
      include: { _count: { select: { userRoles: true } } },
    });

    if (!existing) {
      return jsonResponse({ message: "Role tidak ditemukan" }, 404);
    }

    if (existing.is_system) {
      return jsonResponse({ message: "Role sistem tidak bisa dihapus" }, 400);
    }

    if (existing._count.userRoles > 0) {
      return jsonResponse(
        { message: "Role masih digunakan oleh user, tidak bisa dihapus" },
        400,
      );
    }

    await prisma.role.delete({ where: { id: Number(id) } });

    return jsonResponse({ message: "Role berhasil dihapus" }, 200);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return jsonResponse({ message: error.message }, 403);
    }

    console.error("Error deleteRole:", error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}

export async function getPermissions(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    await requirePermission(auth.user.id, "roles.view");

    const permissions = await prisma.permission.findMany({
      orderBy: [{ group: "asc" }, { action: "asc" }],
    });

    const grouped = permissions.reduce((acc, p) => {
      if (!acc[p.group]) {
        acc[p.group] = [];
      }
      acc[p.group].push(p);
      return acc;
    }, {});

    return jsonResponse({ message: "OK", data: grouped }, 200);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return jsonResponse({ message: error.message }, 403);
    }

    console.error("Error getPermissions:", error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}

export async function getRolePermissions(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    await requirePermission(auth.user.id, "roles.view");

    const { id } = params;

    const role = await prisma.role.findUnique({
      where: { id: Number(id) },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });

    if (!role) {
      return jsonResponse({ message: "Role tidak ditemukan" }, 404);
    }

    return jsonResponse(
      {
        message: "OK",
        data: {
          role: { id: role.id, name: role.name, label: role.label },
          permissionIds: role.rolePermissions.map((rp) => rp.permission_id),
        },
      },
      200,
    );
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return jsonResponse({ message: error.message }, 403);
    }

    console.error("Error getRolePermissions:", error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}

export async function updateRolePermissions(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    await requirePermission(auth.user.id, "roles.assign-permission");

    const { id } = params;
    const { permission_ids } = await req.json();

    const role = await prisma.role.findUnique({ where: { id: Number(id) } });

    if (!role) {
      return jsonResponse({ message: "Role tidak ditemukan" }, 404);
    }

    await prisma.rolePermission.deleteMany({
      where: { role_id: Number(id) },
    });

    if (permission_ids && permission_ids.length > 0) {
      await prisma.rolePermission.createMany({
        data: permission_ids.map((pid) => ({
          role_id: Number(id),
          permission_id: pid,
        })),
        skipDuplicates: true,
      });
    }

    const userRoles = await prisma.userRole.findMany({
      where: { role_id: Number(id) },
    });

    const { clearUserPermissionCache } = await import("@/lib/permission");
    for (const ur of userRoles) {
      await clearUserPermissionCache(ur.loginpemakai_id);
    }

    return jsonResponse({ message: "Permission berhasil diperbarui" }, 200);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return jsonResponse({ message: error.message }, 403);
    }

    console.error("Error updateRolePermissions:", error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}
