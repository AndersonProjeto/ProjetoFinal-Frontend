import { client } from "./client";

const TreinoAPI = {
  async criarAsync(dados) {
    const response = await client.post("/Treino", dados);
    return response.data;
  },

  async atualizarAsync(dados) {
    const response = await client.put("/Treino", dados);
    return response.data;
  },

  async deletarAsync(treinoId) {
    const response = await client.delete(`/Treino/${treinoId}`);
    return response.data;
  },

  async obterAsync(treinoId) {
    const response = await client.get(`/Treino/${treinoId}`);
    return response.data;
  },

  async listarPorUsuarioAsync(usuarioId) {
    const response = await client.get(`/Treino/usuario/${usuarioId}`);
    return response.data;
  },

  async obterResumoAsync() {
    const response = await client.get("/Treino/resumo");
    return response.data;
  },

  async totalExerciciosAsync(treinoId) {
    const response = await client.get(`/Treino/${treinoId}/total-exercicios`);
    return response.data;
  },
};

export default TreinoAPI;
