import { newGenerateDocumentNumber } from "@/lib/documentNumber";
import { prisma } from "@/lib/prisma";

export async function getPenerimaanPoRepo(whereCondition) {
  return prisma.penerimaanBarang.findMany({
    where: whereCondition,
    select: {
      id: true,
      purchaseOrder: {
        select: {
          id: true,
          nomor_po: true,
          supplier: {
            select: {
              id: true,
              nama_supplier: true,
            },
          },
        },
      },
      pegawai: {
        select: {
          id: true,
          nama_pegawai: true,
        },
      },
      nomor_penerimaan: true,
      tanggal_penerimaan: true,
      status_penerimaan: true,
      details: {
        select: {
          jumlah_produk: true,
          harga_satuan: true,
          total_harga: true,
        },
      },
    },
  });
}

export async function createPenerimaanPoRepo(data, auth) {
  return prisma.$transaction(async (tx) => {
    const purchase_order_id = data.purchase_order_id;
    const pegawai_id = auth.user.id;
    const nomorPenerimaan = await newGenerateDocumentNumber({
      tx,
      prefix: "PB",
      tanggal: new Date(),
    });

    const penerimaanPo = await tx.penerimaanBarang.create({
      data: {
        purchase_order_id: purchase_order_id,
        pegawai_id,
        nomor_penerimaan: nomorPenerimaan,
        tanggal_penerimaan: new Date(data.tanggal_penerimaan),
        status_penerimaan: "SELESAI",
        nomor_faktur: data.nomor_faktur,
        tanggal_faktur: new Date(data.tanggal_faktur),
        nomor_surat_jalan: data.nomor_surat_jalan,
        tanggal_surat_jalan: new Date(data.tanggal_surat_jalan),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    for (const item of data.details_penerimaan) {
      if (!item.purchase_order_detail_id) {
        throw new Error("Detail PO wajib ada");
      }

      if (item.jumlah_produk <= 0) {
        throw new Error("Qty harus lebih dari 0");
      }

      const poDetail = await tx.purchaseOrderDetail.findUnique({
        where: {
          id: item.purchase_order_detail_id,
          purchase_order_id: purchase_order_id,
        },
      });

      if (!poDetail) {
        throw new Error("Detail PO tidak ditemukan");
      }

      const sisaQty = poDetail.jumlah_produk - (poDetail.qty_diterima ?? 0);

      if (item.jumlah_produk > sisaQty) {
        throw new Error("Qty melebihi sisa PO");
      }

      const nomorMutasi = await newGenerateDocumentNumber({
        tx,
        prefix: "MT",
        tanggal: new Date(),
      });

      await tx.penerimaanBarangDetail.create({
        data: {
          penerimaan_barang_id: penerimaanPo.id,
          purchase_order_detail_id: poDetail.id,
          produk_variant_id: item.produk_variant_id,
          harga_satuan: item.harga_satuan,
          jumlah_produk: item.jumlah_produk,
          total_harga: item.total_harga,
          pegawai_id,
        },
      });

      await tx.purchaseOrderDetail.update({
        where: { id: poDetail.id },
        data: {
          qty_diterima: {
            increment: item.jumlah_produk,
          },
        },
      });

      await tx.mutasiStokVariant.create({
        data: {
          produk_variant_id: item.produk_variant_id,
          tipe_mutasi: "MASUK",
          jumlah_mutasi: item.jumlah_produk,
          keterangan_mutasi: nomorPenerimaan,
          pegawai_id,
          tanggal_mutasi: new Date(),
          nomor_mutasi: nomorMutasi,
        },
      });

      await tx.stokVariant.upsert({
        where: {
          produk_variant_id: item.produk_variant_id,
        },
        update: {
          jumlah_stok: {
            increment: item.jumlah_produk,
          },
        },
        create: {
          produk_variant_id: item.produk_variant_id,
          jumlah_stok: item.jumlah_produk,
          minimal_stok: 0,
          maksimal_stok: 0,
        },
      });
    }

    const updatedDetails = await tx.purchaseOrderDetail.findMany({
      where: { purchase_order_id },
    });

    const allComplete =
      updatedDetails.length > 0 &&
      updatedDetails.every((d) => d.qty_diterima >= d.jumlah_produk);

    const someReceived = updatedDetails.some((d) => d.qty_diterima > 0);

    let status_po = "OPEN";

    if (allComplete) {
      status_po = "COMPLETE";
    } else if (someReceived) {
      status_po = "PARTIAL";
    }

    await tx.purchaseOrder.update({
      where: { id: purchase_order_id },
      data: { status_po },
    });

    return penerimaanPo;
  });
}

export async function getDetailPenerimaanPoRepo(id) {
  return prisma.penerimaanBarang.findUnique({
    where: {
      id,
      deleted_at: null,
    },
    select: {
      id: true,
      nomor_penerimaan: true,
      tanggal_penerimaan: true,
      status_penerimaan: true,
      purchaseOrder: {
        select: {
          id: true,
          nomor_po: true,
          supplier: {
            select: {
              id: true,
              nama_supplier: true,
            },
          },
        },
      },
      returPenerimaans: {
        where: {
          deleted_at: null,
        },
        select: {
          id: true,
          nomor_retur: true,
          tanggal_retur: true,
          total_harga: true,
          status: true,
          detailReturPenerimaans: {
            where: {
              deleted_at: null,
            },
            select: {
              id: true,
              jumlah_produk: true,
              harga_satuan: true,
              total_harga: true,
              keterangan_retur: true,
              penerimaanbarangdetail_id: true,
            },
          },
        },
      },
      details: {
        select: {
          id: true,
          jumlah_produk: true,
          harga_satuan: true,
          qty_retur: true,
          produkVariant: {
            select: {
              id: true,
              sku: true,
              ukuran: true,
              warna: true,
              produk: {
                select: {
                  id: true,
                  nama_produk: true,
                  kode_produk: true,
                },
              },
              satuan: {
                select: {
                  id: true,
                  nama_satuan: true,
                  kode_satuan: true,
                },
              },
            },
          },
          purchaseOrderDetail: {
            select: {
              id: true,
              jumlah_produk: true,
              qty_diterima: true,
              harga_satuan: true,
            },
          },
        },
      },
      pegawai: {
        select: {
          id: true,
          nama_pegawai: true,
        },
      },
    },
  });
}
