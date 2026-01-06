// "use client";

// import { useEffect, useState } from "react";
// import {
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "../ui/textarea";
// import { Button } from "../ui/button";
// import { apiRequest } from "@/lib/apiRequest";

// const formatRupiah = (value) =>
//   new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//   }).format(value);

// export default function DetailPembelianProduk({
//   open,
//   onOpenChange,
//   pembelianId,
//   onClose,
//   onError,
//   onSuccess,
// }) {
//   const [detailPembelian, setDetailPembelian] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (open && pembelianId) {
//       (async () => {
//         const res = await fetch(
//           `/api/v1/admin/pembelian-produk/${pembelianId}`
//         );
//         const data = await res.json();

//         const dataWithExtra = {
//           ...data,
//           DetailPembelian: (data.DetailPembelian || []).map((item) => ({
//             ...item,
//             qtyRetur: 0,
//             alasan: "",
//           })),
//         };
//         setDetailPembelian(dataWithExtra);
//       })();
//     }
//   }, [open, pembelianId]);

//   const totalAwal =
//     detailPembelian?.DetailPembelian?.reduce(
//       (acc, item) => acc + (item.total_harga || 0),
//       0
//     ) || 0;

//   const totalRetur =
//     detailPembelian?.DetailPembelian?.reduce(
//       (acc, item) => acc + (item.qtyRetur || 0) * (item.harga_satuan || 0),
//       0
//     ) || 0;

//   const totalSetelahRetur = totalAwal - totalRetur;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const details = detailPembelian.DetailPembelian.filter(
//         (item) => item.qtyRetur > 0
//       ).map((item) => {
//         const hargaProduk = item.jumlah_produk * item.harga_satuan;
//         const totalHarga = item.qtyRetur * item.harga_satuan;

//         return {
//           produk_id: item.produk.id,
//           jumlah_produk: item.qtyRetur,
//           harga_satuan: item.harga_satuan,
//           harga_produk: hargaProduk,
//           total_harga: totalHarga,
//           keterangan: item.alasan || "",
//         };
//       });

//       const totalHargaRetur = details.reduce(
//         (sum, item) => sum + item.total_harga,
//         0
//       );

//       const body = {
//         pembelian_id: pembelianId,
//         produk_id: details[0]?.produk_id || null,
//         details_retur: details,
//       };

//       console.log("Payload dikirim:", body);

//       await apiRequest("POST", `/api/v1/admin/retur-produk`, body);

//       onSuccess?.();
//       onClose();
//     } catch (error) {
//       console.error("Error retur:", error);
//       onError?.();
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DialogContent className="h-[450px] max-w-5xl overflow-auto">
//       <div className="text-sm space-y-2">
//         <DialogHeader>
//           <DialogTitle>Detail Pembelian</DialogTitle>
//           <DialogDescription>
//             {detailPembelian?.nomor_pembelian || "-"} |{" "}
//             {detailPembelian?.tanggal_pembelian}
//           </DialogDescription>
//         </DialogHeader>

//         <div>
//           <strong>Nomor Faktur:</strong> {detailPembelian?.nomor_faktur}
//         </div>
//         <div>
//           <strong>Supplier:</strong>{" "}
//           {detailPembelian?.supplier?.nama_supplier || "-"}
//         </div>
//         <div>
//           <strong>Total Harga Pembelian:</strong>{" "}
//           {formatRupiah(detailPembelian?.total_harga || 0)}
//         </div>
//         <div>
//           <strong>Status:</strong> {detailPembelian?.status_pembelian}
//         </div>

//         <div className="mt-4">
//           <h3 className="font-semibold mb-2">Detail Produk</h3>
//           <div className="overflow-x-auto rounded border max-h-[300px] overflow-y-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr>
//                   <th className="p-2 border">#</th>
//                   <th className="p-2 border">Nama Produk</th>
//                   <th className="p-2 border">Qty</th>
//                   <th className="p-2 border">Harga</th>
//                   <th className="p-2 border">Subtotal</th>
//                   <th className="p-2 border">Qty Retur</th>
//                   <th className="p-2 border">Nominal Retur</th>
//                   <th className="p-2 border">Alasan</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {detailPembelian?.DetailPembelian?.map((item, idx) => {
//                   const nominalRetur =
//                     (item.qtyRetur || 0) * (item.harga_satuan || 0);
//                   return (
//                     <tr key={idx}>
//                       <td className="p-2 border text-center">{idx + 1}</td>
//                       <td className="p-2 border text-center">
//                         {item.produk?.nama_produk}
//                       </td>
//                       <td className="p-2 border text-center">
//                         {item.jumlah_produk}
//                       </td>
//                       <td className="p-2 border text-center">
//                         {formatRupiah(item.harga_satuan)}
//                       </td>
//                       <td className="p-2 border text-center">
//                         {formatRupiah(item.total_harga)}
//                       </td>
//                       <td className="p-2 border text-center">
//                         <Input
//                           type="number"
//                           min="0"
//                           max={item.jumlah_produk}
//                           value={item.qtyRetur === 0 ? "" : item.qtyRetur}
//                           placeholder="Qty retur"
//                           className="w-20"
//                           onChange={(e) => {
//                             let value = parseInt(e.target.value) || 0;

