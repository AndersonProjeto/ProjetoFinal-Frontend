import { Link, Outlet } from "react-router-dom";
import styles from "./DashboardLayout.module.css";

export function DashboardLayout() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>ACADIA</h2>

        <nav className={styles.nav}>
          <Link to="/app/dashboard">Home</Link>
          <Link to="/app/treinos">Treinos</Link>
          <Link to="/app/exercicios">Exercícios</Link>
          <Link to="/app/evolucao">Evolução</Link>
          <Link to="/app/ia">Chat IA</Link>
          <Link to="/app/perfil">Perfil</Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
