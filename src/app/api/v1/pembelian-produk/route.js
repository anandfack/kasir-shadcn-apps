import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const pembelianProduk = await prisma.pembelian.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        supplier: true,
      },
    });
    return new Response(JSON.stringify(pembelianProduk), {
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

// app/api/pembelian/route.js

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      supplier_id,
      nomor_pembelian,
      nomor_faktur,
      tanggal_pembelian,
      total_harga,
      created_at,
      updated_at,
      detail_items,
    } = body;

    if (!supplier_id || !nomor_pembelian || !total_harga || !nomor_faktur) {
      return new Response(
        JSON.stringify({ error: "Semua kolom wajib diisi." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const now = new Date();
    const nowJakarta = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );

    const result = await prisma.$transaction(async (tx) => {
      const pembelian = await tx.pembelian.create({
        data: {
          supplier_id,
          nomor_pembelian,
          nomor_faktur,
          status_pembelian: "SELESAI",
          total_harga,
          tanggal_pembelian: tanggal_pembelian
            ? new Date(tanggal_pembelian)
            : nowJakarta,
          created_at: created_at ? new Date(created_at) : nowJakarta,
          updated_at: updated_at ? new Date(updated_at) : nowJakarta,
        },
      });

      if (Array.isArray(detail_items) && detail_items.length > 0) {
        await Promise.all(
          detail_items.map(async (item, index) => {
            await tx.detailPembelian.create({
              data: {
                pembelian_id: pembelian.id,
                produk_id: item.produk_id,
                jumlah_produk: item.jumlah_produk,
                harga_satuan: item.harga_satuan,
                harga_produk: item.harga_produk,
                total_harga: item.total_harga,
                created_at: created_at ? new Date(created_at) : nowJakarta,
                updated_at: updated_at ? new Date(updated_at) : nowJakarta,
              },
            });

            await tx.mutasiStok.create({
              data: {
                produk_id: item.produk_id,
                tipe_mutasi: "MASUK",
                jumlah_mutasi: item.jumlah_produk,
                keterangan_mutasi: `Pembelian ${pembelian.nomor_pembelian}`,
                tanggal_mutasi: nowJakarta,
                nomor_mutasi: `MT-PB-${pembelian.id}-${index + 1}`,
                pegawai_id: item.pegawai_id || null,
                satuan_produk_id: item.satuan_produk_id || null,
                tanggal_kadaluarsa: item.tanggal_kadaluarsa
                  ? new Date(item.tanggal_kadaluarsa)
                  : null,
              },
            });

            const existingStok = await tx.stok.findUnique({
              where: { produk_id: item.produk_id },
            });

            if (existingStok) {
              await tx.stok.update({
                where: { produk_id: item.produk_id },
                data: {
                  jumlah_stok: {
                    increment: item.jumlah_produk,
                  },
                  updated_at: nowJakarta,
                },
              });
            } else {
              await tx.stok.create({
                data: {
                  produk_id: item.produk_id,
                  jumlah_stok: item.jumlah_produk,
                  minimal_stok: 0,
                  maksimal_stok: 0,
                  created_at: nowJakarta,
                  updated_at: nowJakarta,
                },
              });
            }
          })
        );
      }

      return pembelian;
    });

    return new Response(JSON.stringify(result), {
      status: 201,
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
