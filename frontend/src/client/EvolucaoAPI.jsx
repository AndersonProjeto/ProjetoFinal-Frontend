import { client } from "./client";
const EvolucaoAPI = {
  async criarAsync(dados, token) {
    const response = await client.post("/Evolucao", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async atualizarAsync(dados, token) {
    const response = await client.put("/Evolucao", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async ultimaAsync(usuarioId, token) {
    const response = await client.get(
      `/Evolucao/usuario/${usuarioId}/ultima`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  async resumoAsync(usuarioId, token) {
    const response = await client.get(
      `/Evolucao/usuario/${usuarioId}/resumo`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  async historicoAsync(usuarioId, token) {
  const response = await client.get(
    `/Evolucao/usuario/${usuarioId}/historico`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
},

  async pesoInicialAsync(usuarioId, token) {
    const response = await client.get(
      `/Evolucao/usuario/${usuarioId}/peso-inicial`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  async diferencaPesoAsync(usuarioId, token) {
    const response = await client.get(
      `/Evolucao/usuario/${usuarioId}/diferenca-peso`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};

export default EvolucaoAPI;
