import { newGenerateDocumentNumber } from "@/lib/documentNumber";
import { prisma } from "@/lib/prisma";

export async function getPurchaseOrderRepo() {
  return prisma.purchaseOrder.findMany({
    select: {
      id: true,
      nomor_po: true,
      tanggal_po: true,
      status_po: true,
      total_harga: true,
      pegawai: {
        select: {
          id: true,
          nama_pegawai: true,
        },
      },
      supplier: {
        select: {
          id: true,
          kode_supplier: true,
          nama_supplier: true,
        },
      },
      details: {
        select: {
          jumlah_produk: true,
          qty_diterima: true,
        },
      },
      // pembayaranPembelian: {
      //   select: {
      //     jumlah_bayar: true,
      //   },
      // },
    },
    where: {
      deleted_at: null,
    },
  });
}

export async function createPurchaseOrderRepo(data, auth) {
  return prisma.$transaction(async (tx) => {
    const nomorPO = await newGenerateDocumentNumber({
      tx,
      model: "purchaseOrder",
      field: "nomor_po",
      prefix: "PO",
      tanggal: data.tanggal_po,
    });

    const purchaseOrder = await tx.purchaseOrder.create({
      data: {
        supplier_id: data.supplier_id,
        nomor_po: nomorPO,
        pegawai_id: auth.user?.id,
        status_po: "DRAFT",
        total_harga: data.total_harga,
        tanggal_po: new Date(data.tanggal_po),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    if (Array.isArray(data.detail_items) && data.detail_items.length > 0) {
      await Promise.all(
        data.detail_items.map(async (item, index) => {
          await tx.purchaseOrderDetail.create({
            data: {
              purchase_order_id: purchaseOrder.id,
              produk_variant_id: item.produk_variant_id,
              harga_satuan: item.harga_satuan,
              jumlah_produk: item.jumlah_produk,
              total_harga: item.total_harga,
              created_at: new Date(),
              updated_at: new Date(),
              pegawai_id: auth.user?.id,
            },
          });
        }),
      );
    }
    return purchaseOrder;
  });
}

export async function getDetailPurchaseOrderRepo(id) {
  return prisma.purchaseOrder.findUnique({
    where: {
      id,
      deleted_at: null,
    },
    select: {
      id: true,
      nomor_po: true,
      tanggal_po: true,
      status_po: true,
      total_harga: true,
      details: {
        select: {
          id: true,
          harga_satuan: true,
          jumlah_produk: true,
          qty_diterima: true,
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
      pegawai: {
        select: {
          id: true,
          nama_pegawai: true,
        },
      },
      // ReturPembelian: {
      //   select: {
      //     id: true,
      //     nomor_retur: true,
      //     tanggal_retur: true,
      //     total_harga: true,
      //     keterangan_retur: true,
      //     DetailReturPembelian: {
      //       select: {
      //         id: true,
      //         harga_satuan: true,
      //         jumlah_produk: true,
      //         total_harga: true,
      //         produk: {
      //           select: {
      //             id: true,
      //             nama_produk: true,
      //             kode_produk: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    },
  });
}
