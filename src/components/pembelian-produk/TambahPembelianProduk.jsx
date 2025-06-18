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
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/app/utils/fetchOptions";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";

export default function FormPembelianProduk({ open, onSuccess, onError }) {
  const [produkList, setProdukList] = useState([
    { produk: null, qty: 1, harga: 0 },
  ]);
  const [statusPembelian, setStatusPembelian] = useState("selesai");
  const [nomorPembelian, setNomorPembelian] = useState("");
  const [nomorFaktur, setNomorFaktur] = useState("");
  const [tanggalPembelian, setTanggalPembelian] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [produkOpen, setProdukOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    if (open) {
      setProdukList([{ produk: null, qty: 1, harga: 0 }]);
      setSupplier(null);
      setStatusPembelian("selesai");
      setNomorPembelian("");
      setNomorFaktur("");
      setTanggalPembelian("");
    }
  }, [open]);

  const { data: supplierData, isLoading: supplierLoading } = useQuery({
    queryKey: ["supplier"],
    queryFn: () => apiRequest("GET", "/api/v1/supplier"),
    enabled: supplierOpen,
    staleTime: 1000 * 60 * 5,
  });

  const { data: produkData, isLoading: produkLoading } = useQuery({
    queryKey: ["produk"],
    queryFn: () => apiRequest("GET", "/api/v1/produk"),
    enabled: produkOpen,
    staleTime: 1000 * 60 * 5,
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

    try {
      await apiRequest("POST", "/api/v1/pembelian-produk", {
        supplier_id: selectedSupplier?.id,
        nomor_pembelian: nomorPembelian,
        nomor_faktur: nomorFaktur,
        tanggal_pembelian: tanggalPembelian,
        total_harga: totalHarga,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        detail_items: produkList.map((item) => ({
          produk_id: item.produk?.id,
          jumlah_produk: item.qty,
          harga_satuan: item.harga,
          harga_produk: item.harga,
          total_harga: item.qty * item.harga,
          pegawai_id: null,
          satuan_produk_id: null,
          tanggal_kadaluarsa: null,
        })),
      });
      onSuccess();
    } catch (error) {
      onError();
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
        {/* Supplier Produk */}
        <div>
          <Label htmlFor="supplier-produk" className="text-center">
            Supplier Produk <i className="text-red-500">*</i>
          </Label>
          <div className="col-span-3">
            <Listbox
              value={selectedSupplier}
              onChange={(supplier) => {
                setSelectedSupplier(supplier);
                setSupplier(supplier?.id || "");
              }}
            >
              <div className="relative mt-1">
                <Listbox.Button
                  className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                  onClick={() => setSupplierOpen(true)}
                >
                  <span className="block truncate">
                    {selectedSupplier?.nama_supplier || "Pilih Supplier Produk"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setSupplierOpen(false)}
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                    {supplierLoading ? (
                      <div className="py-2 px-4 text-muted-foreground italic">
                        Loading...
                      </div>
                    ) : supplierData && supplierData.length > 0 ? (
                      supplierData.map((supplier) => (
                        <Listbox.Option
                          key={supplier.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-accent text-accent-foreground"
                                : "text-popover-foreground"
                            }`
                          }
                          value={supplier}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {supplier.nama_supplier}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))
                    ) : (
                      <div className="py-2 px-4 text-muted-foreground italic">
                        Tidak ada data
                      </div>
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
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

        <div>
          <Label htmlFor="statusPembelian">Status Pembelian</Label>
          <select
            id="statusPembelian"
            value={statusPembelian}
            onChange={(e) => setStatusPembelian(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="selesai">Selesai</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Produk */}
        <div className="space-y-2 overflow-y-auto h-[180px] max-h-[180px] pr-2">
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
                  <div className="relative mt-1">
                    <Listbox.Button
                      className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                      onClick={() => setProdukOpen(true)}
                    >
                      <span className="block truncate">
                        {item.produk?.nama_produk || "Pilih Produk"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      afterLeave={() => setProdukOpen(false)}
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                        {produkLoading ? (
                          <div className="py-2 px-4 text-muted-foreground italic">
                            Loading...
                          </div>
                        ) : produkData && produkData.length > 0 ? (
                          produkData.map((produk) => (
                            <Listbox.Option
                              key={produk.id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-accent text-accent-foreground"
                                    : "text-popover-foreground"
                                }`
                              }
                              value={produk}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {produk.nama_produk}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))
                        ) : (
                          <div className="py-2 px-4 text-muted-foreground italic">
                            Tidak ada data
                          </div>
                        )}
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
        </div>

        {/* Total */}
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
