// import { PrismaClient } from "@prisma/client";
// import jsonResponse from "@/lib/jsonResponse";
// import { verifyAuth } from "@/lib/verifyAuth";

// const prisma = new PrismaClient();

// export async function GET(req, { params }) {
//   try {
//     const auth = verifyAuth(req);

//     if (auth.error) {
//       return jsonResponse({ message: auth.error }, 401);
//     }

//     const id = parseInt(params.id);

//     const pembayaranPembelian = await prisma.pembayaranPembelian.findUnique({
//       where: {
//         id,
//         deleted_at: null,
//       },
//       select: {
//         id: true,
//         pembelian: {
//           select: {
//             id: true,
//             supplier: {
//               select: {
//                 id: true,
//                 nama_supplier: true,
//               },
//             },
//             nomor_pembelian: true,
//             tanggal_pembelian: true,
//             total_harga: true,
//             nomor_faktur: true,
//             status_pembelian: true,
//           },
//         },
//         tanggal_bayar: true,
//         jumlah_bayar: true,
//         metode_bayar: true,
//         nomor_referensi: true,
//         nomor_rekening: true,
//         pegawai: {
//           select: {
//             id: true,
//             nama_pegawai: true,
//           },
//         },
//       },
//     });

//     function hitungStatusPembayaran(pembayaran, totalTagihan) {
//       const totalBayar =
//         pembayaran?.reduce((sum, p) => sum + p.jumlah_bayar, 0) ?? 0;

//       if (totalBayar === 0) return "BELUM_BAYAR";
//       if (totalBayar > totalTagihan) return "OVERPAID";
//       if (totalBayar >= totalTagihan) return "LUNAS";
//       return "SEBAGIAN";
//     }

//     const result = pembayaranPembelian.map((p) => {
//       const totalBayar = p.pembayaranPembelian.reduce(
//         (sum, pay) => sum + pay.jumlah_bayar,
//         0
//       );

//       return {
//         ...p,
//         total_bayar: totalBayar,
//         status_pembayaran: hitungStatusPembayaran(
//           p.pembayaranPembelian,
//           p.total_harga
//         ),
//       };
//     });

//     return jsonResponse(
//       {
//         message: "OK",
//         data: pembayaranPembelian,
//       },
//       200
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return jsonResponse(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// }

import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { requirePermission, ForbiddenError } from "@/lib/permission";
import { hitungStatusPembayaran } from "@/lib/hitungStatusPembayaran";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    try {
      await requirePermission(auth.user.id, "invoice.view");
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return jsonResponse({ message: error.message }, 403);
      }
      throw error;
    }

    // const pembelianId = Number(params.id);

    const pembelian = await prisma.pembelian.findUnique({
      where: { id },
      select: {
        id: true,
        nomor_pembelian: true,
        nomor_faktur: true,
        tanggal_pembelian: true,
        total_harga: true,
        status_pembelian: true,
        supplier: {
          select: { nama_supplier: true },
        },
        pembayaranPembelian: {
          where: { deleted_at: null },
          orderBy: { tanggal_bayar: "asc" },
          select: {
            id: true,
            tanggal_bayar: true,
            jumlah_bayar: true,
            metode_bayar: true,
            nomor_referensi: true,
          },
        },
      },
    });

    if (!pembelian) {
      return jsonResponse({ message: "Data tidak ditemukan" }, 404);
    }

    const statusPembayaran = hitungStatusPembayaran(
      pembelian.pembayaranPembelian,
      pembelian.total_harga
    );

    return jsonResponse(
      {
        message: "OK",
        data: {
          ...pembelian,
          total_bayar: totalBayar,
          status_pembayaran: statusPembayaran,
        },
      },
      200
    );
  } catch (error) {
    console.error(error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}
