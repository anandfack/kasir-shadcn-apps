"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DetailPembelianProduk({ open, onOpenChange, data }) {
  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  // Buat index retur berdasarkan produk_id
  const returMap = {};
  data?.ReturPembelian?.forEach((retur) => {
    retur.DetailReturPembelian?.forEach((detail) => {
      const idProduk = detail.produk?.id;
      if (!returMap[idProduk]) returMap[idProduk] = [];
      // tambahkan nomor_retur ke detail
      returMap[idProduk].push({ ...detail, nomor_retur: retur.nomor_retur });
    });
  });

  const totalAwal = data?.total_harga || 0;
  const totalRetur = data?.ReturPembelian?.reduce((acc, retur) => {
    return acc + (retur.total_harga || 0);
  }, 0);
  const totalSetelahRetur = totalAwal - totalRetur;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[450px] max-w-5xl overflow-auto">
        <div className="text-sm space-y-2">
          <DialogHeader>
            <DialogTitle>Detail Pembelian</DialogTitle>
            <DialogDescription>
              {data?.nomor_pembelian || "-"} | {data?.tanggal_pembelian}
            </DialogDescription>
          </DialogHeader>
          <div>
            <strong>Nomor Faktur:</strong> {data?.nomor_faktur}
          </div>
          <div>
            <strong>Supplier:</strong> {data?.supplier?.nama_supplier || "-"}
          </div>
          <div>
            <strong>Total Harga Pembelian:</strong>{" "}
            {formatRupiah(data?.total_harga || 0)}
          </div>
          <div>
            <strong>Status:</strong> {data?.status_pembelian}
          </div>

          {/* Tabel Produk */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Detail Produk</h3>
            <div className="overflow-x-auto rounded border">
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Nama Produk</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.DetailPembelian?.map((item, index) => (
                    <>
                      <tr key={`produk-${index}`}>
                        <td className="p-2 border align-top">{index + 1}</td>
                        <td className="p-2 border">
                          {item.produk?.nama_produk || "-"}
                        </td>
                        <td className="p-2 border">{item.jumlah_produk}</td>
                        <td className="p-2 border">
                          {formatRupiah(item.harga_satuan)}
                        </td>
                        <td className="p-2 border">
                          {formatRupiah(item.total_harga)}
                        </td>
                      </tr>

                      {/* Jika ada retur untuk produk ini, tampilkan di bawahnya */}
                      {returMap[item.produk?.id]?.map((retur, rIndex) => (
                        <tr
                          key={`retur-${item.produk?.id}-${rIndex}`}
                          className="text-red-600"
                        >
                          <td className="p-2 border"></td>
                          <td className="p-2 border">
                            ↳ Retur {item.produk?.nama_produk} -{" "}
                            {retur.nomor_retur}
                          </td>
                          <td className="p-2 border">{retur.jumlah_produk}</td>
                          <td className="p-2 border">
                            {formatRupiah(retur.harga_satuan)}
                          </td>
                          <td className="p-2 border">
                            {formatRupiah(retur.total_harga)}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            {data?.ReturPembelian?.length > 0 && (
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
