import client from "./client"

const RelatorioAPI = {
  async gerarRelatorioAsync(usuarioId) {
    const response = await client.post(
      `/IARelatorio/gerar/${usuarioId}`,
      {});
    return response.data;
  },

  async listarRelatoriosAsync(usuarioId) {
    const response = await client.get(`/IARelatorio/${usuarioId}`);
    return response.data;
  },

  async obterUltimoRelatorioAsync(usuarioId) {
    const response = await client.get(`/IARelatorio/ultimo/${usuarioId}`);
    return response.data;
  },
};

export default RelatorioAPI;
