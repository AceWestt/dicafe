import { useState, useEffect } from "react";
import axios from "axios";

export const useAxiosGet = (url) => {
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { "Content-Type": "application/json" } };
      try {
        const { data } = await axios.get(url, config);
        setData(data.data);
        setSuccess(true);
        setError(null);
      } catch (error) {
        setSuccess(false);
        setError(error);
      }
    };
    fetchData();
  }, [url]);

  return { success, data, error };
};
