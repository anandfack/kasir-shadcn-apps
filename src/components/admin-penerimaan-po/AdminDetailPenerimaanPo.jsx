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
import { useMemo } from "react";
import { Badge } from "../ui/badge";

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
      <DialogContent className="h-[450px] max-w-5xl overflow-auto">
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
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Nama Produk</th>
                    <th className="p-2 border">SKU</th>
                    <th className="p-2 border">warna</th>
                    <th className="p-2 border">ukuran</th>
                    <th className="p-2 border">Qty Purchase Order</th>
                    <th className="p-2 border">Qty Sudah Diterima</th>
                    <th className="p-2 border">Qty Diterima Sekarang</th>
                    <th className="p-2 border">Sisa</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedDetails.map((group, groupIndex) =>
                    group.items.map((item, itemIndex) => (
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

                        <td className="p-2 border">
                          {item?.produkVariant?.sku || "-"}
                        </td>

                        <td className="p-2 border">
                          {item?.produkVariant?.warna || "-"}
                        </td>

                        <td className="p-2 border">
                          {item?.produkVariant?.ukuran || "-"}
                        </td>

                        <td className="p-2 border">{item.jumlah_produk}</td>
                        <td className="p-2 border">{item.jumlah_produk}</td>
                        <td className="p-2 border">{item.jumlah_produk}</td>
                        <td className="p-2 border">{item.jumlah_produk}</td>
                        <td className="p-2 border">{item.jumlah_produk}</td>

                        <td className="p-2 border">
                          {formatRupiah(item.harga_satuan)}
                        </td>

                        <td className="p-2 border">
                          {formatRupiah(item.total_harga)}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
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
