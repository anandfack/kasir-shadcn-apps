import axios from "axios";

export const apiRequest = async (method, url, data = null) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Terjadi kesalahan pada API");
  }
};