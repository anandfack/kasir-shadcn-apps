import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const produkId = parseInt(params.id);

    const mutasiStok = await prisma.mutasiStok.findMany({
      where: {
        produk_id: produkId,
        deleted_at: null,
      },
      orderBy: {
        tanggal_mutasi: "desc",
      },

      select: {
        id: true,
        produk_id: true,
        nomor_mutasi: true,
        tanggal_mutasi: true,
        tipe_mutasi: true,
        jumlah_mutasi: true,
        keterangan_mutasi: true,
        produk: {
          select: {
            id: true,
            nama_produk: true,
            kode_produk: true,
            satuan: {
              select: {
                id: true,
                nama_satuan: true,
              },
            },
          },
        },

        // DetailPembelian: {
        //   select: {
        //     id: true,
        //     harga_satuan: true,
        //     jumlah_produk: true,
        //     harga_produk: true,
        //     total_harga: true,
        //     produk: {
        //       select: {
        //         id: true,
        //         nama_produk: true,
        //         kode_produk: true,
        //         satuan: {
        //           select: {
        //             id: true,
        //             nama_satuan: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
        // supplier: {
        //   select: {
        //     id: true,
        //     nama_supplier: true,
        //     alamat_supplier: true,
        //   },
        // },
        // ReturPembelian: {
        //   select: {
        //     id: true,
        //     nomor_retur: true,
        //     tanggal_retur: true,
        //     total_harga: true,
        //     keterangan_retur: true,
        //     DetailReturPembelian: {
        //       select: {
        //         id: true,
        //         harga_satuan: true,
        //         jumlah_produk: true,
        //         total_harga: true,
        //         produk: {
        //           select: {
        //             id: true,
        //             nama_produk: true,
        //             kode_produk: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
      },
    });

    return new Response(JSON.stringify(mutasiStok), {
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
