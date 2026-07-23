import axios from "axios";
import { sessao } from "./sessao";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5121/api",
});

// Anexa o token a cada requisição (lido na hora, não no load do módulo).
client.interceptors.request.use((config) => {
  const token = sessao.token();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Sessão expirada/inválida: limpa e volta ao login (sem loop na própria tela de login).
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/") {
      sessao.encerrar();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
