import { client } from "./client";


const IAAPI = {
  async completarAsync(dados) {
    const response = await client.post("/Ai/completar", dados);
    return response.data;
  },

  async salvarInteracaoAsync(dados) {
    const response = await client.post("/IAInteracao/perguntar", dados);
    return response.data;
  },

  async listarInteracoesAsync(usuarioId) {
    const response = await client.get(`/IAInteracao/${usuarioId}`);
    return response.data;
  },

  async ultimaInteracaoAsync(usuarioId) {
    const response = await client.get(`/IAInteracao/ultima/${usuarioId}`);
    return response.data;
  },
  async ultimasInteracoesAsync(usuarioId, quantidade) {
  const response = await client.get(
    `/IAInteracao/ultimas/${usuarioId}/${quantidade}`);
  return response.data;
}

};

export default IAAPI;
