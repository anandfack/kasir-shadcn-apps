"use client";

import { useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { apiRequest } from "@/app/utils/fetchOptions";

// helper format rupiah
const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

export default function DetailPembelianProduk({
  open,
  onOpenChange,
  pembelianId,
  onClose,
  onError,
  onSuccess,
}) {
  const [detailPembelian, setDetailPembelian] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && pembelianId) {
      (async () => {
        const res = await fetch(`/api/v1/pembelian-produk/${pembelianId}`);
        const data = await res.json();

        const dataWithExtra = {
          ...data,
          DetailPembelian: (data.DetailPembelian || []).map((item) => ({
            ...item,
            qtyRetur: 0,
            alasan: "",
          })),
        };
        setDetailPembelian(dataWithExtra);
      })();
    }
  }, [open, pembelianId]);

  const totalAwal =
    detailPembelian?.DetailPembelian?.reduce(
      (acc, item) => acc + (item.total_harga || 0),
      0
    ) || 0;

  const totalRetur =
    detailPembelian?.DetailPembelian?.reduce(
      (acc, item) => acc + (item.qtyRetur || 0) * (item.harga_satuan || 0),
      0
    ) || 0;

  const totalSetelahRetur = totalAwal - totalRetur;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ambil data dari detailPembelian.DetailPembelian
      const details = detailPembelian.DetailPembelian.filter(
        (item) => item.qtyRetur > 0
      ) // hanya yg ada retur
        .map((item) => {
          const hargaProduk = item.jumlah_produk * item.harga_satuan;
          const totalHarga = item.qtyRetur * item.harga_satuan;

          return {
            produk_id: item.produk.id, // <- pastikan item.produk ada
            jumlah_produk: item.qtyRetur,
            harga_satuan: item.harga_satuan,
            harga_produk: hargaProduk,
            total_harga: totalHarga,
            keterangan: item.alasan || "",
          };
        });

      const totalHargaRetur = details.reduce(
        (sum, item) => sum + item.total_harga,
        0
      );

      // Buat nomor retur & tanggal retur (sementara hardcode dulu kalau belum ada input form)

      const body = {
        pembelian_id: pembelianId,
        produk_id: details[0]?.produk_id || null, // bisa opsional kalau backend gak butuh
        total_harga: totalHargaRetur,
        details_retur: details,
      };

      console.log("Payload dikirim:", body);

      await apiRequest("POST", `/api/v1/retur-produk`, body);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error retur:", error);
      onError?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="h-[450px] max-w-5xl overflow-auto">
      <div className="text-sm space-y-2">
        <DialogHeader>
          <DialogTitle>Detail Pembelian</DialogTitle>
          <DialogDescription>
            {detailPembelian?.nomor_pembelian || "-"} |{" "}
            {detailPembelian?.tanggal_pembelian}
          </DialogDescription>
        </DialogHeader>

        <div>
          <strong>Nomor Faktur:</strong> {detailPembelian?.nomor_faktur}
        </div>
        <div>
          <strong>Supplier:</strong>{" "}
          {detailPembelian?.supplier?.nama_supplier || "-"}
        </div>
        <div>
          <strong>Total Harga Pembelian:</strong>{" "}
          {formatRupiah(detailPembelian?.total_harga || 0)}
        </div>
        <div>
          <strong>Status:</strong> {detailPembelian?.status_pembelian}
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Detail Produk</h3>
          <div className="overflow-x-auto rounded border max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Nama Produk</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Harga</th>
                  <th className="p-2 border">Subtotal</th>
                  <th className="p-2 border">Qty Retur</th>
                  <th className="p-2 border">Nominal Retur</th>
                  <th className="p-2 border">Alasan</th>
                </tr>
              </thead>
              <tbody>
                {detailPembelian?.DetailPembelian?.map((item, idx) => {
                  const nominalRetur =
                    (item.qtyRetur || 0) * (item.harga_satuan || 0);
                  return (
                    <tr key={idx}>
                      <td className="p-2 border text-center">{idx + 1}</td>
                      <td className="p-2 border text-center">
                        {item.produk?.nama_produk}
                      </td>
                      <td className="p-2 border text-center">
                        {item.jumlah_produk}
                      </td>
                      <td className="p-2 border text-center">
                        {formatRupiah(item.harga_satuan)}
                      </td>
                      <td className="p-2 border text-center">
                        {formatRupiah(item.total_harga)}
                      </td>
                      <td className="p-2 border text-center">
                        <Input
                          type="number"
                          min="0"
                          max={item.jumlah_produk}
                          value={item.qtyRetur === 0 ? "" : item.qtyRetur}
                          placeholder="Qty retur"
                          className="w-20"
                          onChange={(e) => {
                            let value = parseInt(e.target.value) || 0;

                            if (value > item.jumlah_produk)
                              value = item.jumlah_produk;
                            if (value < 0) value = 0;

                            setDetailPembelian((prev) => {
                              const newData = { ...prev };
                              newData.DetailPembelian[idx].qtyRetur = value;
                              return newData;
                            });
                          }}
                        />
                      </td>
                      <td className="p-2 border text-center">
                        {formatRupiah(nominalRetur)}
                      </td>
                      <td className="p-2 border">
                        <Textarea
                          placeholder="Alasan"
                          value={item.alasan}
                          onChange={(e) => {
                            const value = e.target.value;
                            setDetailPembelian((prev) => {
                              const newData = { ...prev };
                              newData.DetailPembelian[idx].alasan = value;
                              return newData;
                            });
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

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
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={handleSubmit}>Simpan</Button>
      </div>
    </DialogContent>
  );
}
