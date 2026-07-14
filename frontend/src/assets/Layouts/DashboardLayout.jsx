import { Fragment, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./DashboardLayout.module.css";
import UsuarioAPI from "../../client/UsuarioAPI";
import { sessao } from "../../client/sessao";
import {
  MdHome,
  MdFitnessCenter,
  MdGridView,
  MdTrendingUp,
  MdChat,
  MdAssessment,
  MdLogout,
} from "react-icons/md";

const NAV_ITEMS = [
  { to: "/app/dashboard",  icon: MdHome,         label: "Início",       section: "Painel" },
  { to: "/app/treinos",    icon: MdFitnessCenter, label: "Treinos",      section: "Treinamento" },
  { to: "/app/exercicios", icon: MdGridView,      label: "Exercícios",   section: null },
  { to: "/app/evolucao",   icon: MdTrendingUp,    label: "Evolução",     section: "Acompanhamento" },
  { to: "/app/relatorio",  icon: MdAssessment,    label: "Relatório IA", section: null },
  { to: "/app/ia",         icon: MdChat,          label: "Chat IA",      section: "IA" },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioId = sessao.usuarioId();
    if (!usuarioId) return;

    UsuarioAPI.obterAsync(usuarioId)
      .then(setUsuario)
      .catch(() => setUsuario(null));
  }, []);

  function sair() {
    sessao.encerrar();
    navigate("/");
  }

  const avatarEstilo = usuario?.avatarEstilo || "avataaars";
  const avatarSeed = usuario?.avatarSeed || "default";

  const paginaAtual = NAV_ITEMS.find((item) => location.pathname === item.to)?.label ?? "";

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
          {NAV_ITEMS.map((item) => (
            <Fragment key={item.to}>
              {item.section && <div className={styles.navSection}>{item.section}</div>}
              <Link
                to={item.to}
                className={location.pathname === item.to ? styles.active : ""}
              >
                <item.icon size={15} />
                <span>{item.label}</span>
              </Link>
            </Fragment>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/app/perfil" className={styles.perfilSidebar}>
            <img
              className={styles.avatarSidebar}
              src={`https://api.dicebear.com/7.x/${avatarEstilo}/svg?seed=${avatarSeed}`}
              alt="Avatar"
            />
            <div className={styles.nomeSidebar}>{usuario?.nome || "Usuário"}</div>
          </Link>
          <button className={styles.sairBtn} onClick={sair} title="Sair da conta">
            <MdLogout size={15} />
          </button>
        </div>
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
