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
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function AdminPembayaranInvoice({
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
  const [jumlahBayar, setJumlahBayar] = useState("");
  const [metodeBayar, setMetodeBayar] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");
  const [nomorReferensi, setNomorReferensi] = useState("");

  useEffect(() => {
    if (!open || !pembelianId) return;

    const fetchDetail = async () => {
      try {
        const result = await apiRequest(
          "GET",
          `/api/v1/admin/pembelian-produk/${pembelianId}/pembayaran`,
        );

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

  const totalBayar = pembayaranPembelian.pembayaranPembelian.reduce(
    (sum, item) => sum + (item.jumlah_bayar || 0),
    0,
  );

  const selisihPembayaran = (pembayaranPembelian.total_harga || 0) - totalBayar;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jumlahBayarFloat = parseFloat(jumlahBayar);

      await apiRequest("POST", "/api/v1/admin/pembayaran-pembelian", {
        pembelian_id: pembelianId,
        jumlah_bayar: jumlahBayarFloat,
        nomor_referensi: nomorReferensi,
        nomor_rekening: nomorRekening,
        metode_bayar: metodeBayar,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto">
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
                pembayaranPembelian?.status_pembelian,
              )}
            >
              {pembayaranPembelian?.status_pembelian}
            </Badge>
          </div>
          <div>
            <strong>Status Pembayaran:</strong>{" "}
            <Badge
              variant={statusPembayaranBadge(
                pembayaranPembelian?.status_pembayaran,
              )}
            >
              {pembayaranPembelian?.status_pembayaran}
            </Badge>
          </div>
        </div>

        <div className="mt-4 my-8">
          {pembayaranPembelian?.status_pembayaran === "BELUM_BAYAR" ||
          pembayaranPembelian?.status_pembayaran === "SEBAGIAN" ? (
            <>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold">
                    Pembayaran Pembelian
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="mt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-4 items-center gap-4 ">
                            <Label htmlFor="harga-beli">
                              Jumlah Bayar <i className="text-red-500">*</i>
                            </Label>
                            <Input
                              id="jumlah-bayar"
                              value={jumlahBayar}
                              onChange={(e) => setJumlahBayar(e.target.value)}
                              className="col-span-3"
                              placeholder="Masukkan jumlah bayar"
                            />
                          </div>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="metode-bayar">
                                Metode Bayar <i className="text-red-500">*</i>
                              </Label>
                              <div className="col-span-3">
                                <Select
                                  value={metodeBayar}
                                  onValueChange={(value) =>
                                    setMetodeBayar(value)
                                  }
                                >
                                  <SelectTrigger id="metode-bayar">
                                    <SelectValue placeholder="Pilih Metode Bayar" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value="TUNAI">
                                        Tunai
                                      </SelectItem>
                                      <SelectItem value="TRANSFER">
                                        Transfer
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            {metodeBayar === "TRANSFER" && (
                              <>
                                <div className="grid grid-cols-4 items-center gap-4 ">
                                  <Label htmlFor="harga-beli">
                                    Nomor Referensi{" "}
                                    <i className="text-red-500">*</i>
                                  </Label>
                                  <Input
                                    id="nomor-referensi"
                                    value={nomorReferensi}
                                    onChange={(e) =>
                                      setNomorReferensi(e.target.value)
                                    }
                                    className="col-span-3"
                                    placeholder="Masukkan nomor referensi"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4 ">
                                  <Label htmlFor="nomor-rekening">
                                    Nomor Rekening{" "}
                                    <i className="text-red-500">*</i>
                                  </Label>
                                  <Input
                                    id="nomor-rekening"
                                    value={nomorRekening}
                                    onChange={(e) =>
                                      setNomorRekening(e.target.value)
                                    }
                                    className="col-span-3"
                                    placeholder="Masukkan nomor rekening"
                                  />
                                </div>
                              </>
                            )}
                            <div className="flex justify-end gap-2">
                              <Button
                                // onClick={handleSubmit}
                                disabled={loading}
                                type="submit"
                              >
                                {loading ? "Menyimpan..." : "Simpan"}
                              </Button>
                            </div>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ) : null}
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-2"
          >
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                Riwayat Pembayaran Pembelian
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-4">
                  {/* <h3 className="font-semibold mb-2">Detail Pembayaran</h3> */}

                  {pembayaranPembelian?.pembayaranPembelian.length === 0 ? (
                    <div className="text-center text-muted-foreground py-6 border rounded">
                      Belum ada pembayaran
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
                          {pembayaranPembelian.pembayaranPembelian.map(
                            (item, idx) => {
                              return (
                                <tr key={idx}>
                                  <td className="p-2 border text-center">
                                    {idx + 1}
                                  </td>
                                  <td className="p-2 border text-center">
                                    {item.nomor_pembayaran}
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
                                    {item.nomor_rekening}
                                  </td>
                                  <td className="p-2 border text-center">
                                    {item?.pegawai.nama_pegawai}
                                  </td>
                                  <td className="p-2 border text-right">
                                    {formatRupiah(item.jumlah_bayar)}
                                  </td>
                                </tr>
                              );
                            },
                          )}
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </DialogContent>
  );
}
