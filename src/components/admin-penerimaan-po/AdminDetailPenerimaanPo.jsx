"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/formatRupiah";
import { formatTanggal } from "@/lib/formatTanggal";
import { Badge } from "../ui/badge";
import { React, useMemo } from "react";

export default function AdminDetailPenerimaanPo({ open, onOpenChange, data }) {
  const rows = data?.data || [];

  const renderStatusBadge = (status) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="secondary">Draft</Badge>;

      case "PARTIAL":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
            Partial
          </Badge>
        );

      case "SELESAI":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
            SELESAI
          </Badge>
        );

      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const groupedDetails = useMemo(() => {
    if (!rows?.details) return [];

    const map = {};

    rows.details.forEach((item) => {
      const produkId = item?.produkVariant?.produk?.id;

      if (!map[produkId]) {
        map[produkId] = {
          produk: item?.produkVariant?.produk,
          items: [],
        };
      }

      map[produkId].items.push(item);
    });

    console.log("groupedDetails", map);

    return Object.values(map);
  }, [rows?.details]);

  const totals = useMemo(() => {
    if (!rows?.details) {
      return {
        totalQtyPO: 0,
        totalQtySudah: 0,
        totalQtySekarang: 0,
        totalSisa: 0,
        totalSubtotal: 0,
      };
    }

    return rows.details.reduce(
      (acc, item) => {
        const qtyPO = item?.purchaseOrderDetail?.jumlah_produk || 0;
        const qtySudah = item?.purchaseOrderDetail?.qty_diterima || 0;
        const qtySekarang = item?.jumlah_produk || 0;

        const hargaSatuan = item?.purchaseOrderDetail?.harga_satuan || 0;

        acc.totalQtyPO += qtyPO;
        acc.totalQtySudah += qtySudah;
        acc.totalQtySekarang += qtySekarang;
        acc.totalSisa += qtyPO - qtySudah;
        acc.totalSubtotal += qtySekarang * hargaSatuan;

        return acc;
      },
      {
        totalQtyPO: 0,
        totalQtySudah: 0,
        totalQtySekarang: 0,
        totalSisa: 0,
        totalSubtotal: 0,
      },
    );
  }, [rows?.details]);

  const satuanFooter =
    rows?.details?.[0]?.produkVariant?.satuan?.kode_satuan || "";

  //   const returMap = {};
  //   rows?.ReturPembelian?.forEach((retur) => {
  //     retur.DetailReturPembelian?.forEach((detail) => {
  //       const idProduk = detail.produk?.id;
  //       if (!returMap[idProduk]) returMap[idProduk] = [];
  //       returMap[idProduk].push({ ...detail, nomor_retur: retur.nomor_retur });
  //     });
  //   });

  //   const totalAwal = rows?.total_harga || 0;
  //   const totalRetur = rows?.ReturPembelian?.reduce((acc, retur) => {
  //     return acc + (retur.total_harga || 0);
  //   }, 0);
  //   const totalSetelahRetur = totalAwal - totalRetur;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] sm:max-w-7xl overflow-auto">
        <div className="text-sm space-y-2">
          <DialogHeader>
            <DialogTitle>Detail Penerimaan Purchase Order</DialogTitle>
            <DialogDescription>
              {rows?.nomor_penerimaan || "-"} |{" "}
              {formatTanggal(rows?.tanggal_penerimaan)}
            </DialogDescription>
          </DialogHeader>
          <div>
            <strong>Supplier:</strong>{" "}
            {rows?.purchaseOrder?.supplier?.nama_supplier || "-"}
          </div>
          <div>
            <strong>Petugas:</strong> {rows?.pegawai?.nama_pegawai || "-"}
          </div>
          {/* <div>
            <strong>Total Harga Pembelian:</strong>{" "}
            {formatRupiah(rows?.total_harga || 0)}
          </div> */}
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            {renderStatusBadge(rows?.status_penerimaan)}
          </div>

          {/* Tabel Produk */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Detail Produk</h3>
            <div className="overflow-x-auto rounded border">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Nama Produk</th>
                    <th className="p-2 border">SKU</th>
                    <th className="p-2 border">warna</th>
                    <th className="p-2 border">ukuran</th>
                    <th className="p-2 border">Qty Purchase Order</th>
                    <th className="p-2 border">Qty Diterima Sekarang</th>
                    <th className="p-2 border">Qty Sudah Diterima</th>
                    <th className="p-2 border">Sisa</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedDetails.map((group, groupIndex) =>
                    group.items.map((item, itemIndex) => {
                      const qtyPO =
                        item?.purchaseOrderDetail?.jumlah_produk || 0;
                      const qtySudah =
                        item?.purchaseOrderDetail?.qty_diterima || 0;
                      const qtySekarang = item?.jumlah_produk || 0;

                      const sisa = qtyPO - qtySudah;

                      const hargaSatuan =
                        item?.purchaseOrderDetail?.harga_satuan || 0;
                      const totalHarga = qtySekarang * hargaSatuan;

                      const satuan =
                        item?.produkVariant?.satuan?.kode_satuan || "-";

                      return (
                        <tr key={`${groupIndex}-${itemIndex}`}>
                          {/* Nomor */}
                          <td className="p-2 border align-top">
                            {itemIndex === 0 ? groupIndex + 1 : ""}
                          </td>

                          {/* Nama Produk hanya tampil sekali */}
                          <td className="p-2 border">
                            {itemIndex === 0
                              ? group.produk?.nama_produk || "-"
                              : ""}
                          </td>

                          <td className="p-2 border font-mono">
                            {item?.produkVariant?.sku || "-"}
                          </td>

                          <td className="p-2 border">
                            {item?.produkVariant?.warna || "-"}
                          </td>

                          <td className="p-2 border">
                            {item?.produkVariant?.ukuran || "-"}
                          </td>

                          <td className="p-2 border">
                            {qtyPO} {satuan}
                          </td>
                          <td className="p-2 border">
                            {qtySekarang} {satuan}
                          </td>
                          <td className="p-2 border">
                            {qtySudah} {satuan}
                          </td>
                          <td className="p-2 border">
                            {sisa} {satuan}
                          </td>

                          <td className="p-2 border">
                            {formatRupiah(hargaSatuan)}
                          </td>

                          <td className="p-2 border">
                            {formatRupiah(totalHarga)}
                          </td>
                        </tr>
                      );
                    }),
                  )}
                </tbody>
                <tfoot className="sticky bottom-0 bg-muted font-semibold text-xs z-10">
                  <tr>
                    <td className="p-2 border text-center" colSpan={10}>
                      TOTAL
                    </td>
                    <td className="p-2 border text-left">
                      {formatRupiah(totals.totalSubtotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {/* {rows?.ReturPembelian?.length > 0 && (
              <div className="mt-4 text-sm space-y-1">
                <div>
                  <strong>Total Awal:</strong> {formatRupiah(totalAwal)}
                </div>
                <div>
                  <strong>Total Retur:</strong> - {formatRupiah(totalRetur)}
                </div>
                <div className="font-semibold">
                  <strong>Total Setelah Retur:</strong>{" "}
                  {formatRupiah(totalSetelahRetur)}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
