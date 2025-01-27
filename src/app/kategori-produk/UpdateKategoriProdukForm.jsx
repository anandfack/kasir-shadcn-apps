"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useUpdateKategoriProduk } from "@/hooks/useUpdateKategoriProduk";

const UpdateKategoriProdukForm = ({ initialData, onSuccess, onError }) => {
  const { updateKategoriProduk, isLoading, error } = useUpdateKategoriProduk();
  const [formData, setFormData] = React.useState(initialData || {});

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await updateKategoriProduk(formData.id, formData, {
      onSuccess,
      onError,
    });
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
            name="kode_kategori"
            value={formData.kode_kategori || ""}
            onChange={handleChange}
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
            name="nama_kategori"
            value={formData.nama_kategori || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan nama kategori"
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

export default UpdateKategoriProdukForm;
