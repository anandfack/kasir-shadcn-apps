import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const returProduk = await prisma.returPembelian.findMany({
      where: {
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
    return new Response(JSON.stringify(returProduk), {
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
      pembelian_id,
      produk_id,
      nomor_retur,
      tanggal_retur,
      total_harga,
      keterangan_retur,
      created_at,
      updated_at,
      details_retur,
    } = body;

    if (!total_harga || !pembelian_id) {
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
      const today = new Date();
      const formattedDate = today
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
        .replace(/\//g, "");

      const lastRetur = await tx.ReturPembelian.findFirst({
        where: {
          nomor_retur: {
            startsWith: `RTR-PB-${formattedDate}`,
          },
        },
        orderBy: {
          nomor_retur: "desc",
        },
      });

      let nextNumber = 1;
      if (lastRetur) {
        const lastNumber = parseInt(lastRetur.nomor_retur.slice(-4));
        nextNumber = lastNumber + 1;
      }

      const autoNomorRetur = `RTR-PB-${formattedDate}${String(
        nextNumber
      ).padStart(4, "0")}`;

      const pembelian = await tx.pembelian.findUnique({
        where: { id: pembelian_id },
      });

      const retur = await tx.ReturPembelian.create({
        data: {
          pembelian_id,
          nomor_retur: autoNomorRetur,
          tanggal_retur: tanggal_retur ? new Date(tanggal_retur) : new Date(),
          created_at: created_at ? new Date(created_at) : nowJakarta,
          updated_at: updated_at ? new Date(updated_at) : nowJakarta,
          total_harga,
          keterangan_retur: `Retur Pembelian ${pembelian.nomor_pembelian}`,
        },
      });

      if (Array.isArray(details_retur) && details_retur.length > 0) {
        await Promise.all(
          details_retur.map(async (item, index) => {
            await tx.DetailReturPembelian.create({
              data: {
                retur_pembelian_id: retur.id,
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
                tipe_mutasi: "KELUAR",
                jumlah_mutasi: item.jumlah_produk,
                keterangan_mutasi: `Retur Pembelian ${pembelian.nomor_pembelian}`,
                tanggal_mutasi: nowJakarta,
                nomor_mutasi: `MT-KE-${retur.id}-${index + 1}`,
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
                  jumlah_stok: existingStok.jumlah_stok - item.jumlah_produk,
                  updated_at: nowJakarta,
                },
              });
            }
          })
        );
      }
      return retur;
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
