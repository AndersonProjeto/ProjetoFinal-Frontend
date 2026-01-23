import { client } from "./client";

const TreinoAPI = {
  async criarAsync(dados, token) {
    const response = await client.post("/Treino", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async atualizarAsync(dados, token) {
    const response = await client.put("/Treino", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deletarAsync(treinoId, token) {
    const response = await client.delete(`/Treino/${treinoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async obterAsync(treinoId, token) {
    const response = await client.get(`/Treino/${treinoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async listarPorUsuarioAsync(usuarioId, token) {
    const response = await client.get(`/Treino/usuario/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async obterResumoAsync(token) {
    const response = await client.get("/Treino/resumo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async totalExerciciosAsync(treinoId, token) {
    const response = await client.get(`/Treino/${treinoId}/total-exercicios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default TreinoAPI;
