import { useEffect, useState } from "react";
import { client } from "../../client/client";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const usuarioId = localStorage.getItem("usuarioId");
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuarioId) {
      setLoading(false);
      return;
    }

    async function loadUser() {
      try {
        const response = await client.get(`/Usuarios/${usuarioId}`);
        setUsuario(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [usuarioId]);

  if (!usuarioId) return <p>Você precisa fazer login para acessar o painel.</p>;
  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.subtitle}>Bem vindo, {usuario?.nome}</p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Resumo</h2>
        <p className={styles.cardText}>
          Aqui você pode ver suas informações e gerenciar seus dados.
        </p>
      </div>
    </div>
  );
}
