"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useUpdateSupplier } from "@/hooks/supplier/useUpdateSupplier";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const UpdateSupplierForm = ({ initialData, onSuccess, onError }) => {
  const { updateSupplier, isLoading, error } = useUpdateSupplier();
  const [formData, setFormData] = React.useState(initialData || {});

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
    await updateSupplier(formData.id, formData, {
      onSuccess,
      onError,
    });
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="kode-supplier" className="text-center">
            Kode Supplier <i className="text-red-500">*</i>
          </Label>
          <Input
            id="kode-supplier"
            name="kode_supplier"
            value={formData.kode_supplier || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan kode supplier"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nama-supplier" className="text-center">
            Nama Supplier <i className="text-red-500">*</i>
          </Label>
          <Input
            id="nama-supplier"
            name="nama_supplier"
            value={formData.nama_supplier || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan nama supplier"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="alamat-supplier" className="text-center">
            Alamat Supplier <i className="text-red-500">*</i>
          </Label>
          <Textarea
            id="alamat-supplier"
            name="alamat_supplier"
            value={formData.alamat_supplier || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan alamat supplier"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nomor-telepon-supplier" className="text-center">
            Nomor Telepon Supplier <i className="text-red-500">*</i>
          </Label>
          <Input
            id="nomor-telepon-supplier"
            name="nomor_telepon_supplier"
            type="number"
            value={formData.nomor_telepon_supplier || ""}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan nomor telepon supplier"
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

export default UpdateSupplierForm;
