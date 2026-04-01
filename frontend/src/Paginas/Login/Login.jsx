import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { client } from "../../client/client";
import logo from "../../assets/logo/logo.svg";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await client.post("/Usuarios/login", {
        email,
        senha,
      });

      const token = response.data.token;
      const usuarioId = response.data.usuarioId; 

      localStorage.setItem("token", token);
      localStorage.setItem("usuarioId", usuarioId);

      client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/app/dashboard");
    } catch (error) {
      alert("Erro ao logar: " + (error.response?.data?.mensagem || error.message));
    }
  }
return (
  <div className={styles.container}>
    <div className={styles.box}>
      <img 
        src={logo} 
        alt="Logo do sistema" 
        className={styles.logo}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className={styles.input}
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className={styles.input}
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>

      <div className={styles.footer}>
        <span>Não tem conta?</span>
        <a href="/cadastro" className={styles.link}>
          Criar agora
        </a>
      </div>
    </div>
    <div className={styles.footerBar}>
  ©2026 ACADIA
</div>
  </div>
  
);
}
