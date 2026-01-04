"use client";
import { React, useState, useEffect } from "react";
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UpdatePegawaiForm = ({ initialData, onSubmit, isLoading, onError }) => {
  const [formData, setFormData] = useState(initialData ?? {});
  const [isChanged, setIsChanged] = useState(false);

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tanggal_lahir: formatDateForInput(initialData.tanggal_lahir),
      });
    }
  }, [initialData]);

  useEffect(() => {
    setIsChanged(
      JSON.stringify(formData) !==
        JSON.stringify({
          ...initialData,
        })
    );
  }, [formData, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (value) => {
    setFormData((prev) => ({ ...prev, is_aktif: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
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
        dataToSend
      );

      console.log("Data berhasil disimpan:", updatedData);

      setFormData((prev) => ({
        ...prev,
        nip_pegawai: updatedData.nip_pegawai,
        nama_pegawai: updatedData.nama_pegawai,
        tanggal_lahir: updatedData.tanggal_lahir,
        jenis_kelamin: updatedData.jenis_kelamin,
        alamat_pegawai: updatedData.alamat_pegawai,
        nomor_telepon_pegawai: updatedData.nomor_telepon_pegawai,
        email_pegawai: updatedData.email_pegawai,
        jabatan_pegawai: updatedData.jabatan_pegawai,
      }));

      if (onSubmit) onSubmit(updatedData);
    } catch (error) {
      onError;
      console.error("Error saat menyimpan data:", error);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      {/* NIP Pegawai */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nip-pegawai" className="text-center">
          NIP Pegawai <i className="text-red-500">*</i>
        </Label>
        <Input
          name="nip_pegawai"
          value={formData.nip_pegawai || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan NIP pegawai"
        />
      </div>
      {/* Nama Pegawai */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nama-pegawai" className="text-center">
          Nama Pegawai <i className="text-red-500">*</i>
        </Label>
        <Input
          name="nama_pegawai"
          value={formData.nama_pegawai || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan nama pegawai"
        />
      </div>
      {/* Tanggal lahir */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tanggal-lahir" className="text-center">
          Tanggal Lahir <i className="text-red-500">*</i>
        </Label>
        <Input
          name="tanggal_lahir"
          value={formData.tanggal_lahir || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan tanggal lahir pegawai"
          type="date"
        />
      </div>
      {/* Jenis Kelamin */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="jenis-kelamin" className="text-center">
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
                <SelectLabel>Jenis Kelamin</SelectLabel>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Alamat Pegawai */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="alamat-pegawai" className="text-center">
          Alamat Pegawai <i className="text-red-500">*</i>
        </Label>
        <Textarea
          name="alamat_pegawai"
          value={formData.alamat_pegawai || ""}
          onChange={handleChange}
          className="col-span-3 md:h-60"
          placeholder="Masukkan alamat pegawai"
        />
      </div>
      {/* Nomor Telepon Pegawai */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nomor-telepon-pegawai" className="text-center">
          Nomor Telepon Pegawai <i className="text-red-500">*</i>
        </Label>
        <Input
          name="nomor_telepon_pegawai"
          value={formData.nomor_telepon_pegawai || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan nomor telepon pegawai"
        />
      </div>
      {/* Email Pegawai */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email-pegawai" className="text-center">
          Email Pegawai <i className="text-red-500">*</i>
        </Label>
        <Input
          name="email_pegawai"
          value={formData.email_pegawai || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan email pegawai"
        />
      </div>
      {/* Jabatan Pegawai */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="jabatan-pegawai" className="text-center">
          Jabatan Pegawai <i className="text-red-500">*</i>
        </Label>
        <Input
          name="jabatan_pegawai"
          value={formData.jabatan_pegawai || ""}
          onChange={handleChange}
          className="col-span-3"
          placeholder="Masukkan jabatan pegawai"
        />
      </div>

      {/* Status Pegawai */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-center">
          Status
        </Label>
        <Switch
          id="status"
          checked={formData.is_aktif || false}
          onCheckedChange={handleSwitchChange}
        />
        <Label>{formData.is_aktif ? "Aktif" : "Nonaktif"}</Label>
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

export default UpdatePegawaiForm;
