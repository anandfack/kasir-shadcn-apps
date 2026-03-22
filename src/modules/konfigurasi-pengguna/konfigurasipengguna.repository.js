import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function getKonfigurasiPenggunaRepo() {
  return prisma.loginPemakai.findMany({
    where: { deleted_at: null },
    select: {
      id: true,
      username: true,
      last_login: true,
      role: true,
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
    },
  });
}

export async function createUserRepo(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.loginPemakai.create({
    data: {
      pegawai_id: data.pegawai_id,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      verified: data.verified ? data.verified : true,
      is_aktif: data.is_aktif ? data.is_aktif : true,
    },
  });
}

export async function updateUserRepo(id, data) {
  return prisma.loginPemakai.update({
    where: { id: parseInt(id) },
    data: {
      pegawai_id: Number(data.pegawai_id),
      username: data.username,
      email: data.email,
      role: data.role,
      is_aktif: data.is_aktif,
    },
  });
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
