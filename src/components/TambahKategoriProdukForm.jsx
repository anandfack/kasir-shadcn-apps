// import React from "react";
// import { DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import axios from "axios";

// const TambahKategoriProdukForm = () => {
//   const [kodeKategori, setKodeKategori] = React.useState("");
//   const [namaKategori, setNamaKategori] = React.useState("");
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [error, setError] = React.useState(null);

//   const handleTambahKategoriProduk = async () => {
//     setIsLoading(true);
//     setError(null);

//     if (!kodeKategori || !namaKategori) {
//       setError("Kode kategori dan nama kategori harus diisi");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("kode_kategori", kodeKategori);
//       formData.append("nama_kategori", namaKategori);
//       formData.append("created_at", new Date().toISOString());
//       formData.append("updated_at", new Date().toISOString());

//       await axios.post("/api/kategori-produk", { kodeKategori, namaKategori });
//       setKodeKategori("");
//       setNamaKategori("");
//     } catch (err) {
//       setError(err.message || "Terjadi kesalahan");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="grid gap-4 py-4">
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="kode-kategori" className="text-center">
//             Kode Kategori
//           </Label>
//           <Input
//             required
//             id="kode-kategori"
//             value={kodeKategori}
//             onChange={(e) => setKodeKategori(e.target.value)}
//             className="col-span-3"
//           />
//         </div>
//         <div className="grid grid-cols-4 items-center gap-4">
//           <Label htmlFor="nama-kategori" className="text-center">
//             Nama Kategori
//           </Label>
//           <Input
//             required
//             id="nama-kategori"
//             value={namaKategori}
//             onChange={(e) => setNamaKategori(e.target.value)}
//             className="col-span-3"
//           />
//         </div>
//         {error && <p className="text-red-500">{error}</p>}
//       </div>
//       <DialogFooter>
//         <Button
//           onClick={() => handleTambahKategoriProduk()}
//           variant="outline"
//           className="mr-2"
//           disabled={isLoading}
//         >
//           {isLoading ? "Menyimpan..." : "Simpan"}
//         </Button>
//       </DialogFooter>
//     </>
//   );
// };

// export default TambahKategoriProdukForm;

"use client"; // Pastikan untuk menambahkan directive ini di file komponen

import React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TambahKategoriProdukForm = () => {
  const [kodeKategori, setKodeKategori] = React.useState("");
  const [namaKategori, setNamaKategori] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleTambahKategoriProduk = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        kode_kategori: kodeKategori,
        nama_kategori: namaKategori,
        created_at: new Date().toISOString(), // Atau null jika tidak diperlukan
        updated_at: new Date().toISOString(), // Atau null jika tidak diperlukan
      };

      const response = await axios.post("/api/kategori-produk", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Kategori berhasil ditambahkan:", response.data);
      setKodeKategori("");
      setNamaKategori("");
    } catch (error) {
      console.error("Error saat menambahkan kategori:", error);
      setError(error.response?.data?.error || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="kode-kategori" className="text-center">
            Kode Kategori
          </Label>
          <Input
            required
            id="kode-kategori"
            value={kodeKategori}
            onChange={(e) => setKodeKategori(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nama-kategori" className="text-center">
            Nama Kategori
          </Label>
          <Input
            required
            id="nama-kategori"
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleTambahKategoriProduk}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Simpan"}
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};

export default TambahKategoriProdukForm;
