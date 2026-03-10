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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2Icon, SaveIcon } from "lucide-react";

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const UpdatePegawaiForm = ({ initialData, onSubmit, isLoading, onError }) => {
  const normalizedInitialData = useMemo(() => {
    if (!initialData) return {};

    return {
      ...initialData,
      tanggal_lahir: formatDateForInput(initialData.tanggal_lahir),
      is_aktif: Boolean(initialData.is_aktif),
    };
  }, [initialData]);

  const [formData, setFormData] = useState(normalizedInitialData);
  const [isChanged, setIsChanged] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  useEffect(() => {
    setFormData(normalizedInitialData);
  }, [normalizedInitialData]);

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
      (key) => formData[key] !== normalizedInitialData[key],
    );

    setIsChanged(hasChanged);
  }, [formData, normalizedInitialData]);

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
        payload,
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
        <Label htmlFor="tanggal-lahir" className="text-center">
          Tanggal Lahir <i className="text-red-500">*</i>
        </Label>

        <Popover
          open={openCalendar}
          onOpenChange={setOpenCalendar}
          modal={false}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="col-span-3 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-sky-500" />

              {formData.tanggal_lahir
                ? format(new Date(formData.tanggal_lahir), "dd MMMM yyyy", {
                    locale: id,
                  })
                : "Pilih tanggal"}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" sideOffset={8} className="w-auto p-0">
            <Calendar
              mode="single"
              locale={id}
              selected={
                formData.tanggal_lahir
                  ? new Date(formData.tanggal_lahir)
                  : undefined
              }
              captionLayout="dropdown"
              fromYear={1945}
              toYear={new Date().getFullYear()}
              disabled={{ after: new Date() }}
              onSelect={(date) => {
                if (!date) return;

                setFormData((prev) => ({
                  ...prev,
                  tanggal_lahir: date.toISOString().split("T")[0],
                }));

                setOpenCalendar(false); // tutup setelah pilih
              }}
              initialFocus
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* <div className="grid grid-cols-4 items-center gap-4">
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
      </div> */}

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
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            setFormData((prev) => ({
              ...prev,
              nomor_telepon_pegawai: value,
            }));
          }}
          name="nomor_telepon_pegawai"
          value={formData.nomor_telepon_pegawai || ""}
          // onChange={handleChange}
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

export default UpdatePegawaiForm;
