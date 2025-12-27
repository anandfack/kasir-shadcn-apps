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
import { apiRequest } from "@/app/utils/fetchOptions";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "lucide-react";
import { ROLE_OPTIONS } from "@/lib/roleBadge";

const TambahKonfigurasiPenggunaForm = ({
  onSuccess,
  onError,
  pegawaiData,
  setPegawaiOpen,
  pegawaiLoading,
}) => {
  const [selectedPegawai, setSelectedPegawai] = useState(null);
  const [pegawaiId, setPegawaiId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchRole, setSearchRole] = useState("");

  const filteredRoles = ROLE_OPTIONS.filter((role) =>
    role.label.toLowerCase().includes(searchRole.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      onError(new Error("Password dan Confirm Password harus sama"));
      setLoading(false);
      return;
    }

    try {
      await apiRequest("POST", "/api/v1/admin/konfigurasi-pengguna", {
        pegawai_id: pegawaiId,
        username: username,
        password: password,
        role: role,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      onSuccess();
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle>Tambah Pengguna</DialogTitle>
        <DialogDescription>
          Tambahkan pengguna baru ke dalam daftar.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kategori-produk" className="text-center">
              Pegawai <i className="text-red-500">*</i>
            </Label>
            <div className="col-span-3">
              <Listbox
                value={selectedPegawai}
                onChange={(pegawai) => {
                  setSelectedPegawai(pegawai);
                  setPegawaiId(pegawai?.id || "");
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    className="relative w-full h-10 cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input sm:text-sm"
                    onClick={() => setPegawaiOpen(true)}
                  >
                    <span className="block truncate">
                      {selectedPegawai?.nama_pegawai || "Pilih Pegawai"}
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
                    afterLeave={() => setPegawaiOpen(false)}
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm z-10">
                      {pegawaiLoading ? (
                        <div className="py-2 px-4 text-muted-foreground italic">
                          Loading...
                        </div>
                      ) : pegawaiData && pegawaiData.length > 0 ? (
                        pegawaiData.map((pegawai) => (
                          <Listbox.Option
                            key={pegawai.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-accent text-accent-foreground"
                                  : "text-popover-foreground"
                              }`
                            }
                            value={pegawai}
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
            <Label htmlFor="username" className="text-center">
              Username <i className="text-red-500">*</i>
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan username"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-center">
              Password <i className="text-red-500">*</i>
            </Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan password"
              type="password"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-center">
              Confirm Password <i className="text-red-500">*</i>
            </Label>
            <Input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan password"
              type="password"
            />
          </div>
          {/* Role */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-center">
              Role <i className="text-red-500">*</i>
            </Label>

            <div className="col-span-3">
              <Listbox
                value={ROLE_OPTIONS.find((r) => r.value === role)}
                onChange={(selectedRole) => setRole(selectedRole.value)}
              >
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full h-10 rounded-md bg-background border border-input py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm">
                    <span className="block truncate">
                      {ROLE_OPTIONS.find((r) => r.value === role)?.label ||
                        "Pilih Role"}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    as={Fragment}
                    leave="transition-opacity duration-100"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 w-full rounded-md bg-popover shadow-lg ring-1 ring-black/5 dark:ring-white/10 sm:text-sm">
                      {/* 🔍 Search */}
                      <div className="p-2 border-b">
                        <Input
                          placeholder="Cari role..."
                          value={searchRole}
                          onChange={(e) => setSearchRole(e.target.value)}
                          onKeyDownCapture={(e) => {
                            if (e.key === " ") e.stopPropagation();
                          }}
                          className="h-8 text-sm"
                        />
                      </div>

                      {/* 📋 List Role */}
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

export default TambahKonfigurasiPenggunaForm;
