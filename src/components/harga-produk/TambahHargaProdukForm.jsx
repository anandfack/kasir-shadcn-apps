"use client";

import { React, useState, useMemo, Fragment } from "react";
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
import { apiRequest } from "@/lib/apiRequest";

const TambahHargaProdukForm = ({ onSuccess, onError }) => {
  const [hargaBeli, setHargaBeli] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [produkId, setProdukId] = useState("");
  const [produkOpen, setProdukOpen] = useState(false);
  const [searchProduk, setSearchProduk] = useState("");

  const { data: produkData, isLoading: produkLoading } = useQuery({
    queryKey: ["produk"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/produk?without_price=true"),
    enabled: produkOpen,
  });

  const produkList = useMemo(() => {
    if (Array.isArray(produkData)) return produkData;
    if (Array.isArray(produkData?.data)) return produkData.data;
    return [];
  }, [produkData]);

  const filteredProduk = useMemo(() => {
    if (!produkList) return [];
    if (!searchProduk) return produkList;

    return produkList.filter((item) =>
      item.nama_kategori.toLowerCase().includes(searchProduk.toLowerCase())
    );
  }, [produkList, searchProduk]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hargaBeliFloat = parseFloat(hargaBeli) || 0;
    const hargaJualFloat = parseFloat(hargaJual) || 0;

    try {
      await apiRequest("POST", "/api/v1/admin/harga-produk", {
        produk_id: produkId,
        harga_beli: hargaBeliFloat,
        harga_jual: hargaJualFloat,
      });

      onSuccess();
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>Tambah Harga Produk</DialogTitle>
        <DialogDescription>
          Tambahkan harga produk baru ke dalam daftar.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="produk" className="text-center">
              Produk <i className="text-red-500">*</i>
            </Label>
            <div className="col-span-3">
              <Listbox
                value={selectedProduk}
                onChange={(produk) => {
                  setSelectedProduk(produk);
                  setProdukId(produk?.id || "");
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                    onClick={() => setProdukOpen(true)}
                  >
                    <span className="block truncate">
                      {selectedProduk?.nama_produk || "Pilih Produk"}
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
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover pt-0 pb-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                      {/* 🔍 SEARCH */}
                      <div className="sticky top-0 z-20 bg-popover p-2 border-b">
                        <Input
                          placeholder="Cari produk..."
                          value={searchProduk}
                          onChange={(e) => setSearchProduk(e.target.value)}
                          onKeyDownCapture={(e) => {
                            if (e.key === " ") e.stopPropagation();
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                      {produkLoading ? (
                        <div className="py-2 px-4 text-muted-foreground italic">
                          Loading...
                        </div>
                      ) : filteredProduk && filteredProduk.length > 0 ? (
                        filteredProduk.map((produk) => (
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
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="harga-beli" className="text-center">
              Harga Beli <i className="text-red-500">*</i>
            </Label>
            <Input
              id="harga-beli"
              value={hargaBeli}
              onChange={(e) => setHargaBeli(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan harga beli"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="harga-jual" className="text-center">
              Harga Jual <i className="text-red-500">*</i>
            </Label>
            <Input
              id="harga-jual"
              value={hargaJual}
              onChange={(e) => setHargaJual(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan harga jual"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} variant="outline" disabled={loading}>
            {loading ? "Loading..." : "Simpan"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default TambahHargaProdukForm;
