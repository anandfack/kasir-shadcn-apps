"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/apiRequest";
import { Textarea } from "@/components/ui/textarea";

const UpdateSupplierForm = ({ initialData, onSubmit, isLoading, onError }) => {
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
        kode_supplier: formData.kode_supplier,
        nama_supplier: formData.nama_supplier,
        alamat_supplier: formData.alamat_supplier,
        nomor_telepon_supplier: formData.nomor_telepon_supplier,
      };

      // Menggunakan apiRequest untuk update harga produk
      const updatedData = await apiRequest(
        "PUT",
        `/api/v1/admin/supplier/${formData.id}`,
        dataToSend
      );

      // Update state dengan data baru
      setFormData((prev) => ({
        ...prev,
        kode_supplier: updatedData.kode_supplier,
        nama_supplier: updatedData.nama_supplier,
        alamat_supplier: updatedData.alamat_supplier,
        nomor_telepon_supplier: updatedData.nomor_telepon_supplier,
      }));

      if (onSubmit) onSubmit(updatedData);
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      onError?.(error);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Kode Supplier */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="kode-supplier" className="text-center">
          Kode Supplier <i className="text-red-500">*</i>
        </Label>
        <Input
          type="text"
          name="kode_supplier"
          value={formData.kode_supplier || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              kode_supplier: e.target.value,
            }))
          }
          className="col-span-3"
          placeholder="Masukkan supplier"
        />
      </div>

      {/* Nama Supplier */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nama-supplier" className="text-center">
          Nama Supplier <i className="text-red-500">*</i>
        </Label>
        <Input
          type="text"
          name="nama_supplier"
          value={formData.nama_supplier || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, nama_supplier: e.target.value }))
          }
          className="col-span-3"
          placeholder="Masukkan nama supplier"
        />
      </div>

      {/* Alamat Supplier */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="alamat-supplier" className="text-center">
          Alamat Supplier <i className="text-red-500">*</i>
        </Label>
        <Textarea
          type="text"
          name="alamat_supplier"
          value={formData.alamat_supplier || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              alamat_supplier: e.target.value,
            }))
          }
          className="col-span-3"
          placeholder="Masukkan alamat supplier"
        />
      </div>

      {/* Nomor Telepon Supplier */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nomor-telepon-supplier" className="text-center">
          Nomor Telepon Supplier <i className="text-red-500">*</i>
        </Label>
        <Textarea
          type="text"
          name="nomor_telepon_supplier"
          value={formData.nomor_telepon_supplier || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              nomor_telepon_supplier: e.target.value,
            }))
          }
          className="col-span-3"
          placeholder="Masukkan nomor telepon supplier"
        />
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!isChanged || isLoading}>
          {isLoading ? "Loading..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
};

export default UpdateSupplierForm;
