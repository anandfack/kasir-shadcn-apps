import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCurrentUser(token) {
  if (!token) return null;

  // 1. verify token
  const payload = await verifyJwt(token);
  if (!payload) return null;

  // 2. ambil pegawai
  const pegawai = await prisma.pegawai.findUnique({
    where: { id: payload.pegawai_id },
    select: {
      id: true,
      nama_pegawai: true,
      nip_pegawai: true,
    },
  });

  return {
    id: payload.id,
    role: payload.role,
    pegawai,
  };
}
