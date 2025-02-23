"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTambahProduk } from "@/hooks/produk/useTambahProduk";
import { useFetchOptions } from "@/hooks/useFetchOptions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TambahProdukForm = ({ onSuccess, onError }) => {
  const { tambahProduk, isLoading, error } = useTambahProduk();

  const [isKategoriOpen, setIsKategoriOpen] = React.useState(false);
  const [isSatuanOpen, setIsSatuanOpen] = React.useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = React.useState(false);

  const fetchOptions = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const { data: kategoriData, isLoading: kategoriLoading } = useQuery({
    queryKey: ["kategori-produk"],
    queryFn: () => fetchOptions("/api/kategori-produk"),
    enabled: isKategoriOpen,
  });
  const { data: satuanData, loading: satuanLoading } = useQuery({
    queryKey: ["satuan-produk"],
    queryFn: () => fetchOptions("/api/v1/satuan-produk"),
    enabled: isSatuanOpen,
  });
  const { data: supplierData, loading: supplierLoading } = useQuery({
    queryKey: ["supplier-produk"],
    queryFn: () => fetchOptions("/api/v1/supplier"),
    enabled: isSupplierOpen,
  });

  const [kodeProduk, setKodeProduk] = React.useState("");
  const [namaProduk, setNamaProduk] = React.useState("");
  const [deskripsiProduk, setDeskripsiProduk] = React.useState("");
  const [kategoriId, setKategoriId] = React.useState("");
  const [satuanId, setSatuanId] = React.useState("");
  const [supplierId, setSupplierId] = React.useState("");

  const handleTambahProduk = async () => {
    const payload = {
      kode_produk: kodeProduk,
      nama_produk: namaProduk,
      deskripsi_produk: deskripsiProduk,
      is_aktif: true,
      kategori_id: kategoriId,
      satuan_produk_id: satuanId,
      supplier_id: supplierId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    try {
      const result = await tambahProduk(payload, {
        onSuccess,
        onError,
      });
      if (result.success) {
        setKodeProduk("");
        setNamaProduk("");
        setDeskripsiProduk("");
        setKategoriId("");
        setSatuanId("");
        setSupplierId("");
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
          <Label htmlFor="kategori-produk" className="text-center">
            Kategori Produk <i className="text-red-500">*</i>
          </Label>
          <Select
            onOpenChange={(isOpen) => setIsKategoriOpen(isOpen)}
            value={kategoriId}
            onValueChange={(value) => setKategoriId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kategori Produk" />
            </SelectTrigger>
            <SelectContent>
              {kategoriData?.map((kategori) => (
                <SelectItem key={kategori.id} value={kategori.id}>
                  {kategori.nama_kategori}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nama-produk" className="text-center">
            Nama Produk <i className="text-red-500">*</i>
          </Label>
          <Input
            id="nama-produk"
            value={namaProduk}
            onChange={(e) => setNamaProduk(e.target.value)}
            className="col-span-3"
            placeholder="Masukkan nama produk"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deskripsi-produk" className="text-center">
            Deskripsi Produk <i className="text-red-500">*</i>
          </Label>
          <Input
            id="deskripsi-produk"
            value={deskripsiProduk}
            onChange={(e) => setDeskripsiProduk(e.target.value)}
            className="col-span-3"
            placeholder="Masukkan deskripsi produk"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="satuan-produk" className="text-center">
            Satuan Produk <i className="text-red-500">*</i>
          </Label>
          <Select
            onOpenChange={(isOpen) => setIsSatuanOpen(isOpen)}
            value={satuanId}
            onValueChange={(value) => setSatuanId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Satuan Produk" />
            </SelectTrigger>
            <SelectContent>
              {satuanData?.map((satuan) => (
                <SelectItem key={satuan.id} value={satuan.id}>
                  {satuan.nama_satuan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="supplier-produk" className="text-center">
            Supplier Produk <i className="text-red-500">*</i>
          </Label>
          <Select
            onOpenChange={(isOpen) => setIsSupplierOpen(isOpen)}
            value={supplierId}
            onValueChange={(value) => setSupplierId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Supplier Produk" />
            </SelectTrigger>
            <SelectContent>
              {supplierData?.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.nama_supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="kode-produk" className="text-center">
            Kode Produk <i className="text-red-500">*</i>
          </Label>
          <Input
            id="kode-supplier"
            value={kodeProduk}
            onChange={(e) => setKodeProduk(e.target.value)}
            className="col-span-3"
            placeholder="Masukkan kode produk"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleTambahProduk}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Simpan"}
        </Button>
      </div>
    </>
  );
};

export default TambahProdukForm;
