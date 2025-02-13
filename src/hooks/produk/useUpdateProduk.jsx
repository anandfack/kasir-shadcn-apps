"use client";

import axios from "axios";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export const useUpdateProduk = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const updateProduk = async (id, payload, { onSuccess, onError }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`/api/v1/produk/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Supplier berhasil diupdate:", response.data);
      if (onSuccess) onSuccess(response.data);
      toast({
        title: "Data berhasil diupdate",
        description: "produk berhasil diupdate!",
        variant: "primary",
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.log("Error saat mengupdate produk:", error);
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

  return { updateProduk, isLoading, error };
};
