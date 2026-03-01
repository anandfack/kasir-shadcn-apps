import { PrismaClient } from "@prisma/client";
import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const auth = verifyAuth(req);

    if (auth.error) {
      return jsonResponse({ message: auth.error }, 401);
    }

    const id = parseInt(params.id);

    const detailInvoice = await prisma.invoicePembelian.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nomor_invoice: true,
        tanggal_invoice: true,
        total_tagihan: true,
        sisa_tagihan: true,
        status: true,
        pegawai: {
          select: {
            id: true,
            nama_pegawai: true,
          },
        },
        invoicePenerimaans: {
          select: {
            id: true,
            penerimaanBarang: {
              select: {
                id: true,
                nomor_penerimaan: true,
                details: {
                  select: {
                    id: true,
                    harga_satuan: true,
                    jumlah_produk: true,
                    total_harga: true,
                    produkVariant: {
                      select: {
                        id: true,
                        sku: true,
                        ukuran: true,
                        warna: true,
                        satuan: {
                          select: {
                            id: true,
                            nama_satuan: true,
                            kode_satuan: true,
                          },
                        },
                        produk: {
                          select: {
                            id: true,
                            nama_produk: true,
                            kode_produk: true,
                            supplier: {
                              select: {
                                id: true,
                                nama_supplier: true,
                                kode_supplier: true,
                                alamat_supplier: true,
                                nomor_telepon_supplier: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                returPenerimaans: {
                  select: {
                    id: true,
                    nomor_retur: true,
                    detailReturPenerimaans: {
                      select: {
                        id: true,
                        jumlah_produk: true,
                        harga_satuan: true,
                        total_harga: true,
                        penerimaanBarangDetail: {
                          select: {
                            id: true,
                            produkVariant: {
                              select: {
                                id: true,
                                sku: true,
                                warna: true,
                                ukuran: true,
                                produk: {
                                  select: {
                                    id: true,
                                    nama_produk: true,
                                    kode_produk: true,
                                    satuan: {
                                      select: {
                                        id: true,
                                        nama_satuan: true,
                                        kode_satuan: true,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return jsonResponse(
      {
        message: "OK",
        data: detailInvoice,
      },
      200,
    );
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      {
        message: "Internal Server Error",
      },
      500,
    );
  }
}
