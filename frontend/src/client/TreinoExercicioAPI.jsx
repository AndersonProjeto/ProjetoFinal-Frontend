import { client } from "./client";

const TreinoExercicioAPI = {
  async adicionarAsync(dados, token) {
    const response = await client.post("/TreinoExercicio", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async atualizarAsync(dados, token) {
    const response = await client.put("/TreinoExercicio", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deletarAsync(treinoExercicioId, token) {
    const response = await client.delete(`/TreinoExercicio/${treinoExercicioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async obterAsync(treinoExercicioId, token) {
    const response = await client.get(`/TreinoExercicio/${treinoExercicioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async listarPorTreinoAsync(treinoId, token) {
    const response = await client.get(`/TreinoExercicio/treino/${treinoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default TreinoExercicioAPI;
