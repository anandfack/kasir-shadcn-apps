"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/apiRequest";
// import { apiRequest } from "@/app/utils/fetchOptions";

const UpdateKategoriProdukForm = ({
  initialData,
  onSubmit,
  isLoading,
  onError,
}) => {
  const [formData, setFormData] = React.useState(initialData ?? {});
  const [isChanged, setIsChanged] = React.useState(false);

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    }
  }, [initialData]);

  React.useEffect(() => {
    setIsChanged(
      JSON.stringify(formData) !==
        JSON.stringify({
          ...initialData,
        })
    );
  }, [formData, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        kode_kategori: formData.kode_kategori,
        nama_kategori: formData.nama_kategori,
      };

      // Menggunakan apiRequest untuk update harga produk
      const updatedData = await apiRequest(
        "PUT",
        `/api/v1/admin/kategori-produk/${formData.id}`,
        dataToSend
      );

      console.log("Data berhasil disimpan:", updatedData);

      // Update state dengan data baru
      setFormData((prev) => ({
        ...prev,
        kode_kategori: updatedData.kode_kategori,
        nama_kategori: updatedData.nama_kategori,
      }));

      if (onSubmit) onSubmit(updatedData);
    } catch (error) {
      onError;
      console.error("Error saat menyimpan data:", error);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Kode Kategori */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="kode-kategori" className="text-center">
          Kategori Produk <i className="text-red-500">*</i>
        </Label>
        <Input
          type="text"
          name="kode_kategori"
          value={formData.kode_kategori || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              kode_kategori: e.target.value,
            }))
          }
          className="col-span-3"
          placeholder="Masukkan kategori produk"
        />
      </div>

      {/* Nama Kategori */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nama kategori" className="text-center">
          Nama Kategori <i className="text-red-500">*</i>
        </Label>
        <Input
          type="text"
          name="nama_kategori"
          value={formData.nama_kategori || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, nama_kategori: e.target.value }))
          }
          className="col-span-3"
          placeholder="Masukkan nama kategori"
        />
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!isChanged || isLoading}>
          {isLoading ? "Loading..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
};

export default UpdateKategoriProdukForm;
