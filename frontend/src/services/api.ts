import axios from "axios";
import { StorageKeys } from "../utils/constants";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8000/"
});

// Interceptor para adicionar o Token automaticamente em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem(StorageKeys.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
