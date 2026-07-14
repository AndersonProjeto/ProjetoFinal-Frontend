import { client } from "./client";


const UsuarioAPI = {
  async loginAsync(email, senha) {
    const response = await client.post("/Usuarios/login", { email, senha });
    return response.data;
  },

  async registrarAsync(dados) {
    const response = await client.post("/Usuarios/registrar", dados);
    return response.data;
  },

  async obterAsync(usuarioId) {
    const response = await client.get(`/Usuarios/${usuarioId}`);
    return response.data;
  },

  async atualizarAsync(dados) {
    const response = await client.put("/Usuarios", dados);
    return response.data;
  },

  async alterarSenhaAsync(dados) {
    const response = await client.patch("/Usuarios/alterar-senha", dados);
    return response.data;
  },

  async deletarAsync(id) {
    const response = await client.delete(`/Usuarios/${id}`);
    return response.data;
  },
};

export default UsuarioAPI;
