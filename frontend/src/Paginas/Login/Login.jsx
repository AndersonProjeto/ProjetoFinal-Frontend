import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import styles from "./Login.module.css";
import UsuarioAPI from "../../client/UsuarioAPI";
import { sessao } from "../../client/sessao";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);

    try {
      const resposta = await UsuarioAPI.loginAsync(email, senha);
      sessao.salvar(resposta);
      navigate("/app/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.mensagem || "Não foi possível entrar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.brand}>
          <h1 className={styles.brandName}>Acadia</h1>
          <span className={styles.brandTagline}>Performance & Saúde</span>
        </div>

        <form onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <label className={styles.label} htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button type="submit" className={styles.submitBtn} disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Não tem conta?</span>
          <Link to="/cadastro" className={styles.link}>Criar agora</Link>
        </div>
      </div>

      <div className={styles.footerBar}>©2026 ACADIA</div>
    </div>
  );
}
