"use client";
import axios from "axios";

import React from "react";

import { useToast } from "@/hooks/use-toast";

export const useTambahSupplier = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const tambahSupplier = async (payload, { onSuccess, onError }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/v1/supplier", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Supplier berhasil ditambahkan:", response.data);

      if (onSuccess) onSuccess(response.data);

      toast({
        title: "Data berhasil ditambahkan",
        description: "Supplier berhasil ditambahkan!",
        variant: "primary",
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error saat menambahkan supplier:", error);

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

  return { tambahSupplier, isLoading, error };
};
