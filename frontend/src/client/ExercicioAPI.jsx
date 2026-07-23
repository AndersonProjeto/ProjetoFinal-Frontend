import { client } from "./client";

const ExercicioAPI = {
  async criarAsync(dados) {
    const response = await client.post("/Exercicio", dados);
    return response.data;
  },

  async atualizarAsync(dados) {
    const response = await client.put("/Exercicio", dados);
    return response.data;
  },

  async listarExercicios() {
    const response = await client.get("/Exercicio");
    return response.data;
  },

  async deletarAsync(exercicioId) {
    const response = await client.delete(`/Exercicio/${exercicioId}`);
    return response.data;
  },

  async obterAsync(exercicioId) {
    const response = await client.get(`/Exercicio/${exercicioId}`);
    return response.data;
  },

  async listarPorGrupoAsync(grupoMuscular) {
    const response = await client.get(`/Exercicio/grupo/${grupoMuscular}`);
    return response.data;
  },

  async obterDetalhadoAsync(exercicioId) {
    const response = await client.get(`/Exercicio/${exercicioId}/detalhado`);
    return response.data;
  },

  async listarPaginadoAsync(pagina, tamanhoPagina) {
    const response = await client.get("/Exercicio/paginado", {
      params: { pagina, tamanhoPagina },
    });
    return response.data;
  },
  async importarImagemAsync(exercicioId) {
    const response = await client.post(`/Exercicio/${exercicioId}/importar-imagem`, {});
    return response.data; // Espera-se que retorne o objeto do exercício atualizado ou a URL
  },
};


export default ExercicioAPI;
