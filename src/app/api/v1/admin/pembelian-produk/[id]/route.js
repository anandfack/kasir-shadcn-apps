import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);

    const detailPembelianProduk = await prisma.pembelian.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      select: {
        id: true,
        nomor_pembelian: true,
        tanggal_pembelian: true,
        status_pembelian: true,
        total_harga: true,
        nomor_faktur: true,
        DetailPembelian: {
          select: {
            id: true,
            harga_satuan: true,
            jumlah_produk: true,
            harga_produk: true,
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
        supplier: {
          select: {
            id: true,
            nama_supplier: true,
            alamat_supplier: true,
          },
        },
        ReturPembelian: {
          select: {
            id: true,
            nomor_retur: true,
            tanggal_retur: true,
            total_harga: true,
            keterangan_retur: true,
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
                  },
                },
              },
            },
          },
        },
      },
    });

    return new Response(JSON.stringify(detailPembelianProduk), {
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
