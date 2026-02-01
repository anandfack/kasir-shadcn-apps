"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const AdminPenyesuaianStokVariantForm = ({
  initialData,
  onSubmit,
  onError,
}) => {
  const [stokFisik, setStokFisik] = useState("");
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);

  const stokSistem = initialData?.jumlah_stok ?? 0;
  const selisih = stokFisik !== "" ? Number(stokFisik) - stokSistem : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (stokFisik === "") {
      onError?.("Stok fisik wajib diisi");
      return;
    }

    if (selisih === 0) {
      onError?.("Tidak ada selisih stok");
      return;
    }

    if (!alasan) {
      onError?.("Alasan penyesuaian wajib dipilih");
      return;
    }

    try {
      setLoading(true);

      await apiRequest("POST", "/api/v1/admin/stok-variant/penyesuaian", {
        produk_variant_id: initialData.id,
        stok_fisik: Number(stokFisik),
        keterangan_mutasi: alasan,
      });

      setStokFisik("");
      setAlasan("");
      onSubmit?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">Produk</Label>
        <Input
          value={initialData?.nama_produk ?? ""}
          disabled
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">Stok Sistem</Label>
        <Input value={stokSistem} disabled className="col-span-3" />
      </div>

      {/* Stok Fisik */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Stok Fisik <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={stokFisik}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setStokFisik(value);
            }
          }}
          className="col-span-3"
          placeholder="Masukkan stok fisik"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">Selisih</Label>
        <Input
          value={selisih}
          disabled
          className={`col-span-3 ${
            selisih < 0 ? "text-red-600" : selisih > 0 ? "text-green-600" : ""
          }`}
        />
      </div>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="jenis-kelamin" className="text-center">
            Jenis Kelamin <i className="text-red-500">*</i>
          </Label>

          <div className="col-span-3">
            <Select value={alasan} onValueChange={setAlasan}>
              <SelectTrigger id="alasan">
                <SelectValue placeholder="Pilih alasan" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="OPNAME">Stok Opname</SelectItem>
                  <SelectItem value="RUSAK">Barang Rusak</SelectItem>
                  <SelectItem value="HILANG">Barang Hilang</SelectItem>
                  <SelectItem value="KOREKSI">Koreksi Sistem</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4 text-sm text-right min-h-[20px]">
          {selisih !== 0 &&
            (selisih > 0 ? "➕ Penambahan stok" : "➖ Pengurangan stok")}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading || selisih === 0}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
};

export default AdminPenyesuaianStokVariantForm;
