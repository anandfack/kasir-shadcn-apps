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

export default function MutasiStokBarang({ open, onOpenChange, data }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredData = data?.filter((item) => {
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
      <DialogContent className="h-[450px] max-w-5xl overflow-auto">
        <div className="text-sm space-y-2">
          <DialogHeader>
            <DialogTitle>Mutasi Stok</DialogTitle>
            <DialogDescription>Tabel Mutasi Stok Produk</DialogDescription>
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
                    <th className="p-2 border">Nama Produk</th>
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
                            ? (() => {
                                const d = new Date(item.tanggal_mutasi);
                                const tanggal = d.toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                });
                                const jam = d.toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                                return `${tanggal} ${jam}`;
                              })()
                            : "-"}
                        </td>
                        <td className="p-2 border align-top">
                          {item.produk?.nama_produk || "-"} <br />
                          <span className="text-xs text-gray-500">
                            ({item.produk?.kode_produk || "-"}){" "}
                          </span>
                        </td>
                        <td className="p-2 border align-top">
                          {item.jumlah_mutasi}{" "}
                          {item.produk?.satuan?.nama_satuan || "-"}
                        </td>
                        <td
                          className={`p-2 border align-top ${
                            item.tipe_mutasi === "KELUAR"
                              ? "text-red-500"
                              : item.tipe_mutasi === "MASUK"
                              ? "text-green-500"
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
