"use client";

import { useState } from "react";
import HargaProdukDialog from "./HargaProdukDialog";
import HargaProdukActions from "./HargaProdukActions";
import useFetchHargaProduk from "@/hooks/harga-produk/useFetchHargaProduk";

const HargaProdukTable = () => {
  const { data, loading, error } = useFetchHargaProduk("/api/v1/harga-produk");
  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <table className="w-full border border-collapse">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((hargaProduk) => (
            <tr key={hargaProduk.id}>
              <td>{hargaProduk.nama}</td>
              <td>{hargaProduk.kategori}</td>
              <td>{hargaProduk.harga}</td>
              <td>
                <HargaProdukActions
                  onEdit={() => {
                    setEditData(hargaProduk);
                    setIsDialogUpdateOpen(true);
                  }}
                  onDelete={() => console.log("Hapus", hargaProduk.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <HargaProdukDialog
        isOpen={isDialogUpdateOpen}
        onOpenChange={setIsDialogUpdateOpen}
        title="Ubah Produk"
        description="Modifikasi produk."
      >
        {editData && <p>Form Edit Produk (Belum dibuat)</p>}
      </HargaProdukDialog>
    </div>
  );
};

export default HargaProdukTable;
