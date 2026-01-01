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
import { apiRequest } from "@/lib/apiRequest";

const TambahKategoriProdukForm = ({ onSuccess, onError }) => {
  const [kodeKategori, setKodeKategori] = useState("");
  const [namaKategori, setNamaKategori] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest("POST", "/api/v1/admin/kategori-produk", {
        kode_kategori: kodeKategori,
        nama_kategori: namaKategori,
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
        <DialogTitle>Tambah Kategori Produk</DialogTitle>
        <DialogDescription>
          Tambahkan kategori produk baru ke dalam daftar.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button onClick={handleSubmit} variant="outline" disabled={loading}>
            {loading ? "Loading..." : "Simpan"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default TambahKategoriProdukForm;
