"use client";

import axios from "axios";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export const useDeleteSatuanProduk = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const deleteSatuanProduk = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/api/v1/satuan-produk/${id}`);

      console.log("satuan produk berhasil dihapus", response);

      toast({
        title: "Berhasil",
        message: response.data.message,
        type: "primary",
      });
    } catch (error) {
      console.log("Error saat menghapus satuan produk:", error);

      toast({
        title: "Terjadi kesalahan",
        message: error?.response?.data?.error || "Terjadi kesalahan",
        type: "destructive",
      });

      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return { deleteSatuanProduk, isLoading, error };
};
