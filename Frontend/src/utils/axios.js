import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_URL}/api/v1`,
  withCredentials: true,
});

export default api; 