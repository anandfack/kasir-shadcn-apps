import { useState, useEffect } from "react";
import axios from "axios";

const useFetchHargaProduk = (url, refreshKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, refreshKey]);

  return { data, loading, error };
};

export default useFetchHargaProduk;
