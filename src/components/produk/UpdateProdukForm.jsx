"use client";
import React, { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/app/utils/fetchOptions";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";

const UpdateHargaProdukForm = ({
  kategoriData,
  satuanData,
  supplierData,
  initialData,
  onSubmit,
  isLoading,
  onError,
}) => {
  const [formData, setFormData] = React.useState(initialData ?? {});
  const [isChanged, setIsChanged] = React.useState(false);

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        kategori: initialData.kategori?.id || "",
        satuan: initialData.satuan?.id || "",
        supplier: initialData.supplier?.id || "",
      });
    }
  }, [initialData]);

  React.useEffect(() => {
    setIsChanged(
      JSON.stringify(formData) !==
        JSON.stringify({
          ...initialData,
          kategori: initialData.kategori?.id || "",
          satuan: initialData.satuan_produk?.id || "",
          supplier: initialData.supplier?.id || "",
        })
    );
  }, [formData, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (value) => {
    setFormData((prev) => ({ ...prev, is_aktif: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        kategori_id: formData.kategori,
        satuan_produk_id: formData.satuan,
        supplier_id: formData.supplier,
        kode_produk: formData.kode_produk,
        nama_produk: formData.nama_produk,
        deskripsi_produk: formData.deskripsi_produk,
        is_aktif: formData.is_aktif,
      };
      // Menggunakan apiRequest untuk update harga produk
      const updatedData = await apiRequest(
        "PUT",
        `/api/v1/admin/produk/${formData.id}`,
        dataToSend
      );

      console.log("Data berhasil disimpan:", updatedData);

      // Update state dengan data baru
      setFormData((prev) => ({
        ...prev,
        kategori: updatedData.kategori_id,
        satuan: updatedData.satuan_produk_id,
        supplier: updatedData.supplier_id,
        kode_produk: updatedData.kode_produk,
        nama_produk: updatedData.nama_produk,
        deskripsi_produk: updatedData.deskripsi_produk,
      }));

      if (onSubmit) onSubmit(updatedData);
    } catch (error) {
      onError;
      console.error("Error saat menyimpan data:", error);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Kategori Produk */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="kategori-produk" className="text-center">
          Kategori Produk <i className="text-red-500">*</i>
        </Label>
        <div className="col-span-3">
          <Listbox
            value={formData.kategori}
            onChange={(kategori) => {
              if (kategori.id !== formData.kategori) {
                console.log("Kategori dipilih:", kategori);
                setFormData((prev) => ({ ...prev, kategori: kategori.id }));
              }
            }}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm">
                <span className="block truncate">
                  {kategoriData.find((k) => k.id === formData.kategori)
                    ?.nama_kategori || "Pilih Kategori Produk"}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition-opacity duration-100">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                  {kategoriData.length > 0 ? (
                    kategoriData.map((kategori) => (
                      <Listbox.Option
                        key={kategori.id}
                        value={kategori}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-accent text-accent-foreground"
                              : "text-popover-foreground"
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
                    <div className="py-2 px-4 text-gray-500">
                      Tidak ada data
                    </div>
                  )}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Nama Produk */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nama-produk" className="text-center">
          Nama Produk <i className="text-red-500">*</i>
        </Label>
        <Input
          name="nama_produk"
          value={formData.nama_produk || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan nama produk"
        />
      </div>

      {/* Deskripsi Produk */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="deskripsi-produk" className="text-center">
          Deskripsi Produk <i className="text-red-500">*</i>
        </Label>
        <Textarea
          name="deskripsi_produk"
          value={formData.deskripsi_produk || ""}
          onChange={handleChange}
          className="col-span-3 md:h-60"
          placeholder="Masukkan deskripsi produk"
        />
      </div>

      {/* Satuan Produk */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="satuan-produk" className="text-center">
          Satuan Produk <i className="text-red-500">*</i>
        </Label>
        <div className="col-span-3">
          <Listbox
            value={formData.satuan}
            onChange={(satuan) => {
              if (satuan.id !== formData.satuan) {
                console.log("Satuan dipilih:", satuan);
                setFormData((prev) => ({ ...prev, satuan: satuan.id }));
              }
            }}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm">
                <span className="block truncate">
                  {satuanData.find((s) => s.id === formData.satuan)
                    ?.nama_satuan || "Pilih Satuan Produk"}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition-opacity duration-100">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                  {satuanData.length > 0 ? (
                    satuanData.map((satuan) => (
                      <Listbox.Option
                        key={satuan.id}
                        value={satuan}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-accent text-accent-foreground"
                              : "text-popover-foreground"
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
                              {satuan.nama_satuan}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : (
                              <div className="py-2 px-4 text-gray-500">
                                Tidak ada data
                              </div>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))
                  ) : (
                    <div className="py-2 px-4 text-gray-500">
                      Tidak ada data
                    </div>
                  )}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Supplier Produk */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="supplier-produk" className="text-center">
          Supplier Produk <i className="text-red-500">*</i>
        </Label>
        <div className="col-span-3">
          <Listbox
            value={formData.supplier}
            onChange={(supplier) => {
              if (supplier.id !== formData.supplier) {
                console.log("Supplier dipilih:", supplier);
                setFormData((prev) => ({ ...prev, supplier: supplier.id }));
              }
            }}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm">
                <span className="block truncate">
                  {supplierData.find((s) => s.id === formData.supplier)
                    ?.nama_supplier || "Pilih Supplier"}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition-opacity duration-100">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                  {supplierData.length > 0 ? (
                    supplierData.map((supplier) => (
                      <Listbox.Option
                        key={supplier.id}
                        value={supplier}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-accent text-accent-foreground"
                              : "text-popover-foreground"
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
                              {supplier.nama_supplier}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : (
                              <div className="py-2 px-4 text-gray-500">
                                Tidak ada data
                              </div>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))
                  ) : (
                    <div className="py-2 px-4 text-gray-500">
                      Tidak ada data
                    </div>
                  )}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Kode Produk */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="kode-produk" className="text-center">
          Kode Produk <i className="text-red-500">*</i>
        </Label>
        <Input
          name="kode_produk"
          value={formData.kode_produk || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan kode produk"
        />
      </div>

      {/* Status Produk */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-center">
          Status
        </Label>
        <Switch
          id="status"
          checked={formData.is_aktif || false}
          onCheckedChange={handleSwitchChange}
        />
        <Label>{formData.is_aktif ? "Aktif" : "Nonaktif"}</Label>
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!isChanged || isLoading}>
          {isLoading ? "Loading..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
};

export default UpdateHargaProdukForm;
