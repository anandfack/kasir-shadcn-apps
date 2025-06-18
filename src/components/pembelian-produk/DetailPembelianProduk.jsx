"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DetailPembelianProduk({ open, onOpenChange, data }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Pembelian</DialogTitle>
          <DialogDescription>
            {data?.nomor_pembelian || "-"} | {data?.tanggal_pembelian}
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm space-y-2">
          <div>
            <strong>Nomor Faktur:</strong> {data?.nomor_faktur}
          </div>
          <div>
            <strong>Supplier:</strong> {data?.supplier?.nama_supplier || "-"}
          </div>
          <div>
            <strong>Total Harga:</strong>{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(data?.total_harga || 0)}
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
                    <tr key={index}>
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">
                        {item.produk?.nama_produk || "-"}
                      </td>
                      <td className="p-2 border">{item.jumlah_produk}</td>
                      <td className="p-2 border">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.harga_satuan)}
                      </td>
                      <td className="p-2 border">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.total_harga)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
