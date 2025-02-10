"use client";

import axios from "axios";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export const useUpdateSupplier = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const updateSupplier = async (id, payload, { onSuccess, onError }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`/api/v1/supplier/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Supplier berhasil diupdate:", response.data);
      if (onSuccess) onSuccess(response.data);
      toast({
        title: "Data berhasil diupdate",
        description: "supplier berhasil diupdate!",
        variant: "primary",
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.log("Error saat mengupdate supplier:", error);
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

  return { updateSupplier, isLoading, error };
};
