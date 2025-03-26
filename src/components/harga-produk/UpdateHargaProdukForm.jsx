"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

const UpdateHargaProdukForm = ({
  // formData,
  // setFormData,
  produkData,
  initialData,
  onSubmit,
  isLoading,
  onChange,
}) => {
  const [formData, setFormData] = React.useState(initialData ?? {});

  React.useEffect(() => {
    console.log("Initial data berubah:", initialData);
    if (initialData) {
      setFormData({
        ...initialData,
        produk: initialData.produk?.id || "", // Pastikan produk ID tersimpan
      });
    }
  }, [initialData]);
  // const handleSelectChange = React.useCallback(
  //   (selectedProduct) => {
  //     if (formData.produk !== selectedProduct.id) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         produk: selectedProduct.id,
  //       }));
  //     }

  //     if (onChange) {
  //       onChange(selectedProduct);
  //     }
  //   },
  //   [formData.produk, setFormData, onChange]
  // );

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  return (
    <div className="grid gap-4 py-4">
      {/* Pilih Produk */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="produk" className="text-center">
          Produk <i className="text-red-500">*</i>
        </Label>
        <div className="col-span-3">
          <Listbox
            value={produkData.find((p) => p.id === formData.produk) || ""}
            onChange={(produk) => {
              if (produk.id !== formData.produk) {
                console.log("Kategori dipilih:", produk);
                setFormData((prev) => ({ ...prev, produk: produk.id }));
              }
            }}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm">
                <span className="block truncate">
                  {produkData.find((k) => k.id === formData.produk)
                    ?.nama_produk || "Pilih Produk"}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition-opacity duration-100">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                  {produkData.length > 0 ? (
                    produkData.map((produk) => (
                      <Listbox.Option
                        key={produk.id}
                        value={produk}
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

      {/* Harga Beli */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="harga-beli" className="text-center">
          Harga Beli <i className="text-red-500">*</i>
        </Label>
        <Input
          type="number"
          name="harga_beli"
          value={formData.harga_beli || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, harga_beli: e.target.value }))
          }
          className="col-span-3"
          placeholder="Masukkan harga beli"
        />
      </div>

      {/* Harga Jual */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="harga-jual" className="text-center">
          Harga Jual <i className="text-red-500">*</i>
        </Label>
        <Input
          type="number"
          name="harga_jual"
          value={formData.harga_jual || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, harga_jual: e.target.value }))
          }
          className="col-span-3"
          placeholder="Masukkan harga jual"
        />
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
};

export default UpdateHargaProdukForm;
