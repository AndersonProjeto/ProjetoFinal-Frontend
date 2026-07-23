// Ponto único de acesso à sessão do usuário (token JWT + id).
export const sessao = {
  salvar({ token, usuarioId }) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuarioId", usuarioId);
  },

  token() {
    return localStorage.getItem("token");
  },

  usuarioId() {
    return localStorage.getItem("usuarioId");
  },

  autenticado() {
    return Boolean(this.token());
  },

  encerrar() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
  },
};
