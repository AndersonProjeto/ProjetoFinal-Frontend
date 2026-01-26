import { useEffect, useState } from "react";
import UsuarioAPI from "../../client/UsuarioAPI";
import EvolucaoAPI from "../../client/EvolucaoAPI";
import TreinoAPI from "../../client/TreinoAPI";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function Dashboard() {
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  const [usuario, setUsuario] = useState(null);
  const [resumo, setResumo] = useState(null);
  const [treinos, setTreinos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!usuarioId || !token) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const u = await UsuarioAPI.obterAsync(usuarioId, token);
        const r = await EvolucaoAPI.resumoAsync(usuarioId, token);
        const t = await TreinoAPI.listarPorUsuarioAsync(usuarioId, token);
        const h = await EvolucaoAPI.historicoAsync(usuarioId, token);
  
        const historicoFormatado = h
          .map((item) => ({
            data: item.dataRegistro.split("T")[0], 
            peso: item.pesoKg,
            cintura: item.cinturaCm,
            braco: item.bracoCm,
            coxa: item.coxaCm,
          }))
          .reverse();

        setUsuario(u);
        setResumo(r);
        setTreinos(t);
        setHistorico(historicoFormatado);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [usuarioId, token]);

  if (!usuarioId) return <p>Você precisa fazer login para acessar o painel.</p>;
  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>ACADIA</h1>
      <p className={styles.subtitle}>Bem vindo a Dashboard, {usuario?.nome}</p>

      <div className={styles.cardsRow}>
        <div className={styles.imcCard} onClick={() => setModalOpen(true)}>
          <div className={styles.imcLabel}>IMC</div>
          <div className={styles.imcValue}>
            {resumo?.imc?.toFixed(2) ?? "--"}
          </div>
        </div>
        <div
          className={styles.treinosCard}
          onClick={() => navigate("/app/treinos")}
        >
          <div className={styles.treinosLabel}>Treinos</div>
          <div className={styles.treinosValue}>{treinos.length}</div>
        </div>

        {/* CARD FALE COM A ACADIA */}
        <div
          className={styles.faleComAcadiaCard}
          onClick={() => navigate("/app/ia")}
        >
          <div className={styles.faleComAcadiaLabel}>Fale com a ACADIA</div>
          <div className={styles.faleComAcadiaValue}>IA</div>
        </div>
      </div>
      <div className={styles.chartCard}>
        <div className={styles.chartTitle}>Evolução Geral</div>

        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={historico}>
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="cintura"
              stroke="#00B14F"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="peso"
              stroke="#E53935"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="braco"
              stroke="#3B82F6"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="coxa"
              stroke="#F59E0B"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {modalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Seu IMC</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setModalOpen(false)}
              >
                X
              </button>
            </div>

            <div className={styles.modalBody}>
              <div>
                <b>Altura:</b> {usuario?.alturaCm ?? "--"} cm
              </div>
              <div>
                <b>Peso atual:</b> {resumo?.pesoAtual ?? "--"} kg
              </div>
              <div>
                <b>IMC:</b> {resumo?.imc?.toFixed(2) ?? "--"}
              </div>
              <div>
                <b>Classificação:</b> {resumo?.imcClassificacao ?? "--"}
              </div>

              <div className={styles.modalExplanation}>
                {resumo?.imcExplicacao ?? "Sem dados de IMC ainda."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
