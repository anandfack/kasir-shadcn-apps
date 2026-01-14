"use client";

import { useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiRequest";
import { formatRupiah } from "@/lib/formatRupiah";
import { formatTanggal } from "@/lib/formatTanggal";
import { Badge } from "../ui/badge";

export default function PembayaranPembelianProduk({
  open,
  pembelianId,
  onClose,
  onError,
  onSuccess,
  statusBadgeVariant,
  statusPembayaranBadge,
}) {
  const [detailPembelian, setDetailPembelian] = useState(null);
  const [pembayaranPembelian, setPembayaranPembelian] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !pembelianId) return;

    const fetchDetail = async () => {
      try {
        const result = await apiRequest(
          "GET",
          `/api/v1/admin/pembelian-produk/${pembelianId}/pembayaran`
        );

        console.log("result: ", result);

        // Jika data kosong
        if (!result?.data || result.data.length === 0) {
          setPembayaranPembelian({
            nomor_pembelian: "-",
            tanggal_pembelian: "-",
            nomor_faktur: "-",
            supplier: null,
            status_pembelian: "-",
            total_harga: 0,
            PembayaranPembelian: [],
          });
          return;
        }

        const pembayaranPembelian = result.data;

        setPembayaranPembelian({
          ...pembayaranPembelian,
          PembayaranPembelian: (
            pembayaranPembelian.PembayaranPembelian || []
          ).map((item) => ({
            ...item,
            qtyRetur: 0,
            alasan: "",
          })),
        });
      } catch (err) {
        console.error(err);
        onError?.();
      }
    };

    fetchDetail();
  }, [open, pembelianId, onError]);

  if (!pembayaranPembelian) return null;

  const totalAwal = pembayaranPembelian.PembayaranPembelian.reduce(
    (acc, item) => acc + (item.total_harga || 0),
    0
  );

  const totalRetur = pembayaranPembelian.PembayaranPembelian.reduce(
    (acc, item) => acc + (item.qtyRetur || 0) * (item.harga_satuan || 0),
    0
  );

  const totalBayar = pembayaranPembelian.pembayaranPembelian.reduce(
    (sum, item) => sum + (item.jumlah_bayar || 0),
    0
  );

  const selisihPembayaran = (pembayaranPembelian.total_harga || 0) - totalBayar;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const details = pembayaranPembelian.PembayaranPembelian.filter(
      (item) => item.qtyRetur > 0
    );

    if (details.length === 0) {
      alert("Tidak ada produk yang diretur");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        pembelian_id: pembelianId,
        total_harga: details.reduce(
          (sum, item) => sum + item.qtyRetur * item.harga_satuan,
          0
        ),
        details_retur: details.map((item) => ({
          produk_id: item.produk.id,
          jumlah_produk: item.qtyRetur,
          harga_satuan: item.harga_satuan,
          total_harga: item.qtyRetur * item.harga_satuan,
          keterangan: item.alasan || "",
        })),
      };

      await apiRequest("POST", `/api/v1/admin/retur-produk`, payload);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      onError?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="h-[450px] max-w-5xl overflow-auto">
      <div className="text-sm space-y-2">
        <DialogHeader>
          <DialogTitle>Pembayaran Pembelian</DialogTitle>
          <DialogDescription>
            {pembayaranPembelian?.nomor_pembelian} |{" "}
            {formatTanggal(pembayaranPembelian?.tanggal_pembelian)}
          </DialogDescription>
        </DialogHeader>

        <div>
          <strong>Nomor Faktur:</strong> {pembayaranPembelian?.nomor_faktur}
        </div>
        <div>
          <strong>Supplier:</strong>{" "}
          {pembayaranPembelian?.supplier?.nama_supplier || "-"}
        </div>
        <div>
          <strong>Total Harga Pembelian:</strong>{" "}
          {formatRupiah(pembayaranPembelian?.total_harga)}
        </div>
        <div className="flex items-center gap-2">
          <div>
            <strong>Status Pembelian:</strong>{" "}
            <Badge
              variant={statusBadgeVariant(
                pembayaranPembelian?.status_pembelian
              )}
            >
              {pembayaranPembelian?.status_pembelian}
            </Badge>
          </div>
          <div>
            <strong>Status Pembayaran:</strong>{" "}
            <Badge
              variant={statusPembayaranBadge(
                pembayaranPembelian?.status_pembayaran
              )}
            >
              {pembayaranPembelian?.status_pembayaran}
            </Badge>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Detail Pembayaran</h3>

          {pembayaranPembelian?.pembayaranPembelian.length === 0 ? (
            <div className="text-center text-muted-foreground py-6 border rounded">
              Belum ada detail produk
            </div>
          ) : (
            <div className="overflow-x-auto rounded border max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Nomor Pembayaran</th>
                    <th className="p-2 border">Tanggal Pembayaran</th>
                    <th className="p-2 border">Cara Bayar</th>
                    <th className="p-2 border">Nomor Referensi</th>
                    <th className="p-2 border">Nomor Rekening</th>
                    <th className="p-2 border">Petugas</th>
                    <th className="p-2 border">Jumlah Bayar</th>
                  </tr>
                </thead>
                <tbody>
                  {pembayaranPembelian.pembayaranPembelian.map((item, idx) => {
                    const nominalRetur = item.qtyRetur * item.harga_satuan;

                    return (
                      <tr key={idx}>
                        <td className="p-2 border text-center">{idx + 1}</td>
                        <td className="p-2 border text-center">
                          {item.tanggal_bayar}
                        </td>
                        <td className="p-2 border text-center">
                          {formatTanggal(item.tanggal_bayar)}
                        </td>
                        <td className="p-2 border text-center">
                          {item.metode_bayar}
                        </td>
                        <td className="p-2 border text-center">
                          {item.nomor_referensi}
                        </td>
                        <td className="p-2 border text-center">
                          {item.no_rekening}
                        </td>
                        <td className="p-2 border text-center">
                          {item?.pegawai.nama_pegawai}
                        </td>
                        <td className="p-2 border text-right">
                          {formatRupiah(item.jumlah_bayar)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={7}
                      className="p-2 border font-semibold text-right"
                    >
                      TOTAL TAGIHAN
                    </td>
                    <td className="p-2 border font-semibold text-right">
                      {formatRupiah(pembayaranPembelian.total_harga)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan={7}
                      className="p-2 border font-semibold text-right"
                    >
                      TOTAL DIBAYAR
                    </td>
                    <td className="p-2 border font-semibold text-right">
                      {formatRupiah(totalBayar)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan={7}
                      className="p-2 border font-semibold text-right"
                    >
                      SISA TAGIHAN
                    </td>
                    <td className="p-2 border font-semibold text-right">
                      {formatRupiah(selisihPembayaran)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* <div className="flex justify-end gap-2 mt-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div> */}
    </DialogContent>
  );
}
