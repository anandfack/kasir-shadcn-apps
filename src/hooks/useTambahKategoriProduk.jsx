"use client";
import axios from "axios";

import React from "react";

import { useToast } from "@/hooks/use-toast";

export const useTambahKategoriProduk = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const tambahKategoriProduk = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/kategori-produk", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Kategori berhasil ditambahkan:", response.data);

      toast({
        title: "Data berhasil ditambahkan",
        description: "Kategori produk berhasil ditambahkan!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saat menambahkan kategori:", error);

      toast({
        title: "Terjadi kesalahan",
        description: error?.response?.data?.error || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { tambahKategoriProduk, isLoading, error };
};
