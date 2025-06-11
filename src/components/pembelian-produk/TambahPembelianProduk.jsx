// "use client";

// import { useState, Fragment } from "react";
// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Listbox, Transition } from "@headlessui/react";
// import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
// import { useQuery } from "@tanstack/react-query";
// import { apiRequest } from "@/app/utils/fetchOptions";

// const TambahPembelianProduk = ({ onSuccess, onError }) => {
//   const [nomorPembelian, setNomorPembelian] = useState("");
//   const [nomorFaktur, setNomorFaktur] = useState("");
//   const [tanggalPembelian, setTanggalPembelian] = useState("");
//   const [statusPembelian, setStatusPembelian] = useState("");
//   const [totalHarga, setTotalHarga] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [selectedProduk, setSelectedProduk] = useState(null);
//   const [supplierId, setSupplierId] = useState("");
//   const [supplierOpen, setSupplierOpen] = useState(false);
//   const [produkOpen, setProdukOpen] = useState(false);
//   const [produkId, setProdukId] = useState("");

//   const { data: supplierData, isLoading: supplierLoading } = useQuery({
//     queryKey: ["supplier"],
//     queryFn: () => apiRequest("GET", "/api/v1/supplier"),
//     enabled: supplierOpen,
//   });
//   const { data: produkData, isLoading: produkLoading } = useQuery({
//     queryKey: ["produk"],
//     queryFn: () => apiRequest("GET", "/api/v1/produk"),
//     enabled: produkOpen,
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const totalHargaFloat = parseFloat(totalHarga) || 0;

//     const formattedTanggal =
//       tanggalPembelian && /^\d{2}\/\d{2}\/\d{4}$/.test(tanggalPembelian)
//         ? new Date(
//             tanggalPembelian.split("/").reverse().join("-")
//           ).toISOString()
//         : null;

//     try {
//       await apiRequest("POST", "/api/v1/pembelian-produk", {
//         supplier_id: supplierId,
//         produk_id: produkId,
//         nomor_pembelian: nomorPembelian,
//         nomor_faktur: nomorFaktur,
//         tanggal_pembelian: formattedTanggal,
//         status_pembelian: statusPembelian,
//         total_harga: totalHargaFloat,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       });

