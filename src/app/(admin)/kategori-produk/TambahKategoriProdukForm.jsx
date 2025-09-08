"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useTambahKategoriProduk } from "@/hooks/useTambahKategoriProduk";

const TambahKategoriProdukForm = ({ onSuccess, onError }) => {
  const { tambahKategoriProduk, isLoading, error } = useTambahKategoriProduk();

  const [kodeKategori, setKodeKategori] = React.useState("");
  const [namaKategori, setNamaKategori] = React.useState("");

  const handleTambahKategoriProduk = async () => {
    const payload = {
      kode_kategori: kodeKategori,
      nama_kategori: namaKategori,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    try {
      // Memanggil fungsi tambahKategoriProduk
      const result = await tambahKategoriProduk(payload, {
        onSuccess,
        onError,
      });
      if (result.success) {
        setKodeKategori("");
        setNamaKategori("");
      }
      // await tambahKategoriProduk(payload);
      // setKodeKategori("");
      // setNamaKategori("");
      // if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error);
      console.error("Error saat menambahkan kategori:", error);
    }
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="kode-kategori" className="text-center">
            Kode Kategori <i className="text-red-500">*</i>
          </Label>
          <Input
            id="kode-kategori"
            value={kodeKategori}
            onChange={(e) => setKodeKategori(e.target.value)}
            className="col-span-3"
            placeholder="Masukkan kode kategori"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nama-kategori" className="text-center">
            Nama Kategori <i className="text-red-500">*</i>
          </Label>
          <Input
            id="nama-kategori"
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            className="col-span-3"
            placeholder="Masukkan nama kategori"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleTambahKategoriProduk}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Simpan"}
        </Button>
      </div>
    </>
  );
};

export default TambahKategoriProdukForm;
