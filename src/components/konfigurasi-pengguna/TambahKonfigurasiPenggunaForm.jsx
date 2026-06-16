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
import { apiRequest } from "@/lib/apiRequest";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon, Loader2Icon, SaveIcon, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const TambahKonfigurasiPenggunaForm = ({
  onSuccess,
  onError,
  pegawaiWithoutLoginData,
  pegawaiWithoutLoginLoading,
  setPegawaiWithoutLoginOpen,
}) => {
  const [selectedPegawaiWithoutLogin, setSelectedPegawaiWithoutLogin] =
    useState(null);
  const [pegawaiWithoutLoginId, setPegawaiWithoutLoginId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleIds, setRoleIds] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchPegawaiWithoutLogin, setSearchPegawaiWithoutLogin] =
    useState("");

  const { data: roleList = [], isLoading: roleLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      apiRequest("GET", "/api/v1/admin/roles").then((res) => res.data || []),
    staleTime: 1000 * 60 * 5,
  });

  const toggleRole = (roleId) => {
    setRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  const pegawaiList = useMemo(() => {
    if (Array.isArray(pegawaiWithoutLoginData)) return pegawaiWithoutLoginData;
    if (Array.isArray(pegawaiWithoutLoginData?.data))
      return pegawaiWithoutLoginData.data;
    return [];
  }, [pegawaiWithoutLoginData]);

  const filteredPegawai = useMemo(() => {
    if (!pegawaiList) return [];
    if (!searchPegawaiWithoutLogin) return pegawaiList;

    return pegawaiList.filter((item) =>
      item.nama_kategori
        .toLowerCase()
        .includes(searchPegawaiWithoutLogin.toLowerCase()),
    );
  }, [pegawaiList, searchPegawaiWithoutLogin]);

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
        pegawai_id: pegawaiWithoutLoginId,
        username: username,
        password: password,
        role_ids: roleIds,
        email: email,
      });

      onSuccess();
    } catch (error) {
      onError?.(error);
      console.error(error);
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
            <Label className="text-center">
              Pegawai <i className="text-red-500">*</i>
            </Label>

            <div className="col-span-3">
              <Listbox
                value={selectedPegawaiWithoutLogin}
                onChange={(pegawai) => {
                  setSelectedPegawaiWithoutLogin(pegawai);
                  setPegawaiWithoutLoginId(pegawai?.id || "");
                }}
              >
                <div className="relative mt-1">
                  {/* Button */}
                  <Listbox.Button
                    className="relative w-full h-10 rounded-md bg-background border border-input py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
                    onClick={() => setPegawaiWithoutLoginOpen(true)}
                  >
                    <span className="block truncate">
                      {selectedPegawaiWithoutLogin?.nama_pegawai ||
                        "Pilih Pegawai"}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-muted-foreground" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setPegawaiWithoutLoginOpen(false)}
                  >
                    <Listbox.Options className="absolute z-10 mt-1 w-full rounded-md bg-popover pb-1 pt-0 shadow-lg ring-1 ring-black/5 dark:ring-white/10 sm:text-sm">
                      {/* 🔍 Search */}
                      <div className="p-2 border-b">
                        <Input
                          placeholder="Cari pegawai..."
                          value={searchPegawaiWithoutLogin}
                          onChange={(e) =>
                            setSearchPegawaiWithoutLogin(e.target.value)
                          }
                          onKeyDownCapture={(e) => {
                            if (e.key === " ") e.stopPropagation();
                          }}
                          className="h-8 text-sm"
                        />
                      </div>

                      {/* 📋 LIST */}
                      {pegawaiWithoutLoginLoading ? (
                        <div className="py-2 px-4 text-muted-foreground italic">
                          Loading...
                        </div>
                      ) : filteredPegawai.length > 0 ? (
                        filteredPegawai.map((pegawai) => (
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
                          Pegawai tidak ditemukan
                        </div>
                      )}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>{" "}
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
            <Label htmlFor="email" className="text-center">
              Email <i className="text-red-500">*</i>
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan email"
              type="email"
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
          {/* Role (Multi-select) */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-center pt-2">
              Role <i className="text-red-500">*</i>
            </Label>

            <div className="col-span-3 space-y-2">
              {roleLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memuat role...
                </div>
              ) : (
                <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                  {roleList.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Tidak ada role tersedia
                    </p>
                  )}
                  {roleList.map((role) => {
                    const isSelected = roleIds.includes(role.id);
                    return (
                      <label
                        key={role.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-accent/50 rounded px-2 py-1.5"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRole(role.id)}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {role.label}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {role.name}
                          </Badge>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2Icon className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <SaveIcon className="w-4 h-4" />
                Simpan
              </>
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default TambahKonfigurasiPenggunaForm;
