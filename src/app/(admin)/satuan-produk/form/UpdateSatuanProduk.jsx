"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useUpdateSatuanProduk } from "@/hooks/satuan-produk/useUpdateSatuanProduk";

const UpdateSatuanProdukForm = ({ initialData, onSuccess, onError }) => {
  const { updateSatuanProduk, isLoading, error } = useUpdateSatuanProduk();
  const [formData, setFormData] = React.useState(initialData || {});

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await updateSatuanProduk(formData.id, formData, {
      onSuccess,
      onError,
    });
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
            name="kode_satuan"
            value={formData.kode_satuan || ""}
            onChange={handleChange}
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
            name="nama_satuan"
            value={formData.nama_satuan || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan nama satuan"
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

export default UpdateSatuanProdukForm;
