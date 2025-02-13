"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useTambahProduk } from "@/hooks/produk/useTambahProduk";

const TambahProdukForm = ({ onSuccess, onError }) => {
  const { tambahProduk, isLoading, error } = useTambahProduk();

  const [kodeSupplier, setKodeSupplier] = React.useState("");
  const [namaSupplier, setNamaSupplier] = React.useState("");
  const [alamatSupplier, setAlamatSupplier] = React.useState("");
  const [nomorTeleponSupplier, setNomorTeleponSupplier] = React.useState("");

  const handleTambahSupplier = async () => {
    const payload = {
      kode_supplier: kodeSupplier,
      nama_supplier: namaSupplier,
      alamat_supplier: alamatSupplier,
      nomor_telepon_supplier: nomorTeleponSupplier,
      is_aktif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    try {
      const result = await tambahSupplier(payload, {
        onSuccess,
        onError,
      });
      if (result.success) {
        setKodeSupplier("");
        setNamaSupplier("");
        setAlamatSupplier("");
        setNomorTeleponSupplier("");
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
        <Button
          onClick={handleTambahSupplier}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Simpan"}
        </Button>
      </div>
    </>
  );
};

export default TambahSupplierForm;
