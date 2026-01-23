import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:5121/api",
});

// Coloca o token no header (se existir)
const token = localStorage.getItem("token");
if (token) {
  client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// INTERCEPTOR: trata erros 401
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // remove token
      localStorage.removeItem("token");

      // redireciona para login
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
