"use client";
import { React, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/apiRequest";
import { Loader2Icon, SaveIcon } from "lucide-react";

const AdminUpdateStokVariantForm = ({
  initialData,
  onSubmit,
  isLoading,
  onError,
}) => {
  const [formData, setFormData] = useState(initialData ?? {});
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    }
  }, [initialData]);

  useEffect(() => {
    setIsChanged(
      JSON.stringify(formData) !==
        JSON.stringify({
          ...initialData,
        }),
    );
  }, [formData, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        minimal_stok: Number(formData.minimal_stok),
        maksimal_stok: Number(formData.maksimal_stok),
      };

      const updatedData = await apiRequest(
        "PUT",
        `/api/v1/admin/stok-variant/${formData.id}`,
        dataToSend,
      );

      setFormData((prev) => ({
        ...prev,
        minimal_stok: updatedData.minimal_stok,
        maksimal_stok: updatedData.maksimal_stok,
      }));

      if (onSubmit) onSubmit(updatedData);
    } catch (error) {
      if (onError) onError(error);
      console.error("Error saat menyimpan data:", error);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Minimal Stok */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="minimal-stok" className="text-center">
          Minimal Stok <i className="text-red-500">*</i>
        </Label>

        <Input
          type="text"
          inputMode="numeric"
          name="minimal_stok"
          value={formData.minimal_stok ?? ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // hanya angka

            setFormData((prev) => ({
              ...prev,
              minimal_stok: value,
            }));
          }}
          className="col-span-3"
          placeholder="Masukkan minimal stok"
        />
      </div>

      {/* Maksimal Stok */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="maksimal-stok" className="text-center">
          Maksimal Stok <i className="text-red-500">*</i>
        </Label>

        <Input
          type="text"
          inputMode="numeric"
          name="maksimal_stok"
          value={formData.maksimal_stok ?? ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // hanya angka

            setFormData((prev) => ({
              ...prev,
              maksimal_stok: value,
            }));
          }}
          className="col-span-3"
          placeholder="Masukkan maksimal stok"
        />
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={
            !isChanged ||
            isLoading ||
            formData.minimal_stok === "" ||
            formData.maksimal_stok === ""
          }
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

export default AdminUpdateStokVariantForm;
