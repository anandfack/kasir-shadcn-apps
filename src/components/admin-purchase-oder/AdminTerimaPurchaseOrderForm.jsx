"use client";

import { useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiRequest";
import { formatRupiah } from "@/lib/formatRupiah";
import { formatTanggal } from "@/lib/formatTanggal";

export default function AdminTerimaPurchaseOrderForm({
  open,
  terimaId,
  onClose,
  onError,
  onSuccess,
}) {
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !terimaId) return;

    const fetchDetail = async () => {
      try {
        const result = await apiRequest(
          "GET",
          `/api/v1/admin/purchase-order/${terimaId}`,
        );

        // Jika data kosong
        if (!result?.data || result.data.length === 0) {
          setPurchaseOrder({
            nomor_pembelian: "-",
            tanggal_pembelian: "-",
            nomor_faktur: "-",
            supplier: null,
            status_pembelian: "-",
            total_harga: 0,
            details: [],
          });
          return;
        }

        const purchaseOrder = result.data;
        console.log("data purchase order:", purchaseOrder);

        setPurchaseOrder({
          ...purchaseOrder,
          details: (purchaseOrder.details || []).map((item) => ({
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
  }, [open, terimaId, onError]);

  if (!purchaseOrder) return null;

  const totalAwal = purchaseOrder.details.reduce(
    (acc, item) => acc + (item.total_harga || 0),
    0,
  );

  const totalPurchaseOrder = purchaseOrder.details.reduce(
    (acc, item) => acc + (item.qtyRetur || 0) * (item.harga_satuan || 0),
    0,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const details = purchaseOrder.details.filter((item) => item.qtyRetur > 0);

    if (details.length === 0) {
      alert("Tidak ada produk yang diretur");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        pembelian_id: terimaId,
        total_harga: details.reduce(
          (sum, item) => sum + item.qtyRetur * item.harga_satuan,
          0,
        ),
        details_retur: details.map((item) => ({
          produk_id: item.produk.id,
          jumlah_produk: item.qtyRetur,
          harga_satuan: item.harga_satuan,
          total_harga: item.qtyRetur * item.harga_satuan,
          keterangan: item.alasan || "",
        })),
      };

      console.log("payload retur pembelian:", payload);

      //   await apiRequest("POST", `/api/v1/admin/retur-produk`, payload);

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
    <DialogContent className="h-[90vh] max-w-5xl overflow-auto">
      <div className="text-sm space-y-2">
        <DialogHeader>
          <DialogTitle>Penerimaan</DialogTitle>
          <DialogDescription>
            {purchaseOrder.nomor_po} | {formatTanggal(purchaseOrder.tanggal_po)}
          </DialogDescription>
        </DialogHeader>
        <div>
          <strong>Supplier:</strong>{" "}
          {purchaseOrder.supplier?.nama_supplier || "-"}
        </div>
        <div>
          <strong>Petugas:</strong> {purchaseOrder.pegawai?.nama_pegawai || "-"}
        </div>
        <div>
          <strong>Total Harga Pembelian:</strong>{" "}
          {formatRupiah(purchaseOrder.total_harga)}
        </div>
        <div>
          <strong>Status:</strong> {purchaseOrder.status_po}
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Detail Purchase Order</h3>

          {purchaseOrder.details.length === 0 ? (
            <div className="text-center text-muted-foreground py-6 border rounded">
              Belum ada detail produk
            </div>
          ) : (
            <div className="overflow-x-auto rounded border max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Nama Produk</th>
                    <th className="p-2 border">SKU</th>
                    <th className="p-2 border">Ukuran</th>
                    <th className="p-2 border">Warna</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Subtotal</th>
                    <th className="p-2 border">Qty Terima</th>
                    <th className="p-2 border">Harga Terima</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrder.details.map((item, idx) => {
                    const nominalHargaPenerimaan =
                      item.qtyRetur * item.harga_satuan;

                    return (
                      <tr key={idx}>
                        <td className="p-2 border text-center">{idx + 1}</td>
                        <td className="p-2 border text-center">
                          {item?.produkVariant?.produk?.nama_produk}
                        </td>
                        <td className="p-2 border text-center">
                          {item.produkVariant?.sku}
                        </td>
                        <td className="p-2 border text-center">
                          {item.produkVariant?.ukuran}
                        </td>
                        <td className="p-2 border text-center">
                          {item.produkVariant?.warna}
                        </td>
                        <td className="p-2 border text-center">
                          {item.jumlah_produk} {" "}
                          {item?.produkVariant?.satuan?.kode_satuan}
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
                            min={0}
                            max={item.jumlah_produk}
                            className="w-20"
                            value={item.qtyRetur || ""}
                            onChange={(e) => {
                              let value = parseInt(e.target.value) || 0;
                              value = Math.min(
                                Math.max(value, 0),
                                item.jumlah_produk,
                              );

                              setPurchaseOrder((prev) => ({
                                ...prev,
                                details: prev.details.map((row, i) =>
                                  i === idx ? { ...row, qtyRetur: value } : row,
                                ),
                              }));
                            }}
                          />
                        </td>
                        <td className="p-2 border text-center">
                          {formatRupiah(nominalHargaPenerimaan)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 text-sm space-y-1">
            <div>
              <strong>Total Purchase Order:</strong> {formatRupiah(totalAwal)}
            </div>
            <div>
              <strong>Total Harga Terima:</strong>
              {formatRupiah(totalPurchaseOrder)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </DialogContent>
  );
}
