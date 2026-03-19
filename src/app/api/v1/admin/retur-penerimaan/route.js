import { createReturPenerimaan } from "@/modules/retur-penerimaan/returpenerimaan.service";

// export async function GET(req) {
//   try {
//     const auth = verifyAuth(req);

//     if (auth.error) {
//       return jsonResponse({ message: auth.error }, 401);
//     }

//     const returProduk = await prisma.returPembelian.findMany({
//       where: {
//         deleted_at: null,
//       },
//       select: {
//         id: true,
//         nomor_retur: true,
//         tanggal_retur: true,
//         total_harga: true,
//         pembelian: {
//           select: {
//             id: true,
//             nomor_pembelian: true,
//             nomor_faktur: true,
//             supplier: {
//               select: {
//                 id: true,
//                 nama_supplier: true,
//               },
//             },
//           },
//         },
//         DetailReturPembelian: {
//           select: {
//             id: true,
//             produk: {
//               select: {
//                 id: true,
//                 nama_produk: true,
//                 kode_produk: true,
//                 satuan: {
//                   select: {
//                     id: true,
//                     nama_satuan: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//         keterangan_retur: true,
//       },
//     });
//     return jsonResponse(
//       {
//         message: "OK",
//         data: returProduk,
//       },
//       200
//     );
//   } catch (error) {
//     console.log("Error:", error);
//     return jsonResponse(
//       {
//         message: "Internal Server Error",
//       },
//       500
//     );
//   }
// }

export async function POST(req) {
  return createReturPenerimaan(req);
}
