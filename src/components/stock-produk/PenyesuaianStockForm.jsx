"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/app/utils/fetchOptions";

const PenyesuaianStockForm = ({
  initialData, // { produk_id, nama_produk, jumlah_stok }
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

      await apiRequest("POST", "/api/v1/admin/stok/penyesuaian", {
        produk_id: initialData.produk_id,
        stok_fisik: Number(stokFisik),
        alasan,
      });

      setStokFisik("");
      setAlasan("");

      onSubmit?.();
    } catch (error) {
      console.error(error);
      onError?.(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
      {/* Produk */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">Produk</Label>
        <Input
          value={initialData?.nama_produk ?? ""}
          disabled
          className="col-span-3"
        />
      </div>

      {/* Stok Sistem */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">Stok Sistem</Label>
        <Input value={stokSistem} disabled className="col-span-3" />
      </div>

      {/* Stok Fisik */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Stok Fisik <i className="text-red-500">*</i>
        </Label>
        <Input
          type="number"
          min={0}
          value={stokFisik}
          onChange={(e) => setStokFisik(e.target.value)}
          className="col-span-3"
          placeholder="Masukkan stok fisik"
        />
      </div>

      {/* Selisih */}
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

      {/* Alasan */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-center">
          Alasan <i className="text-red-500">*</i>
        </Label>
        <select
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          className="col-span-3 border rounded px-3 py-2"
        >
          <option value="">-- Pilih alasan --</option>
          <option value="RUSAK">Barang rusak</option>
          <option value="HILANG">Barang hilang</option>
          <option value="KOREKSI">Koreksi stok</option>
          <option value="OPNAME">Stok opname</option>
        </select>
      </div>

      {/* Tombol */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Penyesuaian"}
        </Button>
      </div>
    </form>
  );
};

export default PenyesuaianStockForm;
