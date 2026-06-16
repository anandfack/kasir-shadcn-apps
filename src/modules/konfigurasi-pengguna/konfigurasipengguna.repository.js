import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function getKonfigurasiPenggunaRepo() {
  return prisma.loginPemakai.findMany({
    where: { deleted_at: null },
    select: {
      id: true,
      username: true,
      last_login: true,
      email: true,
      verified: true,
      is_aktif: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
      pegawai: {
        select: {
          id: true,
          nama_pegawai: true,
        },
      },
      userRoles: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
              label: true,
            },
          },
        },
      },
    },
  });
}

export async function createUserRepo(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.loginPemakai.create({
    data: {
      pegawai_id: data.pegawai_id,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      verified: data.verified ? data.verified : true,
      is_aktif: data.is_aktif ? data.is_aktif : true,
    },
  });

  if (data.role_ids && Array.isArray(data.role_ids) && data.role_ids.length > 0) {
    await prisma.userRole.createMany({
      data: data.role_ids.map((roleId) => ({
        loginpemakai_id: user.id,
        role_id: roleId,
      })),
    });
  }

  return user;
}

export async function updateUserRepo(id, data) {
  const updateData = {
    pegawai_id: Number(data.pegawai_id),
    username: data.username,
    email: data.email,
    is_aktif: data.is_aktif,
  };

  const result = await prisma.loginPemakai.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  if (data.role_ids && Array.isArray(data.role_ids)) {
    await prisma.userRole.deleteMany({
      where: { loginpemakai_id: parseInt(id) },
    });

    if (data.role_ids.length > 0) {
      await prisma.userRole.createMany({
        data: data.role_ids.map((roleId) => ({
          loginpemakai_id: parseInt(id),
          role_id: roleId,
        })),
      });
    }
  }

  return result;
}

export async function deleteUserRepo(id) {
  return prisma.loginPemakai.update({
    where: { id: parseInt(id) },
    data: { deleted_at: new Date() },
  });
}

export async function resetPasswordRepo(id, data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.loginPemakai.update({
    where: { id: Number(id) },
    data: {
      password: hashedPassword,
    },
  });
}
