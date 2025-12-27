"use client";
import React, { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/app/utils/fetchOptions";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Switch } from "../ui/switch";
import { ROLE_OPTIONS } from "@/lib/roleBadge";

const UpdateKonfigurasiPenggunaForm = ({
  pegawaiData,
  initialData,
  onSubmit,
  isLoading,
  onError,
}) => {
  const [formData, setFormData] = useState(initialData ?? {});
  const [isChanged, setIsChanged] = useState(false);
  const [searchRole, setSearchRole] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        pegawai: initialData.pegawai?.id || "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    setIsChanged(
      JSON.stringify(formData) !==
        JSON.stringify({
          ...initialData,
          pegawai: initialData.pegawai?.id || "",
        })
    );
  }, [formData, initialData]);

  const filteredRoles = ROLE_OPTIONS.filter((role) =>
    role.label.toLowerCase().includes(searchRole.toLowerCase())
  );

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
        pegawai_id: formData.pegawai,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        is_aktif: formData.is_aktif,
      };
      // Menggunakan apiRequest untuk update harga produk
      const updatedData = await apiRequest(
        "PUT",
        `/api/v1/admin/konfigurasi-pengguna/${formData.id}`,
        dataToSend
      );

      console.log("Data berhasil disimpan:", updatedData);

      // Update state dengan data baru
      setFormData((prev) => ({
        ...prev,
        pegawai: updatedData.pegawai_id,
        username: updatedData.username,
        email: updatedData.email,
        role: updatedData.role,
      }));

      if (onSubmit) onSubmit(updatedData);
    } catch (error) {
      onError;
      console.error("Error saat menyimpan data:", error);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Pegawai */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="pegawai" className="text-center">
          Pegawai <i className="text-red-500">*</i>
        </Label>
        <div className="col-span-3">
          <Listbox
            value={formData.pegawai}
            onChange={(pegawai) => {
              if (pegawai.id !== formData.pegawai) {
                console.log("Pegawai dipilih:", pegawai);
                setFormData((prev) => ({ ...prev, pegawai: pegawai.id }));
              }
            }}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm">
                <span className="block truncate">
                  {pegawaiData.find((p) => p.id === formData.pegawai)
                    ?.nama_pegawai || "Pilih Pegawai"}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition-opacity duration-100">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                  {pegawaiData.length > 0 ? (
                    pegawaiData.map((pegawai) => (
                      <Listbox.Option
                        key={pegawai.id}
                        value={pegawai}
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
                              {pegawai.nama_pegawai}
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

      {/* Username */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-center">
          Username <i className="text-red-500">*</i>
        </Label>
        <Input
          name="username"
          value={formData.username || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan username"
        />
      </div>

      {/* Email */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-center">
          Email <i className="text-red-500">*</i>
        </Label>
        <Input
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan Email"
        />
      </div>

      {/* Role */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Role <i className="text-red-500">*</i>
        </Label>

        <div className="col-span-3">
          <Listbox
            value={ROLE_OPTIONS.find((r) => r.value === formData.role)}
            onChange={(role) =>
              setFormData((prev) => ({ ...prev, role: role.value }))
            }
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full h-10 rounded-md bg-background border border-input py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm">
                <span className="block truncate">
                  {ROLE_OPTIONS.find((r) => r.value === formData.role)?.label ||
                    "Pilih Role"}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5" />
                </span>
              </Listbox.Button>

              <Transition as={Fragment} leave="transition-opacity duration-100">
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-hidden rounded-md bg-popover shadow-lg ring-1 ring-black/5 dark:ring-white/10 sm:text-sm">
                  {/* 🔍 Search Input */}
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Cari role..."
                      value={searchRole}
                      onChange={(e) => setSearchRole(e.target.value)}
                      onKeyDownCapture={(e) => {
                        if (e.key === " ") {
                          e.stopPropagation();
                        }
                      }}
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* 📋 Role list */}
                  <div className="max-h-48 overflow-auto">
                    {filteredRoles.length > 0 ? (
                      filteredRoles.map((role) => (
                        <Listbox.Option
                          key={role.value}
                          value={role}
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
                                {role.label}
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
                      <div className="px-4 py-2 text-muted-foreground text-sm">
                        Role tidak ditemukan
                      </div>
                    )}
                  </div>
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Status */}
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

export default UpdateKonfigurasiPenggunaForm;
