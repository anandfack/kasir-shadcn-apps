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
import { useState } from "react";

export default function DetailReturProduk({ open, onOpenChange, data }) {
  const rows = data?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[450px] max-w-5xl overflow-auto">
        <div className="text-sm space-y-2">
          <DialogHeader>
            <DialogTitle>Detail Retur Pembelian Produk</DialogTitle>
            <DialogDescription>
              {rows?.nomor_retur || "-"} | {formatTanggal(rows?.tanggal_retur)}
            </DialogDescription>
          </DialogHeader>

          <div>
            <strong>Nomor Pembelian:</strong>{" "}
            {rows?.pembelian?.nomor_pembelian || "-"}
          </div>
          <div>
            <strong>Supplier:</strong>{" "}
            {rows?.pembelian?.supplier?.nama_supplier || "-"}
          </div>
          <div>
            <strong>Total Harga:</strong> {formatRupiah(rows?.total_harga)}
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
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Harga Satuan</th>
                    <th className="p-2 border">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {rows?.DetailReturPembelian?.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">
                        {item.produk?.nama_produk || "-"}
                      </td>
                      <td className="p-2 border">{item.jumlah_produk}</td>
                      <td className="p-2 border">
                        {formatRupiah(item.harga_satuan)}
                      </td>
                      <td className="p-2 border">
                        {formatRupiah(item.total_harga)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
