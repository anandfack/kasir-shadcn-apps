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
import { useMemo } from "react";
import React from "react";

export default function AdminDetailPenerimaanPo({ open, onOpenChange, data }) {
  const rows = data?.data || [];

  const returMap = useMemo(() => {
    if (!rows?.returPenerimaans) return {};

    const map = {};

    rows.returPenerimaans.forEach((retur) => {
      retur.detailReturPenerimaans?.forEach((detail) => {
        const detailId = detail.penerimaanbarangdetail_id;

        if (!map[detailId]) map[detailId] = [];

        map[detailId].push({
          ...detail,
          nomor_retur: retur.nomor_retur,
          tanggal_retur: retur.tanggal_retur,
        });
      });
    });

    return map;
  }, [rows?.returPenerimaans]);

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

    return Object.values(map);
  }, [rows?.details]);

  // Hitung ringkasan penerimaan
  const summary = useMemo(() => {
    if (!rows?.details) return {};

    let totalQtyAwal = 0;
    let totalQtySudah = 0;
    let totalQtySekarang = 0;
    let totalQtyRetur = 0;
    let totalNominal = 0;
    let satuan = "";

    rows.details.forEach((item) => {
      const qtyPO = item?.purchaseOrderDetail?.jumlah_produk || 0;
      const qtySudah = item?.purchaseOrderDetail?.qty_diterima || 0;
      const qtySekarang = item?.jumlah_produk || 0;
      const hargaSatuan = item?.purchaseOrderDetail?.harga_satuan || 0;

      // Ambil satuan dari item pertama saja
      if (!satuan) satuan = item?.produkVariant?.satuan?.kode_satuan || "";

      totalQtyAwal += qtyPO;
      totalQtySudah += qtySudah;
      totalQtySekarang += qtySekarang;
      totalNominal += qtySekarang * hargaSatuan;

      // Tambahkan retur
      const returs = returMap[item.id] || [];
      returs.forEach((r) => {
        totalQtyRetur += r.jumlah_produk || 0;
        totalNominal -= r.total_harga || 0;
      });
    });

    return {
      totalQtyAwal,
      totalQtySudah,
      totalQtySekarang,
      totalQtyRetur,
      totalNominal,
      satuan,
    };
  }, [rows?.details, returMap]);

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
                        <React.Fragment key={`${groupIndex}-${itemIndex}`}>
                          {/* ROW PRODUK */}
                          <tr>
                            <td className="p-2 border align-top">
                              {itemIndex === 0 ? groupIndex + 1 : ""}
                            </td>

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

                            <td className="p-2 border text-right">
                              {qtyPO} {satuan}
                            </td>

                            <td className="p-2 border text-right">
                              {qtySekarang} {satuan}
                            </td>

                            <td className="p-2 border text-right">
                              {qtySudah} {satuan}
                            </td>

                            <td className="p-2 border text-right">
                              {sisa} {satuan}
                            </td>

                            <td className="p-2 border text-right">
                              {formatRupiah(hargaSatuan)}
                            </td>

                            <td className="p-2 border text-right">
                              {formatRupiah(totalHarga)}
                            </td>
                          </tr>

                          {/* ROW RETUR (JIKA ADA) */}
                          {returMap[item.id]?.map((retur, rIndex) => (
                            <tr
                              key={`retur-${item.id}-${rIndex}`}
                              className="text-rose-700 text-xs"
                            >
                              {/* Skip kolom No, Nama Produk, SKU, Warna */}
                              <td
                                colSpan={6}
                                className="p-2 border italic text-center"
                              >
                                ↳ Retur {retur.nomor_retur}
                              </td>

                              {/* Kolom Qty Diterima Sekarang → qty retur */}
                              <td className="p-2 border text-right">
                                - {retur.jumlah_produk} {satuan}
                              </td>

                              {/* Kolom Qty Sudah Diterima → kosong */}
                              <td className="p-2 border"></td>

                              {/* Kolom Sisa → kosong */}
                              <td className="p-2 border"></td>

                              {/* Kolom Harga */}
                              <td className="p-2 border text-right">
                                - {formatRupiah(retur.harga_satuan)}
                              </td>

                              {/* Kolom Subtotal */}
                              <td className="p-2 border text-right">
                                - {formatRupiah(retur.total_harga)}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    }),
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 rounded-xl border bg-muted/30">
              <h4 className="font-semibold mb-3">
                Ringkasan Penerimaan Purchase Order
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Qty Awal</p>
                  <p className="font-semibold">
                    {summary.totalQtyAwal} {summary.satuan}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">
                    Total Diterima Sebelumnya
                  </p>
                  <p className="font-semibold">
                    {summary.totalQtySudah} {summary.satuan}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">
                    Total Diterima Sekarang
                  </p>
                  <p className="font-semibold">
                    {summary.totalQtySekarang} {summary.satuan}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Total Retur</p>
                  <p className="font-semibold text-rose-600">
                    {summary.totalQtyRetur} {summary.satuan}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Total Nominal</p>
                  <p className="font-semibold">
                    {formatRupiah(summary.totalNominal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
