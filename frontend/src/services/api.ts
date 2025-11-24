import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/" // Endereço do backend no Docker/Local
});

// Interceptor para adicionar o Token automaticamente em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
