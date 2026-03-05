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
import { Badge } from "../ui/badge";
import React, { useMemo } from "react";

export default function AdminDetailInvoice({ open, onOpenChange, data }) {
  const rows = data?.data ?? {};

  const renderStatusBadge = (status) => {
    switch (status) {
      case "UNPAID":
        return <Badge variant="secondary">UNPAID</Badge>;
      case "PARTIAL":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
            Partial
          </Badge>
        );
      case "PAID":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
            PAID
          </Badge>
        );
      case "OVERPAID":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
            OVERPAID
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const summary = useMemo(() => {
    if (!rows?.invoicePenerimaans) return {};

    let totalQtyMasuk = 0;
    let totalQtyRetur = 0;
    let totalNominal = 0;
    let totalDibayar = 0;
    let satuan = "";

    rows.invoicePenerimaans.forEach((ip) => {
      const penerimaan = ip?.penerimaanBarang;

      // ======================
      // DETAIL MASUK
      // ======================
      penerimaan?.details?.forEach((detail) => {
        const qty = detail?.jumlah_produk || 0;
        const harga = detail?.harga_satuan || 0;

        if (!satuan) {
          satuan = detail?.produkVariant?.satuan?.kode_satuan || "";
        }

        totalQtyMasuk += qty;
        totalNominal += detail?.total_harga || qty * harga;
      });

      // ======================
      // RETUR
      // ======================
      penerimaan?.returPenerimaans?.forEach((retur) => {
        retur?.detailReturPenerimaans?.forEach((d) => {
          totalQtyRetur += d?.jumlah_produk || 0;
          totalNominal -= d?.total_harga || 0;
        });
      });
    });

    // ======================
    // PEMBAYARAN (HANYA YANG BELUM DIBATALKAN)
    // ======================
    rows?.pembayaranInvoices
      ?.filter((p) => !p.deleted_at)
      .forEach((p) => {
        totalDibayar += p?.jumlah_bayar || 0;
      });

    const totalTagihan = rows?.total_tagihan || 0;

    const overpay =
      totalDibayar > totalTagihan ? totalDibayar - totalTagihan : 0;

    return {
      totalQtyMasuk,
      totalQtyRetur,
      totalNominal,
      totalDibayar,
      overpay,
      sisaTagihan: rows?.sisa_tagihan || 0,
      satuan,
    };
  }, [rows]);
  const overpay =
    summary.totalDibayar > summary.totalNominal
      ? summary.totalDibayar - summary.totalNominal
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] sm:max-w-7xl overflow-auto">
        <div className="text-sm space-y-2">
          <DialogHeader>
            <DialogTitle>Detail Invoice</DialogTitle>
            <DialogDescription>
              {rows?.nomor_invoice || "-"} |{" "}
              {formatTanggal(rows?.tanggal_invoice)}
            </DialogDescription>
          </DialogHeader>

          <div>
            <strong>Supplier:</strong>{" "}
            {rows?.invoicePenerimaans?.[0]?.penerimaanBarang?.details?.[0]
              ?.produkVariant?.produk?.supplier?.nama_supplier || "-"}
          </div>

          <div>
            <strong>Petugas:</strong> {rows?.pegawai?.nama_pegawai || "-"}
          </div>

          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            {renderStatusBadge(rows?.status)}
          </div>

          {/* ====================== TABLE ====================== */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Detail Produk</h3>
            <div className="overflow-x-auto rounded border">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="p-2 border">Nomor Penerimaan</th>
                    <th className="p-2 border">Nama Produk</th>
                    <th className="p-2 border">SKU</th>
                    <th className="p-2 border">Warna</th>
                    <th className="p-2 border">Ukuran</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {rows?.invoicePenerimaans?.map((ip, indexPenerimaan) => {
                    const penerimaan = ip.penerimaanBarang;

                    const subtotalPenerimaan =
                      penerimaan?.details?.reduce((acc, d) => {
                        const qty = d?.jumlah_produk || 0;
                        const harga = d?.harga_satuan || 0;
                        return acc + (d?.total_harga || qty * harga);
                      }, 0) || 0;

                    const subtotalRetur =
                      penerimaan?.returPenerimaans?.reduce(
                        (accRetur, retur) => {
                          const totalDetail =
                            retur?.detailReturPenerimaans?.reduce(
                              (accDetail, dr) => {
                                return accDetail + (dr?.total_harga || 0);
                              },
                              0,
                            ) || 0;

                          return accRetur + totalDetail;
                        },
                        0,
                      ) || 0;

                    const subtotalBersih = subtotalPenerimaan - subtotalRetur;

                    return (
                      <React.Fragment key={ip.id}>
                        {/* ================= ROW HEADER PENERIMAAN ================= */}
                        <tr>
                          <td
                            colSpan={8}
                            className="p-2 border font-semibold bg-muted/40"
                          >
                            {penerimaan?.nomor_penerimaan}
                          </td>
                        </tr>

                        {/* ================= LOOP PRODUK ================= */}
                        {Object.values(
                          penerimaan?.details?.reduce((acc, item) => {
                            const produkId = item?.produkVariant?.produk?.id;

                            if (!acc[produkId]) {
                              acc[produkId] = {
                                produk: item?.produkVariant?.produk,
                                items: [],
                              };
                            }

                            acc[produkId].items.push(item);
                            return acc;
                          }, {}),
                        ).map((group, groupIndex) =>
                          group.items.map((item, itemIndex) => {
                            const qty = item?.jumlah_produk || 0;
                            const harga = item?.harga_satuan || 0;
                            const subtotal = item?.total_harga || qty * harga;
                            const satuan =
                              item?.produkVariant?.satuan?.kode_satuan || "-";

                            return (
                              <tr key={`${groupIndex}-${itemIndex}`}>
                                <td className="p-2 border"></td>

                                <td className="p-2 border">
                                  {itemIndex === 0
                                    ? group.produk?.nama_produk
                                    : ""}
                                </td>

                                <td className="p-2 border font-mono">
                                  {item?.produkVariant?.sku}
                                </td>

                                <td className="p-2 border">
                                  {item?.produkVariant?.warna}
                                </td>

                                <td className="p-2 border">
                                  {item?.produkVariant?.ukuran}
                                </td>

                                <td className="p-2 border text-right">
                                  {qty} {satuan}
                                </td>

                                <td className="p-2 border text-right">
                                  {formatRupiah(harga)}
                                </td>

                                <td className="p-2 border text-right">
                                  {formatRupiah(subtotal)}
                                </td>
                              </tr>
                            );
                          }),
                        )}

                        {/* ================= RETUR ================= */}
                        {penerimaan?.returPenerimaans?.length > 0 && (
                          <>
                            <tr>
                              <td
                                colSpan={8}
                                className="p-2 border italic text-center"
                              >
                                Retur
                              </td>
                            </tr>

                            {penerimaan.returPenerimaans.map((retur) =>
                              retur.detailReturPenerimaans.map(
                                (detailRetur, rIndex) => (
                                  <tr
                                    key={`retur-${retur.id}-${rIndex}`}
                                    className="text-rose-700 text-xs"
                                  >
                                    <td className="p-2 border"></td>
                                    <td className="p-2 border">
                                      {
                                        detailRetur?.penerimaanBarangDetail
                                          ?.produkVariant?.produk.nama_produk
                                      }
                                    </td>
                                    <td className="p-2 border font-mono">
                                      {
                                        detailRetur?.penerimaanBarangDetail
                                          ?.produkVariant.sku
                                      }
                                    </td>
                                    <td className="p-2 border">
                                      {
                                        detailRetur?.penerimaanBarangDetail
                                          ?.produkVariant.warna
                                      }
                                    </td>
                                    <td className="p-2 border">
                                      {
                                        detailRetur?.penerimaanBarangDetail
                                          ?.produkVariant.ukuran
                                      }
                                    </td>

                                    <td className="p-2 border text-right">
                                      - {detailRetur.jumlah_produk}{" "}
                                      {
                                        detailRetur?.penerimaanBarangDetail
                                          ?.produkVariant.produk?.satuan
                                          .kode_satuan
                                      }
                                    </td>

                                    <td className="p-2 border text-right">
                                      - {formatRupiah(detailRetur.harga_satuan)}
                                    </td>

                                    <td className="p-2 border text-right">
                                      - {formatRupiah(detailRetur.total_harga)}
                                    </td>
                                  </tr>
                                ),
                              ),
                            )}
                          </>
                        )}
                        {/* ================= SUBTOTAL ================= */}
                        <tr className="bg-muted/40 font-bold">
                          <td colSpan={7} className="p-2 border text-right">
                            Subtotal
                          </td>
                          <td className="p-2 border text-right">
                            {formatRupiah(subtotalBersih)}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 rounded-xl border bg-muted/30">
              <h4 className="font-semibold mb-3">Ringkasan Invoice</h4>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm text-center">
                <div>
                  <p className="text-muted-foreground">Total Qty Masuk</p>
                  <p className="font-semibold">{summary.totalQtyMasuk}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Total Qty Retur</p>
                  <p className="font-semibold text-rose-600">
                    {summary.totalQtyRetur}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Total Tagihan</p>
                  <p className="font-semibold">
                    {formatRupiah(rows?.total_tagihan || 0)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Total Dibayar</p>
                  <p className="font-semibold text-emerald-600">
                    {formatRupiah(summary.totalDibayar)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Sisa Tagihan</p>
                  <p className="font-semibold text-amber-600">
                    {formatRupiah(rows?.sisa_tagihan || 0)}
                  </p>
                </div>
                {overpay > 0 && (
                  <div>
                    <p className="text-muted-foreground">Kelebihan Bayar</p>
                    <p className="font-semibold text-blue-600">
                      {formatRupiah(overpay || 0)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
