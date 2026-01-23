import { client } from "./client";

const ExercicioAPI = {
  async criarAsync(dados, token) {
    const response = await client.post("/Exercicio", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async atualizarAsync(dados, token) {
    const response = await client.put("/Exercicio", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async listarExercicios(token) {
    const response = await client.get("/Exercicio", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deletarAsync(exercicioId, token) {
    const response = await client.delete(`/Exercicio/${exercicioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async obterAsync(exercicioId, token) {
    const response = await client.get(`/Exercicio/${exercicioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async listarPorGrupoAsync(grupoMuscular, token) {
    const response = await client.get(`/Exercicio/grupo/${grupoMuscular}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async obterDetalhadoAsync(exercicioId, token) {
    const response = await client.get(`/Exercicio/${exercicioId}/detalhado`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async listarPaginadoAsync(pagina, tamanhoPagina, token) {
    const response = await client.get("/Exercicio/paginado", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        pagina,
        tamanhoPagina,
      },
    });
    return response.data;
  },
  async importarImagemAsync(exercicioId, token) {
    const response = await client.post(`/Exercicio/${exercicioId}/importar-imagem`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Espera-se que retorne o objeto do exercício atualizado ou a URL
  },
};


export default ExercicioAPI;
