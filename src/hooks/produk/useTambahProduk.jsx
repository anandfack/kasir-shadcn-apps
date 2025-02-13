"use client";
import axios from "axios";

import React from "react";

import { useToast } from "@/hooks/use-toast";

export const useTambahProduk = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const tambahProduk = async (payload, { onSuccess, onError }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/v1/produk", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Produk berhasil ditambahkan:", response.data);

      if (onSuccess) onSuccess(response.data);

      toast({
        title: "Data berhasil ditambahkan",
        description: "Produk berhasil ditambahkan!",
        variant: "primary",
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error saat menambahkan produk:", error);

      if (onError) onError(error);
      toast({
        title: "Terjadi kesalahan",
        description: error?.response?.data?.error || "Terjadi kesalahan",
        variant: "destructive",
      });
      return { success: false, error: error?.response?.data?.error };
    } finally {
      setIsLoading(false);
    }
  };

  return { tambahProduk, isLoading, error };
};
