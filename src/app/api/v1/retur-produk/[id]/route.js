import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);

    const detailReturProduk = await prisma.returPembelian.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      select: {
        id: true,
        nomor_retur: true,
        tanggal_retur: true,
        total_harga: true,
        pembelian: {
          select: {
            id: true,
            nomor_pembelian: true,
            nomor_faktur: true,
            supplier: {
              select: {
                id: true,
                nama_supplier: true,
              },
            },
          },
        },
        DetailReturPembelian: {
          select: {
            id: true,
            harga_satuan: true,
            jumlah_produk: true,
            total_harga: true,
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
          },
        },
        keterangan_retur: true,
      },
    });

    return new Response(JSON.stringify(detailReturProduk), {
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
