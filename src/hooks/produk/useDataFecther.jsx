import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchOptions = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [];
  }
};

export const useDataFetcher = () => {
  const { data: kategoriData = [], isLoading: kategoriLoading } = useQuery({
    queryKey: ["kategori-produk"],
    queryFn: () => fetchOptions("/api/kategori-produk"),
    staleTime: 1000 * 60 * 60, // Cache 1 jam
  });

  const { data: satuanData = [], isLoading: satuanLoading } = useQuery({
    queryKey: ["satuan-produk"],
    queryFn: () => fetchOptions("/api/v1/satuan-produk"),
    staleTime: 1000 * 60 * 60,
  });

  const { data: supplierData = [], isLoading: supplierLoading } = useQuery({
    queryKey: ["supplier-produk"],
    queryFn: () => fetchOptions("/api/v1/supplier"),
    staleTime: 1000 * 60 * 60,
  });

  return {
    kategoriData,
    kategoriLoading,
    satuanData,
    satuanLoading,
    supplierData,
    supplierLoading,
  };
};
