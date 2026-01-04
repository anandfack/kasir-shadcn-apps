import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/apiRequest";

const useFetchPegawai = (url, refreshKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiRequest("GET", url);

        /**
         * res = {
         *   message: "OK",
         *   data: [...]
         * }
         */
        if (isMounted) {
          setData(res.data || []);
        }
      } catch (err) {
        /**
         * err = {
         *   status,
         *   message,
         *   errors
         * }
         */
        if (isMounted) {
          setError({
            status: err.status || 500,
            message: err.message || "Terjadi kesalahan",
            errors: err.errors || null,
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, refreshKey]);

  return { data, loading, error };
};

export default useFetchPegawai;
