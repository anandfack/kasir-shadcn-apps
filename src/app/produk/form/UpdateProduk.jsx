"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateProduk } from "@/hooks/produk/useUpdateProduk";

const UpdateProdukForm = ({ initialData, onSuccess, onError }) => {
  const { updateProduk, isLoading, error } = useUpdateProduk();
  const [formData, setFormData] = React.useState(initialData || {});

  console.log("ini adalah initialData:", initialData);

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle switch change
  const handleSwitchChange = (value) => {
    setFormData((prev) => ({ ...prev, is_aktif: value }));
  };

  const handleSubmit = async () => {
    await updateProduk(formData.id, formData, {
      onSuccess,
      onError,
    });
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="kategori-produk" className="text-center">
            Kategori Produk <i className="text-red-500">*</i>
          </Label>
          <Select>
            <SelectTrigger className="w-[630px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value={formData.kategori.nama_kategori || "default-value"}
                >
                  {formData.kategori.nama_kategori || "Contoh Kategori Produk"}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="satuan-produk" className="text-center">
            Satuan Produk <i className="text-red-500">*</i>
          </Label>
          <Select>
            <SelectTrigger className="w-[630px]">
              <SelectValue placeholder="Pilih Satuan Produk" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="contoh-kategori">
                  Contoh Satuan Produk
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="kode-produk" className="text-center">
            Kode Produk <i className="text-red-500">*</i>
          </Label>
          <Input
            id="kode-produk"
            name="kode_produk"
            value={formData.kode_produk || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan kode produk"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nama-produk" className="text-center">
            Nama Produk <i className="text-red-500">*</i>
          </Label>
          <Input
            id="nama-produk"
            name="nama_produk"
            value={formData.nama_produk || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan nama produk"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deskripsi-produk" className="text-center">
            Deskripsi Produk <i className="text-red-500">*</i>
          </Label>
          <Textarea
            id="deskripsi-produk"
            name="deskripsi_produk"
            value={formData.deskripsi_produk || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan deskripsi produk"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-center">
            Status
          </Label>
          <Switch
            id="status"
            checked={formData.is_aktif || false}
            onCheckedChange={handleSwitchChange}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} variant="outline" disabled={isLoading}>
          {isLoading ? "Loading..." : "Simpan"}
        </Button>
      </div>
    </>
  );
};

export default UpdateProdukForm;