//                             if (value > item.jumlah_produk)
//                               value = item.jumlah_produk;
//                             if (value < 0) value = 0;

//                             setDetailPembelian((prev) => {
//                               const newData = { ...prev };
//                               newData.DetailPembelian[idx].qtyRetur = value;
//                               return newData;
//                             });
//                           }}
//                         />
//                       </td>
//                       <td className="p-2 border text-center">
//                         {formatRupiah(nominalRetur)}
//                       </td>
//                       <td className="p-2 border">
//                         <Textarea
//                           placeholder="Alasan"
//                           value={item.alasan}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setDetailPembelian((prev) => {
//                               const newData = { ...prev };
//                               newData.DetailPembelian[idx].alasan = value;
//                               return newData;
//                             });
//                           }}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-4 text-sm space-y-1">
//             <div>
//               <strong>Total Awal:</strong> {formatRupiah(totalAwal)}
//             </div>
//             <div>
//               <strong>Total Retur:</strong> - {formatRupiah(totalRetur)}
//             </div>
//             <div className="font-semibold">
//               <strong>Total Setelah Retur:</strong>{" "}
//               {formatRupiah(totalSetelahRetur)}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end gap-2 mt-4">
//         <Button variant="secondary" onClick={onClose}>
//           Batal
//         </Button>
//         <Button onClick={handleSubmit}>Simpan</Button>
//       </div>
//     </DialogContent>
//   );
// }

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

// helper format rupiah
const formatRupiah = (value = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

export default function DetailPembelianProduk({
  open,
  pembelianId,
  onClose,
  onError,
  onSuccess,
}) {
  const [detailPembelian, setDetailPembelian] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !pembelianId) return;

    const fetchDetail = async () => {
      try {
        const result = await apiRequest(
          "GET",
          `/api/v1/admin/pembelian-produk/${pembelianId}`
        );

        // Jika data kosong
        if (!result?.data || result.data.length === 0) {
          setDetailPembelian({
            nomor_pembelian: "-",
            tanggal_pembelian: "-",
            nomor_faktur: "-",
            supplier: null,
            status_pembelian: "-",
            total_harga: 0,
            DetailPembelian: [],
          });
          return;
        }

        const pembelian = result.data;

        setDetailPembelian({
          ...pembelian,
          DetailPembelian: (pembelian.DetailPembelian || []).map((item) => ({
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

  if (!detailPembelian) return null;

  const totalAwal = detailPembelian.DetailPembelian.reduce(
    (acc, item) => acc + (item.total_harga || 0),
    0
  );

  const totalRetur = detailPembelian.DetailPembelian.reduce(
    (acc, item) => acc + (item.qtyRetur || 0) * (item.harga_satuan || 0),
    0
  );

  const totalSetelahRetur = totalAwal - totalRetur;

  /**
   * Submit retur produk
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const details = detailPembelian.DetailPembelian.filter(
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
          <DialogTitle>Detail Pembelian</DialogTitle>
          <DialogDescription>
            {detailPembelian.nomor_pembelian} |{" "}
            {detailPembelian.tanggal_pembelian}
          </DialogDescription>
        </DialogHeader>

        <div>
          <strong>Nomor Faktur:</strong> {detailPembelian.nomor_faktur}
        </div>
        <div>
          <strong>Supplier:</strong>{" "}
          {detailPembelian.supplier?.nama_supplier || "-"}
        </div>
        <div>
          <strong>Total Harga Pembelian:</strong>{" "}
          {formatRupiah(detailPembelian.total_harga)}
        </div>
        <div>
          <strong>Status:</strong> {detailPembelian.status_pembelian}
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Detail Produk</h3>

          {detailPembelian.DetailPembelian.length === 0 ? (
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
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Harga</th>
                    <th className="p-2 border">Subtotal</th>
                    <th className="p-2 border">Qty Retur</th>
                    <th className="p-2 border">Nominal Retur</th>
                    <th className="p-2 border">Alasan</th>
                  </tr>
                </thead>
                <tbody>
                  {detailPembelian.DetailPembelian.map((item, idx) => {
                    const nominalRetur = item.qtyRetur * item.harga_satuan;

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
                            min={0}
                            max={item.jumlah_produk}
                            className="w-20"
                            value={item.qtyRetur || ""}
                            onChange={(e) => {
                              let value = parseInt(e.target.value) || 0;
                              value = Math.min(
                                Math.max(value, 0),
                                item.jumlah_produk
                              );

                              setDetailPembelian((prev) => ({
                                ...prev,
                                DetailPembelian: prev.DetailPembelian.map(
                                  (row, i) =>
                                    i === idx
                                      ? { ...row, qtyRetur: value }
                                      : row
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
                            placeholder="Alasan"
                            value={item.alasan}
                            onChange={(e) => {
                              const value = e.target.value;
                              setDetailPembelian((prev) => ({
                                ...prev,
                                DetailPembelian: prev.DetailPembelian.map(
                                  (row, i) =>
                                    i === idx ? { ...row, alasan: value } : row
                                ),
                              }));
                            }}
                          />
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
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </DialogContent>
  );
}
