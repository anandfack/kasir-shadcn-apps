"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { apiRequest } from "@/lib/apiRequest";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const UpdatePegawaiForm = ({ initialData, onSubmit, isLoading, onError }) => {
  /** =========================
   * Normalized initial data
   * ========================= */
  const normalizedInitialData = useMemo(() => {
    if (!initialData) return {};

    return {
      ...initialData,
      tanggal_lahir: formatDateForInput(initialData.tanggal_lahir),
      is_aktif: Boolean(initialData.is_aktif),
    };
  }, [initialData]);

  /** =========================
   * State
   * ========================= */
  const [formData, setFormData] = useState(normalizedInitialData);
  const [isChanged, setIsChanged] = useState(false);

  /** =========================
   * Sync initial data
   * ========================= */
  useEffect(() => {
    setFormData(normalizedInitialData);
  }, [normalizedInitialData]);

  /** =========================
   * Dirty check (accurate)
   * ========================= */
  useEffect(() => {
    const fields = [
      "nip_pegawai",
      "nama_pegawai",
      "tanggal_lahir",
      "jenis_kelamin",
      "alamat_pegawai",
      "nomor_telepon_pegawai",
      "email_pegawai",
      "jabatan_pegawai",
      "is_aktif",
    ];

    const hasChanged = fields.some(
      (key) => formData[key] !== normalizedInitialData[key]
    );

    setIsChanged(hasChanged);
  }, [formData, normalizedInitialData]);

  /** =========================
   * Handlers
   * ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (value) => {
    setFormData((prev) => ({ ...prev, is_aktif: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        nip_pegawai: formData.nip_pegawai,
        nama_pegawai: formData.nama_pegawai,
        tanggal_lahir: formData.tanggal_lahir,
        jenis_kelamin: formData.jenis_kelamin,
        alamat_pegawai: formData.alamat_pegawai,
        nomor_telepon_pegawai: formData.nomor_telepon_pegawai,
        email_pegawai: formData.email_pegawai,
        jabatan_pegawai: formData.jabatan_pegawai,
        is_aktif: formData.is_aktif,
      };

      const updatedData = await apiRequest(
        "PUT",
        `/api/v1/admin/pegawai/${formData.id}`,
        payload
      );

      setFormData({
        ...updatedData,
        tanggal_lahir: formatDateForInput(updatedData.tanggal_lahir),
        is_aktif: Boolean(updatedData.is_aktif),
      });

      onSubmit?.(updatedData);
    } catch (error) {
      onError?.(error);
      console.error("Error saat menyimpan data:", error);
    }
  };

  /** =========================
   * Render
   * ========================= */
  return (
    <div className="grid gap-4 py-4">
      {/* NIP */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          NIP Pegawai <i className="text-red-500">*</i>
        </Label>
        <Input
          name="nip_pegawai"
          value={formData.nip_pegawai || ""}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      {/* Nama */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Nama Pegawai <i className="text-red-500">*</i>
        </Label>
        <Input
          name="nama_pegawai"
          value={formData.nama_pegawai || ""}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      {/* Tanggal Lahir */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Tanggal Lahir <i className="text-red-500">*</i>
        </Label>
        <Input
          type="date"
          name="tanggal_lahir"
          value={formData.tanggal_lahir || ""}
          onChange={handleChange}
          max={new Date().toISOString().split("T")[0]}
          className="col-span-3"
        />
      </div>

      {/* Jenis Kelamin */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Jenis Kelamin <i className="text-red-500">*</i>
        </Label>
        <div className="col-span-3">
          <Select
            value={formData.jenis_kelamin || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, jenis_kelamin: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alamat */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Alamat Pegawai <i className="text-red-500">*</i>
        </Label>
        <Textarea
          name="alamat_pegawai"
          value={formData.alamat_pegawai || ""}
          onChange={handleChange}
          className="col-span-3 md:h-60"
        />
      </div>

      {/* Telepon */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Nomor Telepon <i className="text-red-500">*</i>
        </Label>
        <Input
          name="nomor_telepon_pegawai"
          value={formData.nomor_telepon_pegawai || ""}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      {/* Email */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Email <i className="text-red-500">*</i>
        </Label>
        <Input
          name="email_pegawai"
          value={formData.email_pegawai || ""}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      {/* Jabatan */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Jabatan <i className="text-red-500">*</i>
        </Label>
        <Input
          name="jabatan_pegawai"
          value={formData.jabatan_pegawai || ""}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>

      {/* Status */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">Status</Label>
        <Switch
          checked={formData.is_aktif}
          onCheckedChange={handleSwitchChange}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button disabled={!isChanged || isLoading} onClick={handleSubmit}>
          {isLoading ? "Loading..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
};

export default UpdatePegawaiForm;
