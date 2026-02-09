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
import { CalendarIcon, Loader2Icon, PackageCheckIcon } from "lucide-react";

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

        setPurchaseOrder({
          ...purchaseOrder,
          details: (purchaseOrder.details || []).map((item) => ({
            ...item,
            qtyTerima: 0,
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
    (acc, item) => acc + (item.qtyTerima || 0) * (item.harga_satuan || 0),
    0,
  );

  const totalQty = purchaseOrder.details.reduce(
    (acc, item) => acc + (item.jumlah_produk || 0),
    0,
  );

  const totalSubtotal = purchaseOrder.details.reduce(
    (acc, item) => acc + (item.total_harga || 0),
    0,
  );

  const totalSudahTerima = purchaseOrder.details.reduce(
    (acc, item) => acc + (item.qty_diterima || 0),
    0,
  );

  const totalQtyTerima = purchaseOrder.details.reduce(
    (acc, item) => acc + (item.qtyTerima || 0),
    0,
  );

  const totalNilaiSudahTerima = purchaseOrder.details.reduce(
    (acc, item) => acc + (item.qty_diterima || 0) * (item.harga_satuan || 0),
    0,
  );

  const totalSisa = purchaseOrder.details.reduce((acc, item) => {
    const sisa = Math.max(
      item.jumlah_produk - item.qty_diterima - (item.qtyTerima || 0),
      0,
    );
    return acc + sisa;
  }, 0);

  const totalHargaTerima = purchaseOrder.details.reduce(
    (acc, item) => acc + (item.qtyTerima || 0) * (item.harga_satuan || 0),
    0,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const details = purchaseOrder.details.filter((item) => item.qtyTerima > 0);

    if (details.length === 0) {
      alert("Tidak ada produk yang diterima");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        purchase_order_id: terimaId,
        tanggal_penerimaan: purchaseOrder.tanggal_penerimaan,
        total_harga: details.reduce(
          (sum, item) => sum + item.qtyTerima * item.harga_satuan,
          0,
        ),
        details_penerimaan: details.map((item) => ({
          produk_variant_id: item.produkVariant.id,
          jumlah_produk: item.qtyTerima,
          harga_satuan: item.harga_satuan,
          total_harga: item.qtyTerima * item.harga_satuan,
        })),
      };

      await apiRequest("POST", `/api/v1/admin/penerimaan-po`, payload);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="h-[90vh] sm:max-w-7xl flex flex-col overflow-auto">
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
        <div className="p-3 border rounded-lg bg-muted/40 flex items-center gap-4">
          <CalendarIcon className="w-5 h-5 text-emerald-500" />

          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              Tanggal Penerimaan Barang
            </p>

            <Input
              type="date"
              value={purchaseOrder.tanggal_penerimaan || ""}
              onChange={(e) =>
                setPurchaseOrder((prev) => ({
                  ...prev,
                  tanggal_penerimaan: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="mt-4 flex-1 overflow-y-auto py-4">
          <h3 className="font-semibold mb-2">Detail Purchase Order</h3>

          {purchaseOrder.details.length === 0 ? (
            <div className="text-center text-muted-foreground py-6 border rounded">
              Belum ada detail produk
            </div>
          ) : (
            <div className="overflow-auto rounded border max-h-[300px]">
              <table className="w-full text-sm overflow-y-auto">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Nama Produk</th>
                    <th className="p-2 border">SKU</th>
                    <th className="p-2 border">Ukuran</th>
                    <th className="p-2 border">Warna</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Subtotal</th>
                    <th className="p-2 border">Sudah Terima</th>
                    <th className="p-2 border">Qty Terima</th>
                    <th className="p-2 border">Nilai Sudah Terima</th>
                    <th className="p-2 border">Sisa</th>
                    <th className="p-2 border">Harga Terima</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrder.details.map((item, idx) => {
                    const nominalHargaPenerimaan =
                      item.qtyTerima * item.harga_satuan;

                    const sisaQty = Math.max(
                      item.jumlah_produk - item.qty_diterima,
                      0,
                    );

                    const sisaRealtime = Math.max(
                      sisaQty - (item.qtyTerima || 0),
                      0,
                    );

                    const totalDiterima =
                      (item.qty_diterima || 0) + (item.qtyTerima || 0);

                    const nilaiSudahDiterima =
                      (item.qty_diterima || 0) * (item.harga_satuan || 0);

                    return (
                      <tr
                        key={item.id}
                        className={`text-xs transition-colors ${
                          item.qtyTerima > 0
                            ? "bg-emerald-50 dark:bg-emerald-950"
                            : "hover:bg-muted/50"
                        }`}
                      >
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
                          {item.jumlah_produk}{" "}
                          {item?.produkVariant?.satuan?.kode_satuan}
                        </td>
                        <td className="p-2 border text-center">
                          {formatRupiah(item.harga_satuan)}
                        </td>
                        <td className="p-2 border text-center">
                          {formatRupiah(item.total_harga)}
                        </td>
                        <td className="p-2 border text-center">
                          {item.qty_diterima}{" "}
                          {item?.produkVariant?.satuan?.kode_satuan}
                        </td>
                        <td className="p-2 border text-center">
                          <Input
                            type="number"
                            min={0}
                            max={sisaQty}
                            disabled={loading || sisaQty === 0}
                            className="w-20"
                            value={item.qtyTerima || ""}
                            onChange={(e) => {
                              let value = parseInt(e.target.value) || 0;
                              value = Math.min(Math.max(value, 0), sisaQty);

                              setPurchaseOrder((prev) => ({
                                ...prev,
                                details: prev.details.map((row) =>
                                  row.id === item.id
                                    ? { ...row, qtyTerima: value }
                                    : row,
                                ),
                              }));
                            }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {item?.produkVariant?.satuan?.kode_satuan}
                          </span>
                        </td>
                        <td className="p-2 border text-center">
                          {formatRupiah(nilaiSudahDiterima)}
                        </td>

                        <td className="p-2 border text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span>
                              {sisaRealtime}{" "}
                              {item?.produkVariant?.satuan?.kode_satuan}
                            </span>

                            {totalDiterima >= item.jumlah_produk && (
                              <span className="text-xs text-emerald-600 font-semibold">
                                ✔ Complete
                              </span>
                            )}

                            {totalDiterima > 0 &&
                              totalDiterima < item.jumlah_produk && (
                                <span className="text-xs text-amber-600 font-semibold">
                                  Partial
                                </span>
                              )}
                          </div>
                        </td>

                        <td className="p-2 border text-center">
                          {formatRupiah(nominalHargaPenerimaan)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="sticky bottom-0 bg-muted font-semibold text-xs z-10">
                  <tr>
                    <td className="p-2 border text-center" colSpan={5}>
                      TOTAL
                    </td>

                    <td className="p-2 border text-center">{totalQty}</td>

                    <td className="p-2 border"></td>

                    <td className="p-2 border text-center">
                      {formatRupiah(totalSubtotal)}
                    </td>

                    <td className="p-2 border text-center">
                      {totalSudahTerima}
                    </td>

                    <td className="p-2 border text-center">{totalQtyTerima}</td>

                    <td className="p-2 border text-center">
                      {formatRupiah(totalNilaiSudahTerima)}
                    </td>

                    <td className="p-2 border text-center">{totalSisa}</td>

                    <td className="p-2 border text-center">
                      {formatRupiah(totalHargaTerima)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-4 flex justify-end gap-2 bg-background">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <PackageCheckIcon className="w-4 h-4" />
              Simpan Penerimaan
            </>
          )}
        </Button>
      </div>
    </DialogContent>
  );
}
