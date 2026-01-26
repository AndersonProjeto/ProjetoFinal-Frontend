import { Link, Outlet } from "react-router-dom";
import styles from "./DashboardLayout.module.css";
import { useEffect, useState } from "react";
import UsuarioAPI from "../../client/UsuarioAPI";
import {
  MdHome,
  MdFitnessCenter,
  MdGridView,
  MdTrendingUp,
  MdChat,
} from "react-icons/md";

export function DashboardLayout() {
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      if (!usuarioId || !token) return;

      const dados = await UsuarioAPI.obterAsync(usuarioId, token);
      setUsuario(dados);
    }

    carregarUsuario();
  }, [usuarioId, token]);

  const avatarEstilo = usuario?.avatarEstilo || "avataaars";
  const avatarSeed = usuario?.avatarSeed || "default";

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>ACADIA</h2>

        <nav className={styles.nav}>
  <Link to="/app/dashboard">
    <MdHome size={18} />
    <span>Home</span>
  </Link>

  <Link to="/app/treinos">
    <MdFitnessCenter size={18} />
    <span>Treinos</span>
  </Link>

  <Link to="/app/exercicios">
    <MdGridView size={18} />
    <span>Exercícios</span>
  </Link>

  <Link to="/app/evolucao">
    <MdTrendingUp size={18} />
    <span>Evolução</span>
  </Link>

  <Link to="/app/ia">
    <MdChat size={18} />
    <span>Chat IA</span>
  </Link>
</nav>

        <Link to="/app/perfil" className={styles.perfilSidebar}>
          <img
            className={styles.avatarSidebar}
            src={`https://api.dicebear.com/7.x/${avatarEstilo}/svg?seed=${avatarSeed}`}
            alt="Avatar"
          />
          <div className={styles.nomeSidebar}>
            {usuario?.nome || "Usuário"}
          </div>
        </Link>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}