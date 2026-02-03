"use client";

import { useState, useMemo, Fragment } from "react";
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
import { apiRequest } from "@/lib/apiRequest";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formatRupiah } from "@/lib/formatRupiah";
import { set } from "date-fns";

export default function AdminTambahPurchaseOrderForm({
  open,
  onSuccess,
  onError,
}) {
  const [produkVariantList, setProdukVariantList] = useState([
    { produkVariant: null, qty: 0, harga: 0 },
  ]);
  const [tanggalPurchaseOrder, setTanggalPurchaseOrder] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [produkVariantOpen, setProdukVariantOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchProdukVariant, setSearchProdukVariant] = useState("");

  const { data: supplierData, isLoading: supplierLoading } = useQuery({
    queryKey: ["supplier"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/supplier"),
    enabled: supplierOpen,
    staleTime: 1000 * 60 * 5,
  });

  const { data: produkVariantData, isLoading: produkVariantLoading } = useQuery(
    {
      queryKey: ["produk-variant"],
      queryFn: () => apiRequest("GET", "/api/v1/admin/produk-variant"),
      staleTime: 1000 * 60 * 5,
    },
  );

  console.log("Produk Variant Data :", produkVariantData);

  // const produkVariantDataList = useMemo(() => {
  //   if (Array.isArray(produkVariantData)) return produkVariantData;
  //   if (Array.isArray(produkVariantData?.data)) return produkVariantData.data;
  //   return [];
  // }, [produkVariantData]);

  const produkVariantDataList = useMemo(() => {
    if (!produkVariantData) return [];

    // langsung array
    if (Array.isArray(produkVariantData)) return produkVariantData;

    // { data: [] }
    if (Array.isArray(produkVariantData.data)) return produkVariantData.data;

    // { data: { data: [] } }
    if (Array.isArray(produkVariantData.data?.data))
      return produkVariantData.data.data;

    return [];
  }, [produkVariantData]);

  const supplierDataList = useMemo(() => {
    if (Array.isArray(supplierData)) return supplierData;
    if (Array.isArray(supplierData?.data)) return supplierData.data;
    return [];
  }, [supplierData]);

  const filteredSupplier = useMemo(() => {
    if (!supplierDataList) return [];
    if (!searchSupplier) return supplierDataList;

    return supplierDataList.filter((item) =>
      item.nama_supplier.toLowerCase().includes(searchSupplier.toLowerCase()),
    );
  }, [supplierDataList, searchSupplier]);

  const filteredProdukVariant = useMemo(() => {
    if (!produkVariantDataList) return [];
    if (!searchProdukVariant) return produkVariantDataList;

    return produkVariantDataList.filter((item) =>
      `${item.sku} ${item.produk?.nama_produk}`
        .toLowerCase()
        .includes(searchProdukVariant.toLowerCase()),
    );
  }, [produkVariantDataList, searchProdukVariant]);

  useEffect(() => {
    if (open) {
      setProdukVariantList([{ produkVariant: null, qty: 1, harga: 0 }]);
      setSupplier(null);
      setSupplierId("");
      setTanggalPurchaseOrder("");
    }
  }, [open]);

  useEffect(() => {
    setSearchProdukVariant("");
  }, [produkVariantList.length]);

  const selectedProdukVariantIds = (produkVariantList, currentIndex) => {
    return produkVariantList
      .filter((_, i) => i !== currentIndex)
      .map((item) => item.produkVariant?.id)
      .filter(Boolean);
  };

  const tambahBarisProduk = () => {
    setProdukVariantList([
      ...produkVariantList,
      { produkVariant: null, qty: 1, harga: 0 },
    ]);
  };

  const hapusBarisProduk = (index) => {
    setProdukVariantList(produkVariantList.filter((_, i) => i !== index));
  };

  const totalHarga = produkVariantList.reduce(
    (sum, item) => sum + (item.qty * item.harga || 0),
    0,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiRequest("POST", "/api/v1/admin/pembelian-produk", {
        supplier_id: supplierId,
        nomor_pembelian: nomorPembelian,
        nomor_faktur: nomorFaktur,
        tanggal_pembelian: tanggalPembelian,
        total_harga: totalHarga,
        detail_items: produkVariantList.map((item) => ({
          produk_variant_id: item.produkVariant?.id,
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
    <DialogContent className="sm:max-w-4xl h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Tambah Purchase Order</DialogTitle>
        <DialogDescription>
          Tambahkan Purchase Order ke Dalam Daftar.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-4">
        {/* Supplier Produk */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="supplier-produk" className="text-center">
            Supplier Produk <i className="text-red-500">*</i>
          </Label>
          <div className="col-span-3">
            <Listbox
              value={selectedSupplier}
              onChange={(supplier) => {
                setSelectedSupplier(supplier);
                setSupplierId(supplier?.id || "");
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
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover pt-0 pb-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                    {/* 🔍 SEARCH */}
                    <div className="sticky top-0 z-20 bg-popover p-2 border-b">
                      <Input
                        placeholder="Cari supplier..."
                        value={searchSupplier}
                        onChange={(e) => setSearchSupplier(e.target.value)}
                        onKeyDownCapture={(e) => {
                          if (e.key === " ") e.stopPropagation();
                        }}
                        className="h-8 text-sm"
                      />
                    </div>
                    {supplierLoading ? (
                      <div className="py-2 px-4 text-muted-foreground italic">
                        Loading...
                      </div>
                    ) : filteredSupplier.length > 0 ? (
                      filteredSupplier.map((supplier) => (
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

        {/* Tanggal Purchase Order */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tanggal-purchase-order" className="text-center">
            Tanggal Purchase Order <i className="text-red-500">*</i>
          </Label>
          <Input
            type="date"
            value={tanggalPurchaseOrder}
            onChange={(e) => setTanggalPurchaseOrder(e.target.value)}
            className="col-span-3"
          />
        </div>

        <div className="flex flex-col gap-4 py-4 flex-1 overflow-y-auto">
          <Label htmlFor="daftar-produk" className="text-left">
            Daftar Produk Variant<i className="text-red-500">*</i>
          </Label>
          {produkVariantList.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Listbox
                  value={item.produkVariant}
                  onChange={(produk) => {
                    const newList = [...produkVariantList];
                    newList[index].produkVariant = produk;
                    newList[index].harga = produk.Harga?.[0]?.harga_jual || 0;
                    setProdukVariantList(newList);
                  }}
                >
                  <div className="relative mt-1">
                    <Listbox.Button
                      className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                      onClick={() => setProdukVariantOpen(true)}
                    >
                      <span className="block truncate">
                        {item.produkVariant?.sku || "Pilih Produk"}
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
                      afterLeave={() => setProdukVariantOpen(false)}
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover pt-0 pb-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                        <div className="sticky top-0 z-20 bg-popover p-2 border-b">
                          <Input
                            placeholder="Cari produk..."
                            value={searchProdukVariant}
                            onChange={(e) =>
                              setSearchProdukVariant(e.target.value)
                            }
                            onKeyDownCapture={(e) => {
                              if (e.key === " ") e.stopPropagation();
                            }}
                            className="h-8 text-sm"
                          />
                        </div>
                        {produkVariantLoading ? (
                          <div className="py-2 px-4 text-muted-foreground italic">
                            Loading...
                          </div>
                        ) : filteredProdukVariant &&
                          filteredProdukVariant.length > 0 ? (
                          filteredProdukVariant
                            .filter((produk) => {
                              const selectedProdukVariantIds = produkVariantList
                                .filter((_, i) => i !== index)
                                .map((item) => item.produkVariant?.id)
                                .filter(Boolean);

                              return !selectedProdukVariantIds.includes(
                                produk.id,
                              );
                            })
                            .map((produk) => (
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
                                      {produk.sku} — {produk.produk?.nama_produk}
                                    </span>
                                    {selected && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                        <CheckIcon className="h-5 w-5" />
                                      </span>
                                    )}
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

              <Input
                type="number"
                min={1}
                className="col-span-2"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1) {
                    const newList = [...produkVariantList];
                    newList[index].qty = value;
                    setProdukVariantList(newList);
                  }
                }}
              />

              <Input
                type="text"
                className="col-span-3"
                placeholder="Harga"
                value={formatRupiah(item.harga)}
                onChange={(e) => {
                  const newList = [...produkVariantList];
                  newList[index].harga = parseFloat(e.target.value);
                  setProdukVariantList(newList);
                }}
                disabled
              />

              <div className="col-span-2">
                {formatRupiah(item.qty * item.harga || 0)}
              </div>

              <Button
                type="button"
                variant="destructive"
                onClick={() => hapusBarisProduk(index)}
                className="col-span-1"
                disabled={produkVariantList.length === 1}
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
        <div className="flex justify-end">
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </DialogContent>
  );
}
