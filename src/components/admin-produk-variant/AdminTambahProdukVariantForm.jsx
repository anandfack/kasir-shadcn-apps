"use client";

import React, { Fragment, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/apiRequest";
import { CirclePlusIcon, Loader2Icon, SaveIcon, XIcon } from "lucide-react";

export default function AdminTambahProdukVariantForm({ onSuccess, onError }) {
  /** =========================
   * STATE
   ========================= */
  const [selectedProduk, setSelectedProduk] = useState(null);

  const [variantList, setVariantList] = useState([
    { sku: "", ukuran: "", warna: "" },
  ]);

  const [produkOpen, setProdukOpen] = useState(false);
  const [searchProduk, setSearchProduk] = useState("");

  /** =========================
   * FETCH PRODUK
   ========================= */
  const { data: produkData, isLoading } = useQuery({
    queryKey: ["produk"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/produk"),
    enabled: produkOpen,
    staleTime: 1000 * 60 * 5,
  });

  const produkList = useMemo(() => {
    if (Array.isArray(produkData)) return produkData;
    if (Array.isArray(produkData?.data)) return produkData.data;
    return [];
  }, [produkData]);

  const filteredProduk = useMemo(() => {
    if (!searchProduk) return produkList;
    return produkList.filter((p) =>
      p.nama_produk.toLowerCase().includes(searchProduk.toLowerCase()),
    );
  }, [produkList, searchProduk]);

  /** =========================
   * HANDLER
   ========================= */
  const tambahVariant = () => {
    setVariantList([...variantList, { sku: "", ukuran: "", warna: "" }]);
  };

  const hapusVariant = (index) => {
    setVariantList(variantList.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const newList = [...variantList];
    newList[index][field] = value;
    setVariantList(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      produk_id: selectedProduk?.id,
      variants: variantList,
    };

    try {
      const response = await apiRequest(
        "POST",
        "/api/v1/admin/produk-variant",
        payload,
      );
      console.log(response);
      onSuccess();
    } catch (error) {
      onError();
    }
  };

  const disableSubmit =
    !selectedProduk || variantList.some((v) => !v.sku || !v.ukuran || !v.warna);

  return (
    <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Tambah Produk Variant</DialogTitle>
        <DialogDescription>
          Pilih produk lalu tambahkan beberapa variant.
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 min-h-0 space-y-6"
      >
        <div className="flex items-center gap-5">
          <Label className="text-center flex items-center gap-2">
            Produk <span className="text-rose-500">*</span>
          </Label>
          <div className="w-full">
            <Listbox
              value={selectedProduk}
              onChange={(produk) => {
                setSelectedProduk(produk);
                setVariantList([{ sku: "", ukuran: "", warna: "" }]);
              }}
              disabled={!!selectedProduk}
            >
              <div className="relative">
                <Listbox.Button
                  onClick={() => setProdukOpen(true)}
                  className="relative w-full h-10 rounded-md border bg-background pl-3 pr-10 text-left"
                >
                  <span className="block truncate">
                    {selectedProduk?.nama_produk || "Pilih Produk"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-muted-foreground" />
                  </span>
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setProdukOpen(false)}
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover shadow-lg ring-1 ring-black/5">
                    <div className="sticky top-0 bg-popover p-2 border-b">
                      <Input
                        placeholder="Cari produk..."
                        value={searchProduk}
                        onChange={(e) => setSearchProduk(e.target.value)}
                        className="h-8"
                      />
                    </div>

                    {isLoading ? (
                      <div className="px-4 py-2 text-sm italic">Loading...</div>
                    ) : filteredProduk.length > 0 ? (
                      filteredProduk.map((produk) => (
                        <Listbox.Option
                          key={produk.id}
                          value={produk}
                          className={({ active }) =>
                            `cursor-pointer select-none py-2 pl-10 pr-4 ${
                              active ? "bg-accent text-accent-foreground" : ""
                            }`
                          }
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
                      <div className="px-4 py-2 text-sm italic">
                        Tidak ada data
                      </div>
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0 space-y-3">
          <Label className="text-center flex items-center gap-2">
            Daftar Variant <span className="text-rose-500">*</span>
          </Label>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {variantList.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
              >
                <Input
                  placeholder="SKU"
                  value={variant.sku}
                  className="font-mono"
                  onChange={(e) => updateVariant(index, "sku", e.target.value)}
                />
                <Input
                  placeholder="Ukuran"
                  value={variant.ukuran}
                  onChange={(e) =>
                    updateVariant(index, "ukuran", e.target.value)
                  }
                />
                <Input
                  placeholder="Warna"
                  value={variant.warna}
                  onChange={(e) =>
                    updateVariant(index, "warna", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={variantList.length === 1}
                  onClick={() => hapusVariant(index)}
                  title="Hapus"
                  className="text-xs text-rose-400 border-rose-400 hover:bg-rose-400/10 transition-colors"
                >
                  <XIcon />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-3 border-t">
          <Button
            type="button"
            variant="secondary"
            title="Tambah"
            onClick={tambahVariant}
          >
            <CirclePlusIcon />
          </Button>
        </div>

        <div className="flex justify-end pt-4 border-t mt-2">
          <Button
            type="submit"
            disabled={disableSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
          >
            <SaveIcon className="w-4 h-4" />
            Simpan
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
