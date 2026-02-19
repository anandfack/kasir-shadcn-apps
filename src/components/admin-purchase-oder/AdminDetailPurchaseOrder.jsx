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

export default function AdminDetailPurchaseOrder({ open, onOpenChange, data }) {
  const rows = data?.data || [];

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
            <DialogTitle>Detail Pembelian</DialogTitle>
            <DialogDescription>
              {rows?.nomor_po || "-"} | {formatTanggal(rows?.tanggal_po)}
            </DialogDescription>
          </DialogHeader>
          <div>
            <strong>Supplier:</strong> {rows?.supplier?.nama_supplier || "-"}
          </div>
          <div>
            <strong>Petugas:</strong> {rows?.pegawai?.nama_pegawai || "-"}
          </div>
          <div>
            <strong>Total Harga Pembelian:</strong>{" "}
            {formatRupiah(rows?.total_harga || 0)}
          </div>
          <div>
            <strong>Status:</strong> {rows?.status_po}
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
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Subtotal</th>
                  </tr>
                </thead>
                {/* <tbody>
                  {rows?.details?.map((item, index) => (
                    <>
                      <tr key={`produk-${index}`}>
                        <td className="p-2 border align-top">{index + 1}</td>
                        <td className="p-2 border">
                          {item?.produkVariant?.produk?.nama_produk || "-"}
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
                        <td className="p-2 border">
                          {formatRupiah(item.harga_satuan)}
                        </td>
                        <td className="p-2 border">
                          {formatRupiah(item.total_harga)}
                        </td>
                      </tr>

                      {returMap[item.produk?.id]?.map((retur, rIndex) => (
                        <tr
                          key={`retur-${item.produk?.id}-${rIndex}`}
                          className="text-red-600"
                        >
                          <td className="p-2 border"></td>
                          <td className="p-2 border">
                            ↳ Retur {item.produk?.nama_produk} -{" "}
                            {retur.nomor_retur}
                          </td>
                          <td className="p-2 border">{retur.jumlah_produk}</td>
                          <td className="p-2 border">
                            {formatRupiah(retur.harga_satuan)}
                          </td>
                          <td className="p-2 border">
                            {formatRupiah(retur.total_harga)}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody> */}

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

                        <td className="p-2 border font-mono">
                          {item?.produkVariant?.sku || "-"}
                        </td>

                        <td className="p-2 border">
                          {item?.produkVariant?.warna || "-"}
                        </td>

                        <td className="p-2 border">
                          {item?.produkVariant?.ukuran || "-"}
                        </td>

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
