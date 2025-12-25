import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    function getStatus(stok) {
      if (!stok) return "Belum Diatur";
      if (stok.jumlah_stok <= 0) return "Habis";
      if (stok.jumlah_stok <= stok.minimal_stok) return "Menipis";
      if (stok.jumlah_stok >= stok.maksimal_stok) return "Berlebih";
      return "Aman";
    }

    const produk = await prisma.produk.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        nama_produk: "asc",
      },
      include: {
        Stok: true, // ⬅️ relasi stok (nullable)
      },
    });

    const result = produk.map((item) => {
      const stok = item.Stok?.[0] ?? null;

      return {
        id: item.id,
        nama_produk: item.nama_produk,

        jumlah_stok: stok?.jumlah_stok ?? null,
        minimal_stok: stok?.minimal_stok ?? null,
        maksimal_stok: stok?.maksimal_stok ?? null,

        status: getStatus(stok),
        terakhir_update: stok?.updated_at ?? null,

        has_stok: !!stok,
      };
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const {
//       kategori_id,
//       satuan_produk_id,
//       supplier_id,
//       kode_produk,
//       nama_produk,
//       deskripsi_produk,
//       is_aktif,
//       created_at,
//       updated_at,
//     } = body;

//     if (
//       !kategori_id &&
//       !satuan_produk_id &&
//       !supplier_id &&
//       !kode_produk &&
//       !nama_produk &&
//       !deskripsi_produk
//     ) {
//       return new Response(
//         JSON.stringify({
//           error: "semua kolom harus diisi",
//         }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     const nowJakarta = new Date().toLocaleString("en-US", {
//       timeZone: "Asia/Jakarta",
//     });

//     const tambahProduk = await prisma.produk.create({
//       data: {
//         kategori_id,
//         satuan_produk_id,
//         supplier_id,
//         kode_produk,
//         nama_produk,
//         deskripsi_produk,
//         is_aktif: is_aktif ? is_aktif : true,
//         created_at: created_at ? new Date(created_at) : nowJakarta,
//         updated_at: updated_at ? new Date(updated_at) : nowJakarta,
//       },
//     });

//     return new Response(JSON.stringify(tambahProduk), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
