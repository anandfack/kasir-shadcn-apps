import { newGenerateDocumentNumber } from "@/lib/documentNumber";
import { prisma } from "@/lib/prisma";

export async function getInvoiceRepo() {
  return prisma.invoicePembelian.findMany({
    select: {
      id: true,
      nomor_invoice: true,
      tanggal_invoice: true,
      total_tagihan: true,
      sisa_tagihan: true,
      status: true,
    },
    orderBy: {
      tanggal_invoice: "desc",
    },
  });
}

export async function createInvoiceRepo(data, auth) {
  const pegawai_id = auth.user.id;

  return prisma.$transaction(async (tx) => {
    const nomorInvoice = await newGenerateDocumentNumber({
      tx,
      prefix: "INV",
      tanggal: new Date(),
    });

    let totalPenerimaan = 0;
    let totalRetur = 0;

    for (const item of data.detail_items) {
      const penerimaan = await prisma.penerimaanBarang.findUnique({
        where: { id: item.penerimaan_id },
        include: {
          details: true,
          returPenerimaans: true,
        },
      });

      if (!penerimaan) {
        throw new Error("Tidak ada penerimaan");
      }
      const subTotalPenerimaan =
        penerimaan.details.reduce(
          (sum, d) => sum + Number(d.total_harga || 0),
          0,
        ) || 0;
      const subTotalRetur =
        penerimaan.returPenerimaans.reduce(
          (sum, d) => sum + Number(d.total_harga || 0),
          0,
        ) || 0;

      totalPenerimaan += subTotalPenerimaan;
      totalRetur += subTotalRetur;
    }
    const totalTagihan = totalPenerimaan - totalRetur;
    const totalSisaTagihan = totalTagihan;

    if (totalTagihan <= 0) {
      throw new Error("Total tagihan tidak valid");
    }

    const invoicePembelian = await tx.invoicePembelian.create({
      data: {
        nomor_invoice: nomorInvoice,
        tanggal_invoice: new Date(data.tanggal_invoice),
        total_tagihan: totalTagihan,
        sisa_tagihan: totalSisaTagihan,
        pegawai_id: pegawai_id,
        status: "UNPAID",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    await tx.invoicePenerimaan.createMany({
      data: data.detail_items.map((item) => ({
        invoice_id: invoicePembelian.id,
        penerimaan_id: item.penerimaan_id,
      })),
    });
  });
}

export async function getDetailInvoiceRepo(id) {
  return prisma.invoicePembelian.findUnique({
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
      pembayaranInvoices: {
        select: {
          id: true,
          jumlah_bayar: true,
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
}

export async function getHistoryPembayaranInvoiceRepo(id) {
  const historyPembayaranInvoice = await prisma.invoicePembelian.findUnique({
    where: { id },
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
      pembayaranInvoices: {
        select: {
          id: true,
          nomor_pembayaran: true,
          tanggal_bayar: true,
          jumlah_bayar: true,
          metode_bayar: true,
          nomor_referensi: true,
          nomor_rekening: true,
          deleted_at: true,
          pegawai: {
            select: {
              id: true,
              nama_pegawai: true,
            },
          },
        },
      },
    },
  });

  if (!historyPembayaranInvoice) {
    return jsonResponse({ message: "Data tidak ditemukan" }, 404);
  }

  return historyPembayaranInvoice;

  //   return prisma.invoicePembelian.findUnique({
  //     where: { id },
  //     select: {
  //       id: true,
  //       nomor_invoice: true,
  //       tanggal_invoice: true,
  //       total_tagihan: true,
  //       sisa_tagihan: true,
  //       status: true,
  //       pegawai: {
  //         select: {
  //           id: true,
  //           nama_pegawai: true,
  //         },
  //       },
  //       pembayaranInvoices: {
  //         select: {
  //           id: true,
  //           nomor_pembayaran: true,
  //           tanggal_bayar: true,
  //           jumlah_bayar: true,
  //           metode_bayar: true,
  //           nomor_referensi: true,
  //           nomor_rekening: true,
  //           deleted_at: true,
  //           pegawai: {
  //             select: {
  //               id: true,
  //               nama_pegawai: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
}

export async function pembayaranInvoiceRepo(data, auth) {
  const pegawaiId = auth.user.id;
  return prisma.$transaction(async (tx) => {
    const invoice = await tx.invoicePembelian.findUnique({
      where: { id: Number(data.invoice_id) },
      select: {
        id: true,
        total_tagihan: true,
      },
    });

    if (!invoice) {
      throw new Error("Invoice tidak ditemukan");
    }

    const totalPembayaran = await tx.pembayaranInvoice.aggregate({
      where: {
        invoice_id: invoice.id,
        deleted_at: null,
      },
      _sum: {
        jumlah_bayar: true,
      },
    });

    const totalSudahDibayar = totalPembayaran._sum.jumlah_bayar || 0;

    const sisaSaatIni = invoice.total_tagihan - totalSudahDibayar;

    if (Number(data.jumlah_bayar) > sisaSaatIni) {
      throw new Error("Jumlah bayar melebihi sisa tagihan");
    }

    const nomorPembayaran = await newGenerateDocumentNumber({
      tx,
      prefix: "PEMB-INV",
      tanggal: new Date(),
    });

    await tx.pembayaranInvoice.create({
      data: {
        invoice: { connect: { id: invoice.id } },
        pegawai: { connect: { id: pegawaiId } },
        jumlah_bayar: Number(data.jumlah_bayar),
        nomor_referensi: data.nomor_referensi,
        nomor_rekening: data.nomor_rekening,
        metode_bayar: data.metode_bayar,
        tanggal_bayar: new Date(),
        nomor_pembayaran: nomorPembayaran,
      },
    });

    const totalBaru = totalSudahDibayar + Number(data.jumlah_bayar);
    const sisaBaru = invoice.total_tagihan - totalBaru;

    await tx.invoicePembelian.update({
      where: { id: invoice.id },
      data: {
        sisa_tagihan: sisaBaru,
        status: sisaBaru <= 0 ? "PAID" : totalBaru > 0 ? "PARTIAL" : "UNPAID",
      },
    });

    return {
      invoice_id: invoice.id,
      sisa_tagihan: sisaBaru,
    };
  });
}

export async function batalPembayaranInvoiceRepo(id) {
  return prisma.$transaction(async (tx) => {
    const pembayaran = await tx.pembayaranInvoice.findUnique({
      where: { id },
    });

    const invoice = await tx.invoicePembelian.findUnique({
      where: { id: pembayaran.invoice_id },
    });

    const sisaTagihanBaru = invoice.sisa_tagihan + pembayaran.jumlah_bayar;

    await tx.pembayaranInvoice.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    await tx.invoicePembelian.update({
      where: { id: invoice.id },
      data: {
        sisa_tagihan: sisaTagihanBaru,
        status: sisaTagihanBaru >= invoice.total_tagihan ? "UNPAID" : "PARTIAL",
      },
    });

    return true;
  });
}
