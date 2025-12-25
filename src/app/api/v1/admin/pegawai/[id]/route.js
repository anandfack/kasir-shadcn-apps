import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const pegawaiId = parseInt(params.id);

    const detailPegawai = await prisma.pegawai.findUnique({
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

    return new Response(JSON.stringify(detailPegawai), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      nip_pegawai,
      nama_pegawai,
      tanggal_lahir,
      jenis_kelamin,
      alamat_pegawai,
      nomor_telepon_pegawai,
      email_pegawai,
      jabatan_pegawai,
      is_aktif,
    } = body;

    const requiredFields = [
      { key: "nip_pegawai", label: "NIP pegawai" },
      { key: "nama_pegawai", label: "Nama pegawai" },
      { key: "tanggal_lahir", label: "Tanggal lahir" },
      { key: "jenis_kelamin", label: "Jenis kelamin" },
      { key: "alamat_pegawai", label: "Alamat pegawai" },
      { key: "nomor_telepon_pegawai", label: "Nomor telepon pegawai" },
      { key: "email_pegawai", label: "Email pegawai" },
      { key: "jabatan_pegawai", label: "Jabatan pegawai" },
    ];

    const missingFields = requiredFields.filter((field) => !body[field.key]);

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          error: `${missingFields[0].label} harus diisi`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const parsedTanggalLahir = new Date(tanggal_lahir);
    if (isNaN(parsedTanggalLahir)) {
      return new Response(
        JSON.stringify({ error: "Format tanggal lahir tidak valid" }),
        { status: 400 }
      );
    }

    const updatePegawai = await prisma.pegawai.update({
      where: { id: parseInt(id) },
      data: {
        nip_pegawai,
        nama_pegawai,
        tanggal_lahir: parsedTanggalLahir,
        jenis_kelamin,
        alamat_pegawai,
        nomor_telepon_pegawai,
        email_pegawai,
        jabatan_pegawai,
        is_aktif,
        updated_at: new Date(),
      },
    });
    return new Response(JSON.stringify(updatePegawai), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const { id } = params;
    const deletePegawai = await prisma.pegawai.update({
      where: { id: parseInt(id) },
      data: { deleted_at: new Date() },
    });
    return new Response(JSON.stringify(deletePegawai), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