//       onSuccess();
//     } catch (error) {
//       onError(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <DialogContent className="sm:max-w-4xl">
//       <DialogHeader>
//         <DialogTitle>Tambah Pembelian Produk</DialogTitle>
//         <DialogDescription>
//           Tambahkan Pembelian Produk ke Dalam Daftar.
//         </DialogDescription>
//       </DialogHeader>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="supplier" className="text-center">
//               Supplier <i className="text-red-500">*</i>
//             </Label>
//             <div className="col-span-3">
//               <Listbox
//                 value={selectedSupplier}
//                 onChange={(supplier) => {
//                   setSelectedSupplier(supplier);
//                   setSupplierId(supplier?.id || "");
//                 }}
//               >
//                 <div className="relative mt-1">
//                   <Listbox.Button
//                     className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
//                     onClick={() => setSupplierOpen(true)}
//                   >
//                     <span className="block truncate">
//                       {selectedSupplier?.nama_supplier || "Pilih Supplier"}
//                     </span>
//                     <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//                       <ChevronUpDownIcon
//                         className="h-5 w-5 text-muted-foreground"
//                         aria-hidden="true"
//                       />
//                     </span>
//                   </Listbox.Button>
//                   <Transition
//                     as={Fragment}
//                     leave="transition ease-in duration-100"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                     afterLeave={() => setSupplierOpen(false)}
//                   >
//                     <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
//                       {supplierLoading ? (
//                         <div className="py-2 px-4 text-muted-foreground italic">
//                           Loading...
//                         </div>
//                       ) : supplierData && supplierData.length > 0 ? (
//                         supplierData.map((supplier) => (
//                           <Listbox.Option
//                             key={supplier.id}
//                             className={({ active }) =>
//                               `relative cursor-default select-none py-2 pl-10 pr-4 ${
//                                 active
//                                   ? "bg-accent text-accent-foreground"
//                                   : "text-popover-foreground"
//                               }`
//                             }
//                             value={supplier}
//                           >
//                             {({ selected }) => (
//                               <>
//                                 <span
//                                   className={`block truncate ${
//                                     selected ? "font-medium" : "font-normal"
//                                   }`}
//                                 >
//                                   {supplier.nama_supplier}
//                                 </span>
//                                 {selected ? (
//                                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
//                                     <CheckIcon
//                                       className="h-5 w-5"
//                                       aria-hidden="true"
//                                     />
//                                   </span>
//                                 ) : null}
//                               </>
//                             )}
//                           </Listbox.Option>
//                         ))
//                       ) : (
//                         <div className="py-2 px-4 text-muted-foreground italic">
//                           Tidak ada data
//                         </div>
//                       )}
//                     </Listbox.Options>
//                   </Transition>
//                 </div>
//               </Listbox>
//             </div>
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="produk" className="text-center">
//               Produk <i className="text-red-500">*</i>
//             </Label>
//             <div className="col-span-3">
//               <Listbox
//                 value={selectedProduk}
//                 onChange={(produk) => {
//                   setSelectedProduk(produk);
//                   setProdukId(produk?.id || "");
//                 }}
//               >
//                 <div className="relative mt-1">
//                   <Listbox.Button
//                     className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
//                     onClick={() => setProdukOpen(true)}
//                   >
//                     <span className="block truncate">
//                       {selectedProduk?.nama_produk || "Pilih Produk"}
//                     </span>
//                     <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//                       <ChevronUpDownIcon
//                         className="h-5 w-5 text-muted-foreground"
//                         aria-hidden="true"
//                       />
//                     </span>
//                   </Listbox.Button>
//                   <Transition
//                     as={Fragment}
//                     leave="transition ease-in duration-100"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                     afterLeave={() => setProdukOpen(false)}
//                   >
//                     <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
//                       {produkLoading ? (
//                         <div className="py-2 px-4 text-muted-foreground italic">
//                           Loading...
//                         </div>
//                       ) : produkData && produkData.length > 0 ? (
//                         produkData.map((produk) => (
//                           <Listbox.Option
//                             key={produk.id}
//                             className={({ active }) =>
//                               `relative cursor-default select-none py-2 pl-10 pr-4 ${
//                                 active
//                                   ? "bg-accent text-accent-foreground"
//                                   : "text-popover-foreground"
//                               }`
//                             }
//                             value={produk}
//                           >
//                             {({ selected }) => (
//                               <>
//                                 <span
//                                   className={`block truncate ${
//                                     selected ? "font-medium" : "font-normal"
//                                   }`}
//                                 >
//                                   {produk.nama_produk}
//                                 </span>
//                                 {selected ? (
//                                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
//                                     <CheckIcon
//                                       className="h-5 w-5"
//                                       aria-hidden="true"
//                                     />
//                                   </span>
//                                 ) : null}
//                               </>
//                             )}
//                           </Listbox.Option>
//                         ))
//                       ) : (
//                         <div className="py-2 px-4 text-muted-foreground italic">
//                           Tidak ada data
//                         </div>
//                       )}
//                     </Listbox.Options>
//                   </Transition>
//                 </div>
//               </Listbox>
//             </div>
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="total-harga" className="text-center">
//               Total harga <i className="text-red-500">*</i>
//             </Label>
//             <Input
//               id="total-harga"
//               value={totalHarga}
//               onChange={(e) => setTotalHarga(e.target.value)}
//               className="col-span-3"
//               placeholder="Masukkan total harga"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="nomor-pembelian" className="text-center">
//               Nomor Pembelian <i className="text-red-500">*</i>
//             </Label>
//             <Input
//               id="nomor-pembelian"
//               value={nomorPembelian}
//               onChange={(e) => setNomorPembelian(e.target.value)}
//               className="col-span-3"
//               placeholder="Masukkan nomor pembelian"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="nomor-faktur" className="text-center">
//               Nomor Faktur <i className="text-red-500">*</i>
//             </Label>
//             <Input
//               id="nomor-faktur"
//               value={nomorFaktur}
//               onChange={(e) => setNomorFaktur(e.target.value)}
//               className="col-span-3"
//               placeholder="Masukkan nomor faktur"
//             />
//           </div>
//           {/* Tanggal Pembelian */}
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="tanggal-pembelian" className="text-center">
//               Tanggal Pembelian <i className="text-red-500">*</i>
//             </Label>
//             <Input
//               id="tanggal-pembelian"
//               value={tanggalPembelian}
//               onChange={(e) => {
//                 let value = e.target.value.replace(/\D/g, ""); // Hapus semua non-digit
//                 if (value.length > 8) value = value.slice(0, 8);

