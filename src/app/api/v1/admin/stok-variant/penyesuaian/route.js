import { adjustStokVariant } from "@/modules/stok-variant/stokvariant.service";

// export async function POST(req) {
//   try {
//     const auth = verifyAuth(req);
//     if (auth.error) {
//       return jsonResponse({ message: auth.error }, 401);
//     }

//     const user = auth.user;

//     if (!user?.pegawai_id) {
//       return jsonResponse(
//         { message: "Pegawai tidak terhubung dengan akun login" },
//         403,
//       );
//     }

//     const body = await req.json();
//     const { produk_variant_id, stok_fisik, keterangan_mutasi } = body;

//     const errors = {};

//     if (!produk_variant_id) {
//       errors.produk_variant_id = "Produk variant wajib diisi";
//     }

//     if (stok_fisik === undefined || stok_fisik === null || stok_fisik === "") {
//       errors.stok_fisik = "Stok fisik wajib diisi";
//     } else if (isNaN(stok_fisik)) {
//       errors.stok_fisik = "Stok fisik harus berupa angka";
//     } else if (Number(stok_fisik) < 0) {
//       errors.stok_fisik = "Stok fisik tidak boleh kurang dari 0";
//     }

//     if (!keterangan_mutasi) {
//       errors.keterangan_mutasi = "Keterangan mutasi wajib diisi";
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

//     const stokVariant = await prisma.stokVariant.findUnique({
//       where: {
//         produk_variant_id,
//       },
//     });

//     if (!stokVariant) {
//       return jsonResponse(
//         {
//           message: "Data stok variant tidak ditemukan",
//         },
//         404,
//       );
//     }

//     const stokSistem = stokVariant.jumlah_stok;
//     const stokFisik = Number(stok_fisik);
//     const selisih = stokFisik - stokSistem;

//     if (selisih === 0) {
//       return jsonResponse(
//         {
//           message: "Tidak ada selisih stok",
//         },
//         400,
//       );
//     }

//     const result = await prisma.$transaction(async (tx) => {
//       const mutasi = await tx.mutasiStokVariant.create({
//         data: {
//           produk_variant_id,
//           tipe_mutasi: "PENYESUAIAN",
//           jumlah_mutasi: Math.abs(selisih),
//           keterangan_mutasi,
//           pegawai_id: auth.user?.pegawai_id,
//           tanggal_mutasi: new Date(),
//           nomor_mutasi: `MT-VAR-${Date.now()}`,
//         },
//       });

//       const stokUpdate = await tx.stokVariant.update({
//         where: {
//           produk_variant_id,
//         },
//         data: {
//           jumlah_stok: stokFisik,
//           updated_at: new Date(),
//         },
//       });

//       return {
//         mutasi,
//         stok: stokUpdate,
//         selisih,
//         stok_sistem: stokSistem,
//         stok_fisik: stokFisik,
//       };
//     });

//     return jsonResponse(
//       {
//         message: "Penyesuaian stok variant berhasil",
//         data: result,
//       },
//       200,
//     );
//   } catch (error) {
//     console.error("Penyesuaian stok variant error:", error);

//     return jsonResponse(
//       {
//         message: "Internal Server Error",
//       },
//       500,
//     );
//   }
// }

export async function POST(req) {
  return adjustStokVariant(req);
}
