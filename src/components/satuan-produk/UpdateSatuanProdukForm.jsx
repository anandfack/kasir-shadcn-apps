"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/app/utils/fetchOptions";

const UpdateSatuanProdukForm = ({
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
        // produk: initialData.produk?.id || "",
      });
    }
  }, [initialData]);

  React.useEffect(() => {
    setIsChanged(
      JSON.stringify(formData) !==
        JSON.stringify({
          ...initialData,
          // produk: initialData?.produk?.id || "",
        })
    );
  }, [formData, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        // harga_beli: parseFloat(formData.harga_beli),
        // harga_jual: parseFloat(formData.harga_jual),
        kode_satuan: formData.kode_satuan,
        nama_satuan: formData.nama_satuan,
      };

      // Menggunakan apiRequest untuk update harga produk
      const updatedData = await apiRequest(
        "PUT",
        `/api/v1/admin/satuan-produk/${formData.id}`,
        dataToSend
      );

      console.log("Data berhasil disimpan:", updatedData);

      // Update state dengan data baru
      setFormData((prev) => ({
        ...prev,
        // produk: updatedData.produk_id,
        // harga_beli: updatedData.harga_beli.toFixed(2),
        // harga_jual: updatedData.harga_jual.toFixed(2),
        kode_satuan: updatedData.kode_satuan,
        nama_satuan: updatedData.nama_satuan,
      }));

      if (onSubmit) onSubmit(updatedData);
    } catch (error) {
      onError;
      console.error("Error saat menyimpan data:", error);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Kode Satuan */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="kode-satuan" className="text-center">
          Kode Satuan <i className="text-red-500">*</i>
        </Label>
        <Input
          type="text"
          name="kode_satuan"
          value={formData.kode_satuan || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              kode_satuan: e.target.value,
            }))
          }
          className="col-span-3"
          placeholder="Masukkan satuan produk"
        />
      </div>

      {/* Nama Satuan */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nama-satuan" className="text-center">
          Nama Satuan <i className="text-red-500">*</i>
        </Label>
        <Input
          type="text"
          name="nama_satuan"
          value={formData.nama_satuan || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, nama_satuan: e.target.value }))
          }
          className="col-span-3"
          placeholder="Masukkan nama satuan"
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

export default UpdateSatuanProdukForm;
