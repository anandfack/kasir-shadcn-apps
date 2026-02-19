"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatTanggal } from "@/lib/formatTanggal";

export default function AdminMutasiStokVariant({
  open,
  onOpenChange,
  data,
  produk,
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const rows = data?.data || [];

  const filteredData = rows.filter((item) => {
    if (!startDate && !endDate) return true;

    const tgl = new Date(item.tanggal_mutasi);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) {
      start.setHours(0, 0, 0, 0);
    }
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    if (start && tgl < start) return false;
    if (end && tgl > end) return false;

    return true;
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setStartDate("");
          setEndDate("");
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-7xl max-h-[120vh] overflow-y-auto">
        <div className="text-sm space-y-2">
          <DialogHeader>
            <DialogTitle>Mutasi Stok</DialogTitle>
            <DialogDescription>{produk?.nama_produk || "-"}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 mb-3">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>-</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <Button
              variant="secondary"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              Reset
            </Button>
          </div>

          <div className="mt-4">
            <div className="overflow-x-auto rounded border">
              <table className="w-full text-xs">
                <thead className="text-left">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Nomor Mutasi</th>
                    <th className="p-2 border">Tanggal Mutasi</th>
                    <th className="p-2 border">Produk Variant</th>
                    <th className="p-2 border">Jumlah Mutasi</th>
                    <th className="p-2 border">Tipe Mutasi</th>
                    <th className="p-2 border">Keterangan Mutasi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData?.length > 0 ? (
                    filteredData?.map((item, index) => (
                      <tr key={item.id}>
                        <td className="p-2 border align-top">{index + 1}</td>
                        <td className="p-2 border align-top">
                          {item.nomor_mutasi}
                        </td>
                        <td className="p-2 border align-top">
                          {item.tanggal_mutasi
                            ? formatTanggal(item.tanggal_mutasi)
                            : "-"}
                        </td>
                        <td className="p-2 border align-top">
                          <div className="font-medium">
                            {item.produkVariant?.produk?.nama_produk || "-"}
                          </div>

                          <div className="text-xs text-gray-500">
                            ({item.produkVariant?.produk?.kode_produk || "-"})
                          </div>

                          <div className="mt-1 text-xs">
                            <span>{item.produkVariant?.ukuran || "-"}</span>

                            {item.produkVariant?.warna && (
                              <span> • {item.produkVariant.warna}</span>
                            )}
                          </div>

                          <div className="text-[11px] text-muted-foreground truncate font-mono">
                            SKU: {item.produkVariant?.sku || "-"}
                          </div>
                        </td>

                        <td className="p-2 border align-top">
                          {item.jumlah_mutasi}{" "}
                          {item.produkVariant?.satuan?.kode_satuan || "-"}
                        </td>
                        <td
                          className={`p-2 border align-top ${
                            item.tipe_mutasi === "KELUAR"
                              ? "text-red-500"
                              : item.tipe_mutasi === "MASUK"
                                ? "text-green-500"
                                : item.tipe_mutasi === "PENYESUAIAN"
                                  ? "text-blue-500"
                                  : ""
                          }`}
                        >
                          {item.tipe_mutasi}
                        </td>
                        <td className="p-2 border align-top">
                          {item.keterangan_mutasi}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-6 text-center text-sm text-muted-foreground"
                      >
                        📭 Data Tidak Ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
