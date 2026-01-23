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

  async obterAsync(usuarioId, token) {
    const response = await client.get(`/Usuarios/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async atualizarAsync(dados, token) {
    const response = await client.put("/Usuarios", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async alterarSenhaAsync(dados, token) {
    const response = await client.patch("/Usuarios/alterar-senha", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deletarAsync(id, token) {
    const response = await client.delete(`/Usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default UsuarioAPI;
