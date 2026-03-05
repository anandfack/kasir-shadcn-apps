"use client";

import { useEffect, useState, useMemo } from "react";
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
import { Card, CardContent } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { CalendarIcon, SaveIcon, TrashIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminPembayaranInvoice({
  open,
  invoiceId,
  onClose,
  onError,
  onSuccess,
}) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jumlahBayar, setJumlahBayar] = useState("");
  const [metodeBayar, setMetodeBayar] = useState("");
  const [tanggalBayar, setTanggalBayar] = useState(new Date());
  const [nomorReferensi, setNomorReferensi] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");
  const [batalPembayaran, setBatalPembayaran] = useState(null);

  useEffect(() => {
    if (!open || !invoiceId) return;

    const fetchDetail = async () => {
      try {
        const result = await apiRequest(
          "GET",
          `/api/v1/admin/invoice/${invoiceId}/pembayaran-invoice`,
        );

        setInvoice(result.data);
      } catch (err) {
        console.error(err);
        onError?.();
      }
    };

    fetchDetail();
  }, [open, invoiceId, onError]);

  const totalBayar = useMemo(() => {
    if (!invoice?.pembayaranInvoices) return 0;
    return invoice.pembayaranInvoices.reduce(
      (sum, item) => sum + Number(item.jumlah_bayar || 0),
      0,
    );
  }, [invoice]);

  const sisaTagihan = invoice?.sisa_tagihan || 0;

  if (!invoice) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        invoice_id: invoice.id,
        jumlah_bayar: Number(jumlahBayar),
        metode_bayar: metodeBayar,
        nomor_referensi: metodeBayar === "TRANSFER" ? nomorReferensi : null,
        nomor_rekening: metodeBayar === "TRANSFER" ? nomorRekening : null,
        tanggal_bayar: tanggalBayar.toISOString(),
      };

      console.log("Payload: ", payload);

      await apiRequest("POST", "/api/v1/admin/pembayaran-invoice", payload);

      onSuccess?.();
    } catch (error) {
      console.error(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatal = async () => {
    if (!batalPembayaran) return;

    try {
      await apiRequest(
        "POST",
        `/api/v1/admin/pembayaran-invoice/${batalPembayaran.id}/batal`,
      );

      const result = await apiRequest(
        "GET",
        `/api/v1/admin/invoice/${invoiceId}/pembayaran-invoice`,
      );

      setInvoice(result.data);
      setBatalPembayaran(null);

      onSuccess?.();
    } catch (error) {
      console.error(error);
      onError?.(error);
    }
  };
  return (
    <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-y-auto text-xs">
      <div className="text-sm space-y-3">
        <DialogHeader>
          <DialogTitle>Pembayaran Invoice</DialogTitle>
          <DialogDescription>
            {invoice.nomor_invoice} | {formatTanggal(invoice.tanggal_invoice)}
          </DialogDescription>
        </DialogHeader>

        <div>
          <strong>Total Tagihan:</strong> {formatRupiah(invoice.total_tagihan)}
        </div>

        {invoice?.status !== "PAID" && (
          <div>
            <strong>Sisa Tagihan:</strong> {formatRupiah(sisaTagihan)}
          </div>
        )}

        <div>
          <strong>Status:</strong> <Badge>{invoice.status}</Badge>
        </div>

        {/* FORM PEMBAYARAN */}
        {invoice.status !== "PAID" && (
          <Accordion type="single" collapsible defaultValue="form">
            <AccordionItem value="form">
              <AccordionTrigger className="text-lg font-semibold">
                Input Pembayaran
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="mt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-4 gap-4 items-center">
                        <Label>Tanggal Retur</Label>

                        <Popover modal={false}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-rose-500" />
                              {format(tanggalBayar, "dd MMMM yyyy", {
                                locale: id,
                              })}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            align="start"
                            side="bottom"
                            sideOffset={8}
                            className="w-auto p-0"
                            style={{ pointerEvents: "auto" }}
                          >
                            <Calendar
                              mode="single"
                              locale={id}
                              selected={tanggalBayar}
                              captionLayout="dropdown"
                              fromYear={2020}
                              toYear={new Date().getFullYear()}
                              disabled={{ after: new Date() }}
                              onSelect={(date) => {
                                if (date) {
                                  const now = new Date();
                                  date.setHours(
                                    now.getHours(),
                                    now.getMinutes(),
                                    now.getSeconds(),
                                    now.getMilliseconds(),
                                  );
                                  setTanggalBayar(date);
                                }
                              }}
                              initialFocus
                              className="rounded-lg border"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="grid grid-cols-4 gap-4 items-center">
                        <Label>Jumlah Bayar *</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          className="col-span-3"
                          value={
                            jumlahBayar
                              ? Number(jumlahBayar).toLocaleString("id-ID")
                              : ""
                          }
                          onChange={(e) => {
                            // hapus semua selain angka
                            const raw = e.target.value.replace(/\D/g, "");

                            if (!raw) {
                              setJumlahBayar("");
                              return;
                            }

                            let numeric = parseInt(raw, 10);

                            // batasi ke sisaTagihan
                            numeric = Math.min(
                              Math.max(numeric, 0),
                              sisaTagihan,
                            );

                            setJumlahBayar(numeric);
                          }}
                          placeholder="Masukkan jumlah bayar"
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-4 items-center">
                        <Label>Metode Bayar *</Label>
                        <div className="col-span-3">
                          <Select
                            value={metodeBayar}
                            onValueChange={setMetodeBayar}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih metode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="TUNAI">Tunai</SelectItem>
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
                          <div className="grid grid-cols-4 gap-4 items-center">
                            <Label>Nomor Referensi *</Label>
                            <Input
                              className="col-span-3"
                              value={nomorReferensi}
                              onChange={(e) =>
                                setNomorReferensi(e.target.value)
                              }
                            />
                          </div>

                          <div className="grid grid-cols-4 gap-4 items-center">
                            <Label>Nomor Rekening *</Label>
                            <Input
                              className="col-span-3"
                              value={nomorRekening}
                              onChange={(e) => setNomorRekening(e.target.value)}
                            />
                          </div>
                        </>
                      )}

                      <div className="flex justify-end">
                        <Button disabled={loading} type="submit">
                          {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* RIWAYAT */}
        <Accordion type="single" collapsible defaultValue="riwayat">
          <AccordionItem value="riwayat">
            <AccordionTrigger className="text-lg font-semibold">
              Riwayat Pembayaran
            </AccordionTrigger>
            <AccordionContent>
              {invoice.pembayaranInvoices.length === 0 ? (
                <div className="text-center py-6 border rounded">
                  Belum ada pembayaran
                </div>
              ) : (
                <div className="overflow-x-auto border rounded">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Nomor</th>
                        <th className="p-2 border">Tanggal</th>
                        <th className="p-2 border">Metode</th>
                        <th className="p-2 border">Referensi</th>
                        <th className="p-2 border">Rekening</th>
                        <th className="p-2 border">Petugas</th>
                        <th className="p-2 border text-right">Jumlah</th>
                        <th className="p-2 border text-center">Status Bayar</th>
                        <th className="p-2 border text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.pembayaranInvoices.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="p-2 border text-center">{idx + 1}</td>
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
                            {item.nomor_referensi || "-"}
                          </td>
                          <td className="p-2 border text-center">
                            {item.nomor_rekening || "-"}
                          </td>
                          <td className="p-2 border text-center">
                            {item.pegawai?.nama_pegawai}
                          </td>
                          <td className="p-2 border text-right">
                            {formatRupiah(item.jumlah_bayar)}
                          </td>
                          <td className="p-2 border text-center">
                            <span
                              className={
                                item.deleted_at
                                  ? "text-red-500 font-semibold"
                                  : "text-green-600 font-semibold"
                              }
                            >
                              {item.deleted_at ? "CANCELLED" : "SUCCESS"}
                            </span>
                          </td>
                          <td className="p-2 border text-center">
                            <AlertDialog>
                              <AlertDialogTrigger
                                asChild
                                disabled={!!item.deleted_at}
                              >
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  disabled={!!item.deleted_at}
                                  className="text-xs text-rose-400 border-rose-400 hover:bg-rose-400/10 transition-colors"
                                  onClick={() => setBatalPembayaran(item)}
                                >
                                  <TrashIcon />
                                </Button>
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Batalkan Pembayaran?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Pembayaran sebesar{" "}
                                    <strong>
                                      {formatRupiah(item.jumlah_bayar)}
                                    </strong>{" "}
                                    akan dibatalkan dan sisa tagihan invoice
                                    akan bertambah kembali.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                  <AlertDialogCancel>Tutup</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleBatal}>
                                    Ya, Batalkan
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </td>

                          {/* <td className="p-2 border text-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="text-xs text-rose-400 border-rose-400 hover:bg-rose-400/10 transition-colors"
                              onClick={() =>
                                handleBatal(item.id, item.jumlah_bayar)
                              }
                            >
                              <TrashIcon />
                            </Button>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={7}
                          className="p-2 border text-right font-semibold"
                        >
                          Total Dibayar
                        </td>
                        <td className="p-2 border text-right font-semibold">
                          {formatRupiah(totalBayar)}
                        </td>
                      </tr>
                      {invoice?.status !== "PAID" && (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-2 border text-right font-semibold"
                          >
                            Sisa Tagihan
                          </td>
                          <td className="p-2 border text-right font-semibold">
                            {formatRupiah(sisaTagihan)}
                          </td>
                        </tr>
                      )}
                    </tfoot>
                  </table>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </DialogContent>
  );
}
