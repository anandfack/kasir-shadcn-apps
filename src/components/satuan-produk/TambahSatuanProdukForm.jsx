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

const TambahSatuanProdukForm = ({ onSuccess, onError }) => {
  const [kodeSatuan, setKodeSatuan] = useState("");
  const [namaSatuan, setNamaSatuan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest("POST", "/api/v1/admin/satuan-produk", {
        kode_satuan: kodeSatuan,
        nama_satuan: namaSatuan,
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
        <DialogTitle>Tambah Satuan Produk</DialogTitle>
        <DialogDescription>
          Tambahkan satuan produk baru ke dalam daftar.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button onClick={handleSubmit} variant="outline" disabled={loading}>
            {loading ? "Loading..." : "Simpan"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default TambahSatuanProdukForm;