//                 // Format otomatis jadi dd/mm/yyyy
//                 let formatted = value;
//                 if (value.length > 4) {
//                   formatted = `${value.slice(0, 2)}/${value.slice(
//                     2,
//                     4
//                   )}/${value.slice(4)}`;
//                 } else if (value.length > 2) {
//                   formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
//                 }

//                 setTanggalPembelian(formatted);
//               }}
//               className="col-span-3"
//               placeholder="dd/mm/yyyy"
//               inputMode="numeric"
//               pattern="\d{2}/\d{2}/\d{4}"
//               maxLength={10}
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="status-pembelian" className="text-center">
//               Status Pembelian <i className="text-red-500">*</i>
//             </Label>
//             <Input
//               id="status-pembelian"
//               value={statusPembelian}
//               onChange={(e) => setStatusPembelian(e.target.value)}
//               className="col-span-3"
//               placeholder="Masukkan status pembelian"
//             />
//           </div>
//         </div>
//         <div className="flex justify-end">
//           <Button onClick={handleSubmit} variant="outline" disabled={loading}>
//             {loading ? "Loading..." : "Simpan"}
//           </Button>
//         </div>
//       </form>
//     </DialogContent>
//   );
// };

// export default TambahPembelianProduk;

// import { useState, Fragment } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Listbox, Transition } from "@headlessui/react";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { apiRequest } from "@/lib/apiRequest";
// import toast from "react-hot-toast";
"use client";

import { useState, Fragment } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/app/utils/fetchOptions";

