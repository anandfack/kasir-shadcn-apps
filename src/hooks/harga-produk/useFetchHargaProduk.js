import { useState, useEffect } from "react";
import axios from "axios";

const useFetchHargaProduk = (url, refreshKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(url, {
          cancelToken: axios.CancelToken.source().token,
        });
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch data");
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

export default useFetchHargaProduk;
