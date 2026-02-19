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
import { CalendarIcon } from "lucide-react";

export default function AdminReturPenerimaanPo({
  //   open,
  penerimaanPoId,
  onClose,
  onError,
  onSuccess,
}) {
  const [penerimaan, setPenerimaan] = useState(null);
  const [returItems, setReturItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tanggalRetur, setTanggalRetur] = useState("");

  useEffect(() => {
    if (!open || !penerimaanPoId) return;

    const fetchDetail = async () => {
      try {
        const result = await apiRequest(
          "GET",
          `/api/v1/admin/penerimaan-po/${penerimaanPoId}`,
        );

        if (!result?.data) {
          setPenerimaan(null);
          setReturItems([]);
          return;
        }

        const data = result.data;

        setPenerimaan(data);

        // Inisialisasi returItems dari details penerimaan
        const initialRetur = (data.details || []).map((item) => ({
          penerimaan_barang_detail_id: item.id,
          tanggal_retur: "-",
          qtyRetur: 0,
          alasan: "",
        }));

        setReturItems(initialRetur);
      } catch (err) {
        console.error(err);
        onError?.();
      }
    };

    fetchDetail();
  }, [penerimaanPoId, onError]);

  // ✅ LETAKKAN DI SINI (sejajar effect di atas)
  useEffect(() => {
    return () => {
      setPenerimaan(null);
      setReturItems([]);
    };
  }, []);

  if (!penerimaan) return null;

  const totalAwal = penerimaan.details?.reduce(
    (acc, item) => acc + (item.total_harga || 0),
    0,
  );

  const totalRetur = returItems.reduce(
    (acc, item) => acc + (item.qtyRetur || 0) * (item.harga_satuan || 0),
    0,
  );

  const totalSetelahRetur = totalAwal - totalRetur;

  /**
   * Submit retur produk
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const details = penerimaan.details.filter((item) => item.qtyRetur > 0);

    if (details.length === 0) {
      alert("Tidak ada produk yang diretur");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        penerimaan_id: penerimaanPoId,
        tanggal_retur: tanggalRetur,
        total_harga: details.reduce(
          (sum, item) => sum + item.qtyRetur * item.harga_satuan,
          0,
        ),
        details_retur: details.map((item) => ({
          produkvariant_id: item.produkVariant.id,
          jumlah_produk: item.qtyRetur,
          harga_satuan: item.harga_satuan,
          total_harga: item.qtyRetur * item.harga_satuan,
          keterangan: item.alasan || "",
        })),
      };

      console.log("Payload Retur:", payload);

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
    <DialogContent className="h-[90vh] sm:max-w-7xl flex flex-col overflow-auto">
      <div className="text-sm space-y-2 flex-1 overflow-auto">
        <DialogHeader>
          <DialogTitle>Retur Penerimaan</DialogTitle>
          <DialogDescription>
            {penerimaan.nomor_penerimaan} |{" "}
            {formatTanggal(penerimaan.tanggal_penerimaan)}
          </DialogDescription>
        </DialogHeader>

        <div>
          <strong>Supplier:</strong>{" "}
          {penerimaan.purchaseOrder?.supplier?.nama_supplier || "-"}
        </div>

        <div>
          <strong>Petugas:</strong> {penerimaan.pegawai?.nama_pegawai || "-"}
        </div>

        <div className="p-3 border rounded-lg bg-muted/40 flex items-center gap-4">
          <CalendarIcon className="w-5 h-5 text-emerald-500" />

          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              Tanggal Penerimaan Barang
            </p>

            <Input
              type="date"
              value={tanggalRetur}
              onChange={(e) => setTanggalRetur(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto py-4">
          <h3 className="font-semibold mb-2">Detail Penerimaan</h3>

          {penerimaan.details?.length === 0 ? (
            <div className="text-center text-muted-foreground py-6 border rounded">
              Belum ada detail penerimaan
            </div>
          ) : (
            <div className="overflow-auto rounded border max-h-[450px]">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Produk</th>
                    <th className="p-2 border">SKU</th>
                    <th className="p-2 border">Qty Diterima</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Subtotal</th>
                    <th className="p-2 border">Sudah Retur</th>
                    <th className="p-2 border">Qty Retur</th>
                    <th className="p-2 border">Nominal Retur</th>
                    <th className="p-2 border">Alasan</th>
                  </tr>
                </thead>

                <tbody>
                  {penerimaan.details.map((item, idx) => {
                    const sisaRetur =
                      item.jumlah_produk - (item.qty_retur || 0);

                    const nominalRetur =
                      (item.qtyRetur || 0) * item.harga_satuan;

                    const subTotal = item.jumlah_produk * item.harga_satuan;

                    const satuan =
                      item.produkVariant?.satuan?.kode_satuan || "";

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          item.qtyRetur > 0
                            ? "bg-rose-50 dark:bg-rose-950"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <td className="p-2 border text-center">{idx + 1}</td>

                        <td className="p-2 border text-center">
                          {item.produkVariant?.produk?.nama_produk}
                        </td>

                        <td className="p-2 border text-center font-mono">
                          {item.produkVariant?.sku}
                        </td>

                        <td className="p-2 border text-center">
                          {item.jumlah_produk} {satuan}
                        </td>

                        <td className="p-2 border text-center">
                          {formatRupiah(item.harga_satuan)}
                        </td>

                        <td className="p-2 border text-center">
                          {formatRupiah(subTotal)}
                        </td>

                        <td className="p-2 border text-center">
                          {item.qty_retur || 0} {satuan}
                        </td>

                        <td className="p-2 border text-center">
                          <Input
                            type="number"
                            min={0}
                            max={sisaRetur}
                            className="w-20"
                            value={item.qtyRetur || ""}
                            onChange={(e) => {
                              let value = parseInt(e.target.value) || 0;
                              value = Math.min(Math.max(value, 0), sisaRetur);

                              setPenerimaan((prev) => ({
                                ...prev,
                                details: prev.details.map((row) =>
                                  row.id === item.id
                                    ? { ...row, qtyRetur: value }
                                    : row,
                                ),
                              }));
                            }}
                          />
                        </td>

                        <td className="p-2 border text-center">
                          {formatRupiah(nominalRetur)}
                        </td>

                        <td className="p-2 border">
                          <Textarea
                            className="text-xs"
                            placeholder="Alasan retur"
                            value={item.alasan}
                            onChange={(e) => {
                              const value = e.target.value;
                              setPenerimaan((prev) => ({
                                ...prev,
                                details: prev.details.map((row) =>
                                  row.id === item.id
                                    ? { ...row, alasan: value }
                                    : row,
                                ),
                              }));
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot className="sticky bottom-0 bg-muted font-semibold z-10">
                  <tr>
                    <td colSpan={7} className="p-2 border text-center">
                      TOTAL RETUR
                    </td>
                    <td className="p-2 border text-center">
                      {penerimaan.details.reduce(
                        (acc, item) => acc + (item.qtyRetur || 0),
                        0,
                      )}
                    </td>
                    <td className="p-2 border text-center">
                      {formatRupiah(
                        penerimaan.details.reduce(
                          (acc, item) =>
                            acc + (item.qtyRetur || 0) * item.harga_satuan,
                          0,
                        ),
                      )}
                    </td>
                    <td className="p-2 border"></td>
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
          className="bg-rose-600 hover:bg-rose-700 text-white"
        >
          {loading ? "Menyimpan..." : "Simpan Retur"}
        </Button>
      </div>
    </DialogContent>
  );
}
