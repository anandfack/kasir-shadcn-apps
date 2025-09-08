"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useTambahSatuanProduk } from "@/hooks/satuan-produk/useTambahSatuanProduk";

const TambahSatuanProdukForm = ({ onSuccess, onError }) => {
  const { tambahSatuanProduk, isLoading, error } = useTambahSatuanProduk();

  const [kodeSatuan, setKodeSatuan] = React.useState("");
  const [namaSatuan, setNamaSatuan] = React.useState("");

  const handleTambahSatuanProduk = async () => {
    const payload = {
      kode_satuan: kodeSatuan,
      nama_satuan: namaSatuan,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    try {
      const result = await tambahSatuanProduk(payload, {
        onSuccess,
        onError,
      });
      if (result.success) {
        setKodeSatuan("");
        setNamaSatuan("");
      }
    } catch (error) {
      if (onError) onError(error);
      console.error("Error saat menambahkan satuan produk:", error);
    }
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="kode-satuan" className="text-center">
            Kode Satuan <i className="text-red-500">*</i>
          </Label>
          <Input
            id="kode-satuan"
            value={kodeSatuan}
            onChange={(e) => setKodeSatuan(e.target.value)}
            className="col-span-3"
            placeholder="Masukkan kode satuan"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nama-satuan" className="text-center">
            Nama Satuan <i className="text-red-500">*</i>
          </Label>
          <Input
            id="nama-satuan"
            value={namaSatuan}
            onChange={(e) => setNamaSatuan(e.target.value)}
            className="col-span-3"
            placeholder="Masukkan nama satuan"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleTambahSatuanProduk}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Simpan"}
        </Button>
      </div>
    </>
  );
};

export default TambahSatuanProdukForm;
