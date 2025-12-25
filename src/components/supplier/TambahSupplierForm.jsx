"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

const TambahSupplierForm = ({ onSuccess, onError }) => {
  const [kodeSupplier, setKodeSupplier] = useState("");
  const [namaSupplier, setNamaSupplier] = useState("");
  const [alamatSupplier, setAlamatSupplier] = useState("");
  const [nomorTeleponSupplier, setNomorTeleponSupplier] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest("POST", "/api/v1/admin/supplier", {
        kode_supplier: kodeSupplier,
        nama_supplier: namaSupplier,
        alamat_supplier: alamatSupplier,
        nomor_telepon_supplier: nomorTeleponSupplier,
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
        <DialogTitle>Tambah Supplier</DialogTitle>
        <DialogDescription>
          Tambahkan supplier baru ke dalam daftar.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kode-supplier" className="text-center">
              Kode Supplier <i className="text-red-500">*</i>
            </Label>
            <Input
              id="kode-supplier"
              value={kodeSupplier}
              onChange={(e) => setKodeSupplier(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan kode supplier"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama-supplier" className="text-center">
              Nama Supplier <i className="text-red-500">*</i>
            </Label>
            <Input
              id="nama-supplier"
              value={namaSupplier}
              onChange={(e) => setNamaSupplier(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan nama supplier"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="alamat-supplier" className="text-center">
              Alamat Supplier <i className="text-red-500">*</i>
            </Label>
            <Textarea
              id="alamat-supplier"
              value={alamatSupplier}
              onChange={(e) => setAlamatSupplier(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan alamat supplier"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nomor-telepon-supplier" className="text-center">
              Nomor Telepon Supplier <i className="text-red-500">*</i>
            </Label>
            <Input
              id="nomor-telepon-supplier"
              value={nomorTeleponSupplier}
              onChange={(e) => setNomorTeleponSupplier(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan nomor telepon supplier"
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

export default TambahSupplierForm;
