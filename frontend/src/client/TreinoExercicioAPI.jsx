import { client } from "./client";

const TreinoExercicioAPI = {
  async adicionarAsync(dados) {
    const response = await client.post("/TreinoExercicio", dados);
    return response.data;
  },

  async atualizarAsync(dados) {
    const response = await client.put("/TreinoExercicio", dados);
    return response.data;
  },

  async deletarAsync(treinoExercicioId) {
    const response = await client.delete(`/TreinoExercicio/${treinoExercicioId}`);
    return response.data;
  },

  async obterAsync(treinoExercicioId) {
    const response = await client.get(`/TreinoExercicio/${treinoExercicioId}`);
    return response.data;
  },

  async listarPorTreinoAsync(treinoId) {
    const response = await client.get(`/TreinoExercicio/treino/${treinoId}`);
    return response.data;
  },
};

export default TreinoExercicioAPI;
