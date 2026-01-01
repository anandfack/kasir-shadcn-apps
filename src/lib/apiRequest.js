import axios from "axios";

const api = axios.create({
  baseURL: "",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Using token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    if (status === 401) {
      // handle unauthorized errors
      console.error("Unauthorized access - perhaps redirect to login?");
    }

    return Promise.reject({
      status,
      message: data?.message || "Terjadi kesalahan pada API",
      errors: data?.errors || null,
    });
  }
);

export const apiRequest = async (method, url, data) => {
  const res = await api({
    method,
    url,
    data,
  });
  return res.data;
};
