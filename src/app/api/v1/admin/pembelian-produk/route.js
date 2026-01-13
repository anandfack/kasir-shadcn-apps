import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const pembelianProduk = await prisma.pembelian.findMany({
      select: {
        id: true,
        nomor_pembelian: true,
        nomor_faktur: true,
        tanggal_pembelian: true,
        status_pembelian: true,
        total_harga: true,
        supplier: {
          select: {
            id: true,
            kode_supplier: true,
            nama_supplier: true,
          },
        },
        pembayaranPembelian: {
          select: {
            jumlah_bayar: true,
          },
        },
      },
      where: {
        deleted_at: null,
      },
    });

    const result = pembelianProduk.map((p) => {
      const totalBayar = p.pembayaranPembelian.reduce(
        (sum, pay) => sum + pay.jumlah_bayar,
        0
      );

      return {
        ...p,
        // total_bayar: totalBayar,
        status_pembayaran:
          totalBayar >= p.total_harga ? "LUNAS" : "BELUM LUNAS",
      };
    });

    return jsonResponse(
      {
        message: "OK",
        data: result,
      },
      200
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}

// app/api/pembelian/route.js

export async function POST(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const body = await req.json();
    const {
      supplier_id,
      nomor_pembelian,
      nomor_faktur,
      tanggal_pembelian,
      total_harga,
      detail_items,
    } = body;

    if (!supplier_id) {
      errors.supplier_id = "Supplier wajib diisi";
    } else if (isNaN(Number(supplier_id))) {
      errors.supplier_id = "Supplier tidak valid";
    }

    if (!nomor_pembelian || nomor_pembelian.trim() === "") {
      errors.nomor_pembelian = "Nomor pembelian wajib diisi";
    }
    if (!nomor_faktur || nomor_faktur.trim() === "") {
      errors.nomor_faktur = "Nomor faktur wajib diisi";
    }
    if (!tanggal_pembelian || tanggal_pembelian.trim() === "") {
      errors.tanggal_pembelian = "Tanggal pembelian wajib diisi";
    }
    if (!tanggal_pembelian || tanggal_pembelian.trim() === "") {
      errors.tanggal_pembelian = "Tanggal pembelian wajib diisi";
    }

    if (
      total_harga === undefined ||
      total_harga === null ||
      total_harga === ""
    ) {
      errors.total_harga = "Total harga wajib diisi";
    } else if (isNaN(Number(total_harga))) {
      errors.total_harga = "Total harga harus berupa angka";
    } else if (Number(total_harga) < 0) {
      errors.total_harga = "Total harga tidak boleh kurang dari 0";
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
            startsWith: `PB-${formattedDate}`,
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
          // created_at: created_at ? new Date(created_at) : nowJakarta,
          // updated_at: updated_at ? new Date(updated_at) : nowJakarta,
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
                // created_at: created_at ? new Date(created_at) : nowJakarta,
                // updated_at: updated_at ? new Date(updated_at) : nowJakarta,
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
                  // created_at: nowJakarta,
                  // updated_at: nowJakarta,
                },
              });
            }
          })
        );
      }

      return pembelian;
    });
    return jsonResponse(
      {
        message: "Data pembelian berhasil ditambahkan",
        data: result,
      },
      201
    );

    // return new Response(JSON.stringify(result), {
    //   status: 201,
    //   headers: { "Content-Type": "application/json" },
    // });
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}
