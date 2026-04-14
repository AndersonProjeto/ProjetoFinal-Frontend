import client from "./client"

const RelatorioAPI = {
  async gerarRelatorioAsync(usuarioId, token) {
    const response = await client.post(
      `/IARelatorio/gerar/${usuarioId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  async listarRelatoriosAsync(usuarioId, token) {
    const response = await client.get(`/IARelatorio/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async obterUltimoRelatorioAsync(usuarioId, token) {
    const response = await client.get(`/IARelatorio/ultimo/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default RelatorioAPI;
