"use client";

import axios from "axios";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export const useUpdateKategoriProduk = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const updateKategoriProduk = async (id, payload, { onSuccess, onError }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`/api/kategori-produk/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Kategori berhasil diupdate:", response.data);
      if (onSuccess) onSuccess(response.data);
      toast({
        title: "Data berhasil diupdate",
        description: "Kategori produk berhasil diupdate!",
        variant: "primary",
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.log("Error saat mengupdate kategori:", error);
      if (onError) onError(error);
      toast({
        title: "Terjadi kesalahan",
        description: error?.response?.data?.error || "Terjadi kesalahan",
        variant: "destructive",
      });
      setError(error);
      return { success: false, error: error?.response?.data?.error };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateKategoriProduk, isLoading, error };
};
