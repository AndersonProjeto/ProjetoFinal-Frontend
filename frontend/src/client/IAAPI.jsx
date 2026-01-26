import { client } from "./client";


const IAAPI = {
  async completarAsync(dados, token) {
    const response = await client.post("/Ai/completar", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async salvarInteracaoAsync(dados, token) {
    const response = await client.post("/IAInteracao/perguntar", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async listarInteracoesAsync(usuarioId, token) {
    const response = await client.get(`/IAInteracao/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async ultimaInteracaoAsync(usuarioId, token) {
    const response = await client.get(`/IAInteracao/ultima/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  async ultimasInteracoesAsync(usuarioId, quantidade, token) {
  const response = await client.get(
    `/IAInteracao/ultimas/${usuarioId}/${quantidade}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

};

export default IAAPI;
