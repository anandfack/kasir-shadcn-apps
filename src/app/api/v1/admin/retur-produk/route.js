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
    return jsonResponse(
      {
        message: "OK",
        data: returProduk,
      },
      200
    );
  } catch (error) {
    console.log("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
}

export async function POST(req) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const body = await req.json();
    const { pembelian_id, tanggal_retur, total_harga, details_retur } = body;

    const errors = {};

    if (!pembelian_id || isNaN(Number(pembelian_id))) {
      errors.pembelian_id = "Pembelian tidak valid";
    }

    if (
      total_harga === undefined ||
      total_harga === null ||
      isNaN(Number(total_harga)) ||
      Number(total_harga) < 0
    ) {
      errors.total_harga = "Total harga tidak valid";
    }

    if (!Array.isArray(details_retur) || details_retur.length === 0) {
      errors.details_retur = "Detail retur wajib diisi";
    }

    if (Object.keys(errors).length > 0) {
      return jsonResponse({ errors }, 422);
    }

    const nowJakarta = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      })
    );

    const result = await prisma.$transaction(async (tx) => {
      const pembelian = await tx.pembelian.findUnique({
        where: { id: Number(pembelian_id) },
      });

      if (!pembelian) {
        return jsonResponse({ message: "Pembelian tidak ditemukan" }, 404);
      }

      const formattedDate = nowJakarta
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
        orderBy: { nomor_retur: "desc" },
      });

      const nextNumber = lastRetur
        ? parseInt(lastRetur.nomor_retur.slice(-4)) + 1
        : 1;

      const nomorRetur = `RTR-PB-${formattedDate}${String(nextNumber).padStart(
        4,
        "0"
      )}`;

      const retur = await tx.ReturPembelian.create({
        data: {
          pembelian_id: pembelian.id,
          nomor_retur: nomorRetur,
          tanggal_retur: tanggal_retur ? new Date(tanggal_retur) : nowJakarta,
          total_harga: Number(total_harga),
          keterangan_retur: `Retur Pembelian ${pembelian.nomor_pembelian}`,
        },
      });

      for (let i = 0; i < details_retur.length; i++) {
        const item = details_retur[i];

        if (!item.produk_id || !item.jumlah_produk || item.jumlah_produk <= 0) {
          throw new Error("Detail retur tidak valid");
        }

        const stok = await tx.stok.findUnique({
          where: { produk_id: item.produk_id },
        });

        if (!stok) {
          throw new Error("Stok produk tidak ditemukan");
        }

        if (stok.jumlah_stok < item.jumlah_produk) {
          throw new Error("Jumlah retur melebihi stok tersedia");
        }

        const hargaSatuan = Number(item.harga_satuan);
        const jumlahProduk = Number(item.jumlah_produk);
        const totalHargaProduk = hargaSatuan * jumlahProduk;

        await tx.DetailReturPembelian.create({
          data: {
            retur_pembelian_id: retur.id,
            produk_id: item.produk_id,
            jumlah_produk: jumlahProduk,
            harga_satuan: hargaSatuan,
            harga_produk: totalHargaProduk,
            total_harga: totalHargaProduk,
          },
        });

        await tx.mutasiStok.create({
          data: {
            produk_id: item.produk_id,
            tipe_mutasi: "KELUAR",
            jumlah_mutasi: jumlahProduk,
            keterangan_mutasi: `Retur Pembelian ${pembelian.nomor_pembelian}`,
            tanggal_mutasi: nowJakarta,
            nomor_mutasi: `MT-KE-${retur.id}-${i + 1}`,
          },
        });

        await tx.stok.update({
          where: { produk_id: item.produk_id },
          data: {
            jumlah_stok: stok.jumlah_stok - jumlahProduk,
          },
        });
      }

      return retur;
    });

    return jsonResponse(
      {
        message: "Retur produk berhasil ditambahkan",
        data: result,
      },
      201
    );
  } catch (error) {
    console.error("RETUR ERROR:", error);

    return jsonResponse(
      {
        message: error.message || "Internal Server Error",
      },
      500
    );
  }
}
