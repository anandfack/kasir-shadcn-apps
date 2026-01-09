"use client";

import { React, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/apiRequest";

const TambahPegawaiForm = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [nipPegawai, setNipPegawai] = useState("");
  const [namaPegawai, setNamaPegawai] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [alamatPegawai, setAlamatPegawai] = useState("");
  const [nomorTeleponPegawai, setNomorTeleponPegawai] = useState("");
  const [emailPegawai, setEmailPegawai] = useState("");
  const [jabatanPegawai, setJabatanPegawai] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest("POST", "/api/v1/admin/pegawai", {
        nip_pegawai: nipPegawai,
        nama_pegawai: namaPegawai,
        tanggal_lahir: tanggalLahir,
        jenis_kelamin: jenisKelamin,
        alamat_pegawai: alamatPegawai,
        nomor_telepon_pegawai: nomorTeleponPegawai,
        email_pegawai: emailPegawai,
        jabatan_pegawai: jabatanPegawai,
      });

      onSuccess();
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Tambah Pegawai</DialogTitle>
        <DialogDescription>
          Tambahkan pegawai baru ke dalam daftar.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nip-pegawai" className="text-center">
              NIP Pegawai <i className="text-red-500">*</i>
            </Label>
            <Input
              id="nip-pegawai"
              value={nipPegawai}
              onChange={(e) => setNipPegawai(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan NIP pegawai"
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama-pegawai" className="text-center">
              Nama Pegawai <i className="text-red-500">*</i>
            </Label>
            <Input
              id="nama-pegawai"
              value={namaPegawai}
              onChange={(e) => setNamaPegawai(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan nama pegawai"
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tanggal-lahir" className="text-center">
              Tanggal Lahir <i className="text-red-500">*</i>
            </Label>
            <Input
              id="tanggal-lahir"
              type="date"
              value={tanggalLahir}
              onChange={(e) => setTanggalLahir(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan tanggal lahir pegawai"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jenis-kelamin" className="text-center">
              Jenis Kelamin <i className="text-red-500">*</i>
            </Label>

            <div className="col-span-3">
              <Select
                value={jenisKelamin}
                onValueChange={(value) => setJenisKelamin(value)}
              >
                <SelectTrigger id="jenis-kelamin">
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
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="alamat-pegawai" className="text-center">
            Alamat Pegawai <i className="text-red-500">*</i>
          </Label>
          <Textarea
            id="alamat-pegawai"
            value={alamatPegawai}
            onChange={(e) => setAlamatPegawai(e.target.value)}
            className="col-span-3 md:h-60"
            placeholder="Masukkan alamat pegawai"
          />
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nomor-telepon-pegawai" className="text-center">
              Nomor Telepon <i className="text-red-500">*</i>
            </Label>
            <Input
              id="nomor-telepon-pegawai"
              value={nomorTeleponPegawai}
              onChange={(e) => setNomorTeleponPegawai(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan nomor telepon pegawai"
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email-pegawai" className="text-center">
              Email <i className="text-red-500">*</i>
            </Label>
            <Input
              id="email-pegawai"
              value={emailPegawai}
              onChange={(e) => setEmailPegawai(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan email pegawai"
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jabatan-pegawai" className="text-center">
              Jabatan <i className="text-red-500">*</i>
            </Label>
            <Input
              id="jabatan-pegawai"
              value={jabatanPegawai}
              onChange={(e) => setJabatanPegawai(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan jabatan pegawai"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} variant="outline" disabled={loading}>
            {loading ? "Loading..." : "Simpan"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default TambahPegawaiForm;