export default function FormPembelianProduk() {
  const [produkList, setProdukList] = useState([
    { produk: null, qty: 1, harga: 0 },
  ]);
  const [supplier, setSupplier] = useState(null);
  const [statusPembelian, setStatusPembelian] = useState("selesai");
  const [nomorPembelian, setNomorPembelian] = useState("");
  const [nomorFaktur, setNomorFaktur] = useState("");
  const [tanggalPembelian, setTanggalPembelian] = useState("");

  const { data: supplierData } = useQuery({
    queryKey: ["supplier"],
    queryFn: () => apiRequest("GET", "/api/v1/supplier"),
  });

  const { data: produkData } = useQuery({
    queryKey: ["produk"],
    queryFn: () => apiRequest("GET", "/api/v1/produk"),
  });

  const tambahBarisProduk = () => {
    setProdukList([...produkList, { produk: null, qty: 1, harga: 0 }]);
  };

  const hapusBarisProduk = (index) => {
    setProdukList(produkList.filter((_, i) => i !== index));
  };

  const totalHarga = produkList.reduce(
    (sum, item) => sum + (item.qty * item.harga || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supplier || !tanggalPembelian || produkList.some((p) => !p.produk)) {
      toast.error("Pastikan semua isian telah diisi.");
      return;
    }

    try {
      await apiRequest("POST", "/api/v1/pembelian-produk", {
        supplier_id: supplier.id,
        nomor_pembelian: nomorPembelian,
        nomor_faktur: nomorFaktur,
        tanggal_pembelian: tanggalPembelian,
        status_pembelian: statusPembelian,
        total_harga: totalHarga,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        detail: produkList.map((item) => ({
          produk_id: item.produk?.id,
          qty: item.qty,
          harga: item.harga,
        })),
      });

      toast.success("Pembelian berhasil disimpan");
      // Reset form jika perlu
    } catch (error) {
      toast.error("Gagal menyimpan pembelian");
    }
  };

  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>Tambah Pembelian Produk</DialogTitle>
        <DialogDescription>
          Tambahkan Pembelian Produk ke Dalam Daftar.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Supplier */}
        <div>
          <Label>Supplier</Label>
          <Listbox value={supplier} onChange={setSupplier}>
            <div className="relative">
              <Listbox.Button className="w-full h-10 border rounded-md px-3 text-left">
                {supplier?.nama_supplier || "Pilih Supplier"}
              </Listbox.Button>
              <Transition as={Fragment}>
                <Listbox.Options className="absolute z-10 bg-white max-h-60 overflow-auto mt-1 w-full border rounded-md shadow-lg">
                  {supplierData?.map((s) => (
                    <Listbox.Option
                      key={s.id}
                      value={s}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {s.nama_supplier}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Nomor Pembelian */}
        <div>
          <Label>Nomor Pembelian</Label>
          <Input
            type="text"
            value={nomorPembelian}
            onChange={(e) => setNomorPembelian(e.target.value)}
          />
        </div>

        {/* Nomor Faktur */}
        <div>
          <Label>Nomor Faktur</Label>
          <Input
            type="text"
            value={nomorFaktur}
            onChange={(e) => setNomorFaktur(e.target.value)}
          />
        </div>

        {/* Tanggal Pembelian */}
        <div>
          <Label>Tanggal Pembelian</Label>
          <Input
            type="date"
            value={tanggalPembelian}
            onChange={(e) => setTanggalPembelian(e.target.value)}
          />
        </div>

        {/* Status Pembelian */}
        <div>
          <Label>Status Pembelian</Label>
          <select
            value={statusPembelian}
            onChange={(e) => setStatusPembelian(e.target.value)}
            className="w-full h-10 border rounded-md px-3"
          >
            <option value="selesai">Selesai</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Produk */}
        <div className="space-y-2 overflow-y-auto max-h-[180px] pr-2">
          <Label>Daftar Produk</Label>
          {produkList.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              {/* Produk */}
              <div className="col-span-4">
                <Listbox
                  value={item.produk}
                  onChange={(produk) => {
                    const newList = [...produkList];
                    newList[index].produk = produk;
                    newList[index].harga = produk.Harga?.[0]?.harga_jual || 0;
                    setProdukList(newList);
                  }}
                >
                  <div className="relative">
                    <Listbox.Button className="w-full h-10 border rounded-md px-3 text-left">
                      {item.produk?.nama_produk || "Pilih Produk"}
                    </Listbox.Button>
                    <Transition as={Fragment}>
                      <Listbox.Options className="absolute z-10 bg-white max-h-60 overflow-auto mt-1 w-full border rounded-md shadow-lg">
                        {produkData?.map((produk) => (
                          <Listbox.Option
                            key={produk.id}
                            value={produk}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {produk.nama_produk}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Qty */}
              <Input
                type="number"
                min={1}
                className="col-span-2"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1) {
                    const newList = [...produkList];
                    newList[index].qty = value;
                    setProdukList(newList);
                  }
                }}
              />

              {/* Harga */}
              <Input
                type="number"
                className="col-span-3"
                placeholder="Harga"
                value={item.harga}
                onChange={(e) => {
                  const newList = [...produkList];
                  newList[index].harga = parseFloat(e.target.value);
                  setProdukList(newList);
                }}
                disabled
              />

              {/* Subtotal */}
              <div className="col-span-2">
                Rp {(item.qty * item.harga || 0).toLocaleString()}
              </div>

              {/* Hapus */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => hapusBarisProduk(index)}
                className="col-span-1"
              >
                ✕
              </Button>
            </div>
          ))}

          {/* <Button type="button" onClick={tambahBarisProduk} variant="secondary">
            + Tambah Produk
          </Button> */}
        </div>

        {/* Total */}
        {/* <div className="text-right font-semibold">
          Total: Rp {totalHarga.toLocaleString()}
        </div> */}

        <div className="flex justify-between items-center">
          <Button type="button" onClick={tambahBarisProduk} variant="secondary">
            + Tambah Produk
          </Button>
          <div className="text-right font-semibold">
            Total: Rp {totalHarga.toLocaleString()}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full">
          Simpan Pembelian
        </Button>
      </form>
    </DialogContent>
  );
}
