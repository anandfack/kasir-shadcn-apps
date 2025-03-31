"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/app/utils/fetchOptions";

const UpdateHargaProdukForm = ({
  produkData,
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
        produk: initialData.produk?.id || "",
      });
    }
  }, [initialData]);

  React.useEffect(() => {
    setIsChanged(
      JSON.stringify(formData) !==
        JSON.stringify({
          ...initialData,
          produk: initialData?.produk?.id || "",
        })
    );
  }, [formData, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        harga_beli: parseFloat(formData.harga_beli),
        harga_jual: parseFloat(formData.harga_jual),
      };

      // Menggunakan apiRequest untuk update harga produk
      const updatedData = await apiRequest(
        "PUT",
        `/api/v1/harga-produk/${formData.id}`,
        dataToSend
      );

      console.log("Data berhasil disimpan:", updatedData);

      // Update state dengan data baru
      setFormData((prev) => ({
        ...prev,
        produk: updatedData.produk_id,
        harga_beli: updatedData.harga_beli.toFixed(2),
        harga_jual: updatedData.harga_jual.toFixed(2),
      }));

      if (onSubmit) onSubmit(updatedData);
    } catch (error) {
      onError;
      console.error("Error saat menyimpan data:", error);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Harga Beli */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="harga-beli" className="text-center">
          Harga Beli <i className="text-red-500">*</i>
        </Label>
        <Input
          type="number"
          name="harga_beli"
          value={formData.harga_beli || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, harga_beli: e.target.value }))
          }
          className="col-span-3"
          placeholder="Masukkan harga beli"
        />
      </div>

      {/* Harga Jual */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="harga-jual" className="text-center">
          Harga Jual <i className="text-red-500">*</i>
        </Label>
        <Input
          type="number"
          name="harga_jual"
          value={formData.harga_jual || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, harga_jual: e.target.value }))
          }
          className="col-span-3"
          placeholder="Masukkan harga jual"
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

export default UpdateHargaProdukForm;
