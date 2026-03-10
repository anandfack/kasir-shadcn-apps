"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/apiRequest";
import { Switch } from "../ui/switch";
import { Loader2Icon, SaveIcon } from "lucide-react";

const AdminUpdateProdukVariantForm = ({
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
        }),
    );
  }, [formData, initialData]);

  const handleSwitchChange = (value) => {
    setFormData((prev) => ({ ...prev, is_aktif: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        sku: formData.sku,
        ukuran: formData.ukuran,
        warna: formData.warna,
        is_aktif: formData.is_aktif,
      };

      // Menggunakan apiRequest untuk update harga produk
      const updatedData = await apiRequest(
        "PUT",
        `/api/v1/admin/produk-variant/${formData.id}`,
        dataToSend,
      );

      // Update state dengan data baru
      setFormData((prev) => ({
        ...prev,
        sku: updatedData.sku,
        ukuran: updatedData.ukuran,
        warna: updatedData.warna,
        is_aktif: updatedData.is_aktif,
      }));

      if (onSubmit) onSubmit(updatedData);
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      onError?.(error);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Kode Kategori */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="sku" className="text-center">
          SKU <i className="text-red-500">*</i>
        </Label>
        <Input
          type="text"
          name="sku"
          value={formData.sku || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              sku: e.target.value,
            }))
          }
          className="col-span-3"
          placeholder="Masukkan SKU"
        />
      </div>

      {/* Ukuran */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="ukuran" className="text-center">
          Ukuran <i className="text-red-500">*</i>
        </Label>
        <Input
          type="text"
          name="ukuran"
          value={formData.ukuran || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, ukuran: e.target.value }))
          }
          className="col-span-3"
          placeholder="Masukkan ukuran"
        />
      </div>

      {/* Warna */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="warna" className="text-center">
          Warna <i className="text-red-500">*</i>
        </Label>
        <Input
          type="text"
          name="warna"
          value={formData.warna || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, warna: e.target.value }))
          }
          className="col-span-3"
          placeholder="Masukkan warna"
        />
      </div>

      {/* Status Produk */}
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

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isChanged || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <SaveIcon className="w-4 h-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminUpdateProdukVariantForm;
