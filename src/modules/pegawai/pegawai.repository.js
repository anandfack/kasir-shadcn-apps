import jsonResponse from "@/lib/jsonResponse";
import { prisma } from "@/lib/prisma";

export async function getPegawaiRepo(whereCondition) {
  return prisma.pegawai.findMany({
    select: {
      id: true,
      nip_pegawai: true,
      nama_pegawai: true,
      tanggal_lahir: true,
      jenis_kelamin: true,
      alamat_pegawai: true,
      nomor_telepon_pegawai: true,
      email_pegawai: true,
      jabatan_pegawai: true,
      is_aktif: true,
    },
    where: whereCondition,
    orderBy: {
      nama_pegawai: "asc",
    },
  });
}

export async function createPegawaiRepo(data) {
  const nowJakarta = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  return prisma.pegawai.create({
    data: {
      nip_pegawai: data.nip_pegawai,
      nama_pegawai: data.nama_pegawai,
      tanggal_lahir: data.tanggal_lahir
        ? new Date(data.tanggal_lahir)
        : nowJakarta,
      jenis_kelamin: data.jenis_kelamin,
      alamat_pegawai: data.alamat_pegawai,
      nomor_telepon_pegawai: data.nomor_telepon_pegawai,
      email_pegawai: data.email_pegawai,
      jabatan_pegawai: data.jabatan_pegawai,
      is_aktif: data.is_aktif ? data.is_aktif : true,
    },
  });
}

export async function getDetailPegawaiRepo(pegawaiId) {
  return prisma.pegawai.findUnique({
    where: {
      id: pegawaiId,
      deleted_at: null,
    },
    select: {
      id: true,
      nip_pegawai: true,
      nama_pegawai: true,
      tanggal_lahir: true,
      jenis_kelamin: true,
      alamat_pegawai: true,
      nomor_telepon_pegawai: true,
      email_pegawai: true,
      jabatan_pegawai: true,
      is_aktif: true,
      created_at: true,
      updated_at: true,
    },
  });
}

export async function updatePegawaiRepo(id, data) {
  const parsedTanggalLahir = new Date(data.tanggal_lahir);
  if (isNaN(parsedTanggalLahir)) {
    return jsonResponse(
      {
        message: "Validation Error",
      },
      400,
    );
  }
  return prisma.pegawai.update({
    where: { id: parseInt(id) },
    data: {
      nip_pegawai: data.nip_pegawai,
      nama_pegawai: data.nama_pegawai,
      tanggal_lahir: parsedTanggalLahir,
      jenis_kelamin: data.jenis_kelamin,
      alamat_pegawai: data.alamat_pegawai,
      nomor_telepon_pegawai: data.nomor_telepon_pegawai,
      email_pegawai: data.email_pegawai,
      jabatan_pegawai: data.jabatan_pegawai,
      is_aktif: data.is_aktif,
    },
  });
}

export async function deletePegawaiRepo(id) {
  return prisma.pegawai.update({
    where: { id: parseInt(id) },
    data: { deleted_at: new Date() },
  });
}
