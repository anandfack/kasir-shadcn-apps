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

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      supplier_id,
      nomor_pembelian,
      nomor_faktur,
      status_pembelian,
      tanggal_pembelian,
      total_harga,
      created_at,
      updated_at,
      detail_items,
    } = body;

    if (
      !supplier_id &&
      !nomor_pembelian &&
      !status_pembelian &&
      !total_harga &&
      !nomor_pembelian &&
      !nomor_faktur
    ) {
      return new Response(
        JSON.stringify({
          error: "semua kolom harus diisi",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const now = new Date();
    const nowJakarta = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    ).toISOString();

    const result = await prisma.$transaction(async (tx) => {
      const pembelian = await tx.pembelian.create({
        data: {
          supplier_id,
          nomor_pembelian,
          nomor_faktur,
          status_pembelian,
          total_harga,
          tanggal_pembelian: tanggal_pembelian
            ? new Date(tanggal_pembelian)
            : nowJakarta,
          created_at: created_at ? new Date(created_at) : nowJakarta,
          updated_at: updated_at ? new Date(updated_at) : nowJakarta,
        },
      });

      console.log("Pembelian berhasil:", pembelian);

      if (detail_items && detail_items.length > 0) {
        try {
          const detailResults = await Promise.all(
            detail_items.map((item) =>
              tx.detailPembelian.create({
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
              })
            )
          );
          console.log("Detail Pembelian berhasil dibuat:", detailResults);
        } catch (err) {
          console.error("Gagal membuat detail pembelian:", err);
          throw err; // lempar agar transaksi rollback
        }
      }

      return pembelian;
    });
    // const tambahPembelianProduk = await prisma.pembelian.create({
    //   data: {
    //     supplier_id,
    //     nomor_pembelian,
    //     nomor_faktur,
    //     status_pembelian,
    //     total_harga,
    //     tanggal_pembelian: tanggal_pembelian
    //       ? new Date(tanggal_pembelian)
    //       : nowJakarta.toString(),
    //     created_at: created_at ? new Date(created_at) : nowJakarta.toString(),
    //     updated_at: updated_at ? new Date(updated_at) : nowJakarta.toString(),
    //   },
    // });

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
