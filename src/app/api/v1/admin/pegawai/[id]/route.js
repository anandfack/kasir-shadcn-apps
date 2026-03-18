import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import {
  deletePegawai,
  getDetailPegawai,
  updatePegawai,
} from "@/modules/pegawai/pegawai.service";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  return getDetailPegawai(req, { params });
}

// export const PUT = async (req, { params }) => {
//   try {
//     const auth = verifyAuth(req);

//     if (auth.error) {
//       return jsonResponse({ message: auth.error }, 401);
//     }

//     const { id } = params;
//     const body = await req.json();
//     const {
//       nip_pegawai,
//       nama_pegawai,
//       tanggal_lahir,
//       jenis_kelamin,
//       alamat_pegawai,
//       nomor_telepon_pegawai,
//       email_pegawai,
//       jabatan_pegawai,
//       is_aktif,
//     } = body;

//     const errors = {};
//     if (!nip_pegawai || nip_pegawai.trim() === "") {
//       errors.nip_pegawai = "NIP Pegawai wajib diisi";
//     }
//     if (!nama_pegawai || nama_pegawai.trim() === "") {
//       errors.nama_pegawai = "Nama Pegawai wajib diisi";
//     }
//     if (!tanggal_lahir || tanggal_lahir.trim() === "") {
//       errors.tanggal_lahir = "Tanggal Lahir wajib diisi";
//     }
//     if (!jenis_kelamin || jenis_kelamin.trim() === "") {
//       errors.jenis_kelamin = "Jenis Kelamin wajib diisi";
//     }
//     if (!alamat_pegawai || alamat_pegawai.trim() === "") {
//       errors.alamat_pegawai = "Alamat Pegawai wajib diisi";
//     }
//     if (nomor_telepon_pegawai !== undefined) {
//       const phone = nomor_telepon_pegawai?.trim();

//       if (!phone) {
//         errors.nomor_telepon_pegawai = "Nomor telepon tidak boleh kosong";
//       } else if (!/^\d+$/.test(phone)) {
//         errors.nomor_telepon_pegawai = "Nomor telepon hanya boleh berisi angka";
//       } else if (phone.length < 9 || phone.length > 15) {
//         errors.nomor_telepon_pegawai = "Panjang nomor telepon tidak valid";
//       } else if (!/^(\+62|62|08)/.test(phone)) {
//         errors.nomor_telepon_pegawai =
//           "Format nomor telepon Indonesia tidak valid";
//       } else if (/^(\d)\1+$/.test(phone)) {
//         errors.nomor_telepon_pegawai = "Nomor telepon tidak valid";
//       }
//     }
//     if (!email_pegawai || email_pegawai.trim() === "") {
//       errors.email_pegawai = "Email Pegawai wajib diisi";
//     }
//     if (!jabatan_pegawai || jabatan_pegawai.trim() === "") {
//       errors.jabatan_pegawai = "Jabatan Pegawai wajib diisi";
//     }

//     if (Object.keys(errors).length > 0) {
//       return jsonResponse(
//         {
//           message: "Validation Error",
//           errors,
//         },
//         400,
//       );
//     }

//     const parsedTanggalLahir = new Date(tanggal_lahir);
//     if (isNaN(parsedTanggalLahir)) {
//       return jsonResponse(
//         {
//           message: "Validation Error",
//         },
//         400,
//       );
//     }

//     const updatePegawai = await prisma.pegawai.update({
//       where: { id: parseInt(id) },
//       data: {
//         nip_pegawai,
//         nama_pegawai,
//         tanggal_lahir: parsedTanggalLahir,
//         jenis_kelamin,
//         alamat_pegawai,
//         nomor_telepon_pegawai,
//         email_pegawai,
//         jabatan_pegawai,
//         is_aktif,
//       },
//     });
//     return jsonResponse(
//       {
//         message: "Pegawai berhasil diperbarui",
//         data: updatePegawai,
//       },
//       200,
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return jsonResponse(
//       {
//         message: "Internal Server Error",
//       },
//       500,
//     );
//   }
// };

export async function PUT(req, { params }) {
  return updatePegawai(req, { params });
}

// export const DELETE = async (req, { params }) => {
//   try {
//     const auth = verifyAuth(req);

//     if (auth.error) {
//       return jsonResponse({ message: auth.error }, 401);
//     }

//     const { id } = params;
//     const deletePegawai = await prisma.pegawai.update({
//       where: { id: parseInt(id) },
//       data: { deleted_at: new Date() },
//     });
//     return jsonResponse(
//       {
//         message: "Pegawai berhasil dihapus",
//         data: deletePegawai,
//       },
//       200,
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return jsonResponse(
//       {
//         message: "Internal Server Error",
//       },
//       500,
//     );
//   }
// };

export async function DELETE(req, { params }) {
  return deletePegawai(req, { params });
}
