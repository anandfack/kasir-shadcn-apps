"use client";

import React, { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Listbox, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { useTambahProduk } from "@/hooks/produk/useTambahProduk";
import { Textarea } from "@/components/ui/textarea";

const TambahProdukForm = ({ onSuccess, onError }) => {
  const { tambahProduk, isLoading, error } = useTambahProduk();

  // State untuk melacak apakah dropdown dibuka
  const [kategoriOpen, setKategoriOpen] = useState(false);
  const [satuanOpen, setSatuanOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);

  // Fetch data hanya ketika dropdown dibuka
  const { data: kategoriData, isLoading: kategoriLoading } = useQuery({
    queryKey: ["kategori-produk"],
    queryFn: () => fetchOptions("/api/kategori-produk"),
    enabled: kategoriOpen, // Hanya fetch ketika dropdown dibuka
    staleTime: 1000 * 60 * 5, // Cache data selama 5 menit
  });

  const { data: satuanData, isLoading: satuanLoading } = useQuery({
    queryKey: ["satuan-produk"],
    queryFn: () => fetchOptions("/api/v1/satuan-produk"),
    enabled: satuanOpen, // Hanya fetch ketika dropdown dibuka
    staleTime: 1000 * 60 * 5, // Cache data selama 5 menit
  });

  const { data: supplierData, isLoading: supplierLoading } = useQuery({
    queryKey: ["supplier-produk"],
    queryFn: () => fetchOptions("/api/v1/supplier"),
    enabled: supplierOpen, // Hanya fetch ketika dropdown dibuka
    staleTime: 1000 * 60 * 5, // Cache data selama 5 menit
  });

  const fetchOptions = async (url) => {
    try {
      const response = await axios.get(url);
      console.log(`Data fetched from ${url}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return [];
    }
  };

  const [kodeProduk, setKodeProduk] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [deskripsiProduk, setDeskripsiProduk] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [satuanId, setSatuanId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  // Selected objects for display
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [selectedSatuan, setSelectedSatuan] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const handleTambahProduk = async () => {
    const payload = {
      kode_produk: kodeProduk,
      nama_produk: namaProduk,
      deskripsi_produk: deskripsiProduk,
      is_aktif: true,
      kategori_id: kategoriId,
      satuan_produk_id: satuanId,
      supplier_id: supplierId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    try {
      const result = await tambahProduk(payload, {
        onSuccess,
        onError,
      });
      if (result.success) {
        setKodeProduk("");
        setNamaProduk("");
        setDeskripsiProduk("");
        setKategoriId("");
        setSatuanId("");
        setSupplierId("");
        setSelectedKategori(null);
        setSelectedSatuan(null);
        setSelectedSupplier(null);
      }
    } catch (error) {
      if (onError) onError(error);
      console.error("Error saat menambahkan supplier:", error);
    }
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="kategori-produk" className="text-center">
            Kategori Produk <i className="text-red-500">*</i>
          </Label>
          <div className="col-span-3">
            <Listbox
              value={selectedKategori}
              onChange={(kategori) => {
                setSelectedKategori(kategori);
                setKategoriId(kategori?.id || "");
              }}
            >
              <div className="relative mt-1">
                <Listbox.Button
                  className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                  onClick={() => setKategoriOpen(true)}
                >
                  <span className="block truncate">
                    {selectedKategori?.nama_kategori || "Pilih Kategori Produk"}
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
                  afterLeave={() => setKategoriOpen(false)}
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                    {kategoriLoading ? (
                      <div className="py-2 px-4 text-muted-foreground italic">
                        Loading...
                      </div>
                    ) : kategoriData && kategoriData.length > 0 ? (
                      kategoriData.map((kategori) => (
                        <Listbox.Option
                          key={kategori.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-accent text-accent-foreground"
                                : "text-popover-foreground"
                            }`
                          }
                          value={kategori}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {kategori.nama_kategori}
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
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nama-produk" className="text-center">
            Nama Produk <i className="text-red-500">*</i>
          </Label>
          <Input
            id="nama-produk"
            value={namaProduk}
            onChange={(e) => setNamaProduk(e.target.value)}
            className="col-span-3"
            placeholder="Masukkan nama produk"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deskripsi-produk" className="text-center">
            Deskripsi Produk <i className="text-red-500">*</i>
          </Label>
          <Textarea
            id="deskripsi-produk"
            value={deskripsiProduk}
            onChange={(e) => setDeskripsiProduk(e.target.value)}
            className="col-span-3 md:h-60"
            placeholder="Masukkan deskripsi produk"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="satuan-produk" className="text-center">
            Satuan Produk <i className="text-red-500">*</i>
          </Label>
          <div className="col-span-3">
            <Listbox
              value={selectedSatuan}
              onChange={(satuan) => {
                setSelectedSatuan(satuan);
                setSatuanId(satuan?.id || "");
              }}
            >
              <div className="relative mt-1">
                <Listbox.Button
                  className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                  onClick={() => setSatuanOpen(true)}
                >
                  <span className="block truncate">
                    {selectedSatuan?.nama_satuan || "Pilih Satuan Produk"}
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
                  afterLeave={() => setSatuanOpen(false)}
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                    {satuanLoading ? (
                      <div className="py-2 px-4 text-muted-foreground italic">
                        Loading...
                      </div>
                    ) : satuanData && satuanData.length > 0 ? (
                      satuanData.map((satuan) => (
                        <Listbox.Option
                          key={satuan.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-accent text-accent-foreground"
                                : "text-popover-foreground"
                            }`
                          }
                          value={satuan}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {satuan.nama_satuan}
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
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="kode-produk" className="text-center">
            Kode Produk <i className="text-red-500">*</i>
          </Label>
          <Input
            id="kode-produk"
            value={kodeProduk}
            onChange={(e) => setKodeProduk(e.target.value)}
            className="col-span-3"
            placeholder="Masukkan kode produk"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleTambahProduk}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Simpan"}
        </Button>
      </div>
    </>
  );
};

export default TambahProdukForm;
