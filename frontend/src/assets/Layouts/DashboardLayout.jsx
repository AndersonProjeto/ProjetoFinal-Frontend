import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./DashboardLayout.module.css";
import { useEffect, useState } from "react";
import UsuarioAPI from "../../client/UsuarioAPI";
import {
  MdHome,
  MdFitnessCenter,
  MdGridView,
  MdTrendingUp,
  MdChat,
  MdAssessment,
} from "react-icons/md";

const NAV_ITEMS = [
  { to: "/app/dashboard",  icon: MdHome,        label: "Início",       section: "Painel" },
  { to: "/app/treinos",    icon: MdFitnessCenter,label: "Treinos",      section: "Treinamento" },
  { to: "/app/exercicios", icon: MdGridView,     label: "Exercícios",   section: null },
  { to: "/app/evolucao",   icon: MdTrendingUp,   label: "Evolução",     section: "Acompanhamento" },
  { to: "/app/relatorio",  icon: MdAssessment,   label: "Relatório IA", section: null }, // NOVO
  { to: "/app/ia",         icon: MdChat,         label: "Chat IA",      section: "IA" },
];

export function DashboardLayout() {
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");
  const location = useLocation();

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

  const paginaAtual = NAV_ITEMS.find(item => location.pathname === item.to)?.label ?? "";

  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <h2>Acadia</h2>
          <div className={styles.sidebarTagline}>Performance & Saúde</div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, icon: Icon, label, section }) => (
            <>
              {section && (
                <div key={`sec-${section}`} className={styles.navSection}>
                  {section}
                </div>
              )}
              <Link
                key={to}
                to={to}
                className={location.pathname === to ? styles.active : ""}
              >
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            </>
          ))}
        </nav>

        <Link to="/app/perfil" className={styles.perfilSidebar}>
          <img
            className={styles.avatarSidebar}
            src={`https://api.dicebear.com/7.x/${avatarEstilo}/svg?seed=${avatarSeed}`}
            alt="Avatar"
          />
          <div className={styles.nomeSidebar}>{usuario?.nome || "Usuário"}</div>
        </Link>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <span className={styles.topbarTitle}>{paginaAtual}</span>
          <span className={styles.topbarDate}>{hoje}</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}