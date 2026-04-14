import { useEffect, useState } from "react";
import UsuarioAPI from "../../client/UsuarioAPI";
import EvolucaoAPI from "../../client/EvolucaoAPI";
import TreinoAPI from "../../client/TreinoAPI";
import styles from "./Dashboard.module.css";
import { useNavigate, Link } from "react-router-dom";

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

  const hora = new Date().getHours();
  const saudacao =
    hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className={styles.dashboardContainer}>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{saudacao}, {usuario?.nome}</h1>
        <p className={styles.subtitle}>Aqui está o resumo do seu progresso.</p>
      </div>

      {/* Metric Cards */}
      <div className={styles.cardsRow}>
        <div className={styles.imcCard} onClick={() => setModalOpen(true)}>
          <div className={styles.imcLabel}>Índice de Massa Corporal</div>
          <div className={styles.imcValue}>{resumo?.imc?.toFixed(2) ?? "--"}</div>
          {resumo?.imcClassificacao && (
            <span className={styles.imcTag}>{resumo.imcClassificacao}</span>
          )}
        </div>

        <div className={styles.treinosCard} onClick={() => navigate("/app/treinos")}>
          <div className={styles.treinosLabel}>Treinos Realizados</div>
          <div className={styles.treinosValue}>{treinos.length}</div>
        </div>

        <div className={styles.faleComAcadiaCard} onClick={() => navigate("/app/ia")}>
          <div className={styles.faleComAcadiaLabel}>Assistente IA</div>
          <div className={styles.faleComAcadiaValue}>Tire suas dúvidas com a AcadIA</div>
          <span className={styles.iaArrow}>→ Abrir chat</span>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <span className={styles.chartTitle}>Evolução Corporal</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={historico}>
            <XAxis
              dataKey="data"
              tick={{ fontSize: 11, fill: "#9a9180", fontFamily: "DM Sans" }}
              axisLine={{ stroke: "#d6d1c6" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9a9180", fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#f8f5ef",
                border: "0.5px solid #d6d1c6",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "DM Sans",
                color: "#14130f",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", fontFamily: "DM Sans", color: "#9a9180" }}
            />
            <Line type="monotone" dataKey="peso"    stroke="#14130f" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="cintura" stroke="#c9b97a" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="braco"   stroke="#9a9180" strokeWidth={1}   dot={false} strokeDasharray="4 3" />
            <Line type="monotone" dataKey="coxa"    stroke="#b8ad9a" strokeWidth={1}   dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.actionsRow}>
        <Link to="/app/treinos" className={styles.actionCard}>
          <div>
            <div className={styles.actionLabel}>Novo Treino</div>
            <div className={styles.actionDesc}>Criar sessão personalizada</div>
          </div>
          <span className={styles.actionArrow}>→</span>
        </Link>
        <Link to="/app/evolucao" className={styles.actionCard}>
          <div>
            <div className={styles.actionLabel}>Registrar Evolução</div>
            <div className={styles.actionDesc}>Atualizar medidas corporais</div>
          </div>
          <span className={styles.actionArrow}>→</span>
        </Link>
      </div>

      {/* IMC Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Índice de Massa Corporal</h2>
              <button className={styles.closeBtn} onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <span>Altura</span>
                <b>{usuario?.alturaCm ?? "--"} cm</b>
              </div>
              <div className={styles.modalRow}>
                <span>Peso atual</span>
                <b>{resumo?.pesoAtual ?? "--"} kg</b>
              </div>
              <div className={styles.modalRow}>
                <span>IMC</span>
                <b>{resumo?.imc?.toFixed(2) ?? "--"}</b>
              </div>
              <div className={styles.modalRow}>
                <span>Classificação</span>
                <b>{resumo?.imcClassificacao ?? "--"}</b>
              </div>
              {resumo?.imcExplicacao && (
                <div className={styles.modalExplanation}>
                  {resumo.imcExplicacao}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}