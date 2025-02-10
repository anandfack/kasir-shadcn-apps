"use client";

import axios from "axios";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export const useUpdateSatuanProduk = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const updateSatuanProduk = async (id, payload, { onSuccess, onError }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`/api/v1/satuan-produk/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Satuan produk berhasil diupdate:", response.data);
      if (onSuccess) onSuccess(response.data);
      toast({
        title: "Data berhasil diupdate",
        description: "Satuan produk berhasil diupdate!",
        variant: "primary",
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.log("Error saat mengupdate satuan produk:", error);
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

  return { updateSatuanProduk, isLoading, error };
};
