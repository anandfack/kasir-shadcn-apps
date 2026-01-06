"use client";

import { useState, Fragment, useMemo } from "react";
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
import { Textarea } from "../ui/textarea";
import { apiRequest } from "@/lib/apiRequest";

const ProdukForm = ({
  onSuccess,
  onError,
  kategoriData,
  satuanData,
  supplierData,
  setKategoriOpen,
  setSatuanOpen,
  setSupplierOpen,
  kategoriLoading,
  satuanLoading,
  supplierLoading,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [selectedSatuan, setSelectedSatuan] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [kategoriId, setKategoriId] = useState("");
  const [satuanId, setSatuanId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [deskripsiProduk, setDeskripsiProduk] = useState("");
  const [kodeProduk, setKodeProduk] = useState("");
  const [searchKategori, setSearchKategori] = useState("");
  const [searchSatuan, setSearchSatuan] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");

  const kategoriList = useMemo(() => {
    if (Array.isArray(kategoriData)) return kategoriData;
    if (Array.isArray(kategoriData?.data)) return kategoriData.data;
    return [];
  }, [kategoriData]);
  const satuanList = useMemo(() => {
    if (Array.isArray(satuanData)) return satuanData;
    if (Array.isArray(satuanData?.data)) return satuanData.data;
    return [];
  }, [satuanData]);
  const supplierList = useMemo(() => {
    if (Array.isArray(supplierData)) return supplierData;
    if (Array.isArray(supplierData?.data)) return supplierData.data;
    return [];
  }, [supplierData]);

  const filteredKategori = useMemo(() => {
    if (!kategoriList) return [];
    if (!searchKategori) return kategoriList;

    return kategoriList.filter((item) =>
      item.nama_kategori.toLowerCase().includes(searchKategori.toLowerCase())
    );
  }, [kategoriList, searchKategori]);

  const filteredSatuan = useMemo(() => {
    if (!satuanList) return [];
    if (!searchSatuan) return satuanList;

    return satuanList.filter((item) =>
      item.nama_satuan.toLowerCase().includes(searchSatuan.toLowerCase())
    );
  }, [satuanList, searchSatuan]);

  const filteredSupplier = useMemo(() => {
    if (!supplierList) return [];
    if (!searchSupplier) return supplierList;

    return supplierList.filter((item) =>
      item.nama_supplier.toLowerCase().includes(searchSupplier.toLowerCase())
    );
  }, [supplierList, searchSupplier]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest("POST", "/api/v1/admin/produk", {
        kategori_id: kategoriId,
        satuan_produk_id: satuanId,
        supplier_id: supplierId,
        nama_produk: namaProduk,
        deskripsi_produk: deskripsiProduk,
        kode_produk: kodeProduk,
      });

      onSuccess();
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Tambah Produk</DialogTitle>
        <DialogDescription>
          Tambahkan produk baru ke dalam daftar.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
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
                      {selectedKategori?.nama_kategori ||
                        "Pilih Kategori Produk"}
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
                      {/* 🔍 SEARCH */}
                      <div className="p-2 border-b">
                        <Input
                          placeholder="Cari kategori..."
                          value={searchKategori}
                          onChange={(e) => setSearchKategori(e.target.value)}
                          onKeyDownCapture={(e) => {
                            if (e.key === " ") e.stopPropagation();
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                      {kategoriLoading ? (
                        <div className="py-2 px-4 text-muted-foreground italic">
                          Loading...
                        </div>
                      ) : filteredKategori.length > 0 ? (
                        filteredKategori.map((kategori) => (
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
                      {/* 🔍 SEARCH */}
                      <div className="p-2 border-b">
                        <Input
                          placeholder="Cari kategori..."
                          value={searchSatuan}
                          onChange={(e) => setSearchSatuan(e.target.value)}
                          onKeyDownCapture={(e) => {
                            if (e.key === " ") e.stopPropagation();
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                      {satuanLoading ? (
                        <div className="py-2 px-4 text-muted-foreground italic">
                          Loading...
                        </div>
                      ) : filteredSatuan.length > 0 ? (
                        filteredSatuan.map((satuan) => (
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
                      {selectedSupplier?.nama_supplier ||
                        "Pilih Supplier Produk"}
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
                      {/* 🔍 SEARCH */}
                      <div className="p-2 border-b">
                        <Input
                          placeholder="Cari kategori..."
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
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Simpan"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ProdukForm;
