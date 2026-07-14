import { client } from "./client";
const EvolucaoAPI = {
  async criarAsync(dados) {
    const response = await client.post("/Evolucao", dados);
    return response.data;
  },

  async atualizarAsync(dados) {
    const response = await client.put("/Evolucao", dados);
    return response.data;
  },

  async ultimaAsync(usuarioId) {
    const response = await client.get(
      `/Evolucao/usuario/${usuarioId}/ultima`);
    return response.data;
  },

  async resumoAsync(usuarioId) {
    const response = await client.get(
      `/Evolucao/usuario/${usuarioId}/resumo`);
    return response.data;
  },

  async historicoAsync(usuarioId) {
  const response = await client.get(
    `/Evolucao/usuario/${usuarioId}/historico`);
  return response.data;
},

  async pesoInicialAsync(usuarioId) {
    const response = await client.get(
      `/Evolucao/usuario/${usuarioId}/peso-inicial`);
    return response.data;
  },

  async diferencaPesoAsync(usuarioId) {
    const response = await client.get(
      `/Evolucao/usuario/${usuarioId}/diferenca-peso`);
    return response.data;
  },
};

export default EvolucaoAPI;
