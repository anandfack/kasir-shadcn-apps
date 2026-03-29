import axios from "axios";

const publicApiRequest = axios.create({
  baseURL: "/api/v1",
});

publicApiRequest.interceptors.request.use((config) => {
  config.headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY;
  return config;
});

export default publicApiRequest;
