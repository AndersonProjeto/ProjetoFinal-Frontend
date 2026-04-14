import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import EvolucaoAPI from "../../client/EvolucaoAPI";
import styles from "./Evolucao.module.css";

export function Evolucao() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  const [resumo, setResumo] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!token || !usuarioId) return;
    async function carregar() {
      const r = await EvolucaoAPI.resumoAsync(usuarioId, token);
      const h = await EvolucaoAPI.historicoAsync(usuarioId, token);
      setResumo(r);
      setHistorico(h);
      setStreak(calcularStreak(h));
    }
    carregar();
  }, [token, usuarioId, location.state?.atualizou]);

  const calcularStreak = (dados) => {
    if (!dados?.length) return 0;
    const dias = [...new Set(dados.map((h) => new Date(h.dataRegistro).toISOString().split("T")[0]))]
      .sort((a, b) => new Date(b) - new Date(a));
    let total = 1;
    for (let i = 0; i < dias.length - 1; i++) {
      const diff = (new Date(dias[i]) - new Date(dias[i + 1])) / (1000 * 60 * 60 * 24);
      if (diff === 1) total++;
      else break;
    }
    return total;
  };

  const montarDados = (campo) =>
    historico.slice()
      .sort((a, b) => new Date(a.dataRegistro) - new Date(b.dataRegistro))
      .map((h) => ({ data: h.dataRegistro, valor: h[campo] ?? 0 }));

  const Grafico = ({ titulo, dados, unidade }) => (
    <div className={styles.graphCard}>
      <div className={styles.graphHeader}>
        <span className={styles.graphLabel}>{titulo}</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={dados}>
          <XAxis
            dataKey="data"
            tick={{ fontSize: 11, fill: "#9a9180", fontFamily: "DM Sans" }}
            axisLine={{ stroke: "#d6d1c6" }}
            tickLine={false}
            tickFormatter={(v) => new Date(v).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9a9180", fontFamily: "DM Sans" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => [`${v} ${unidade}`, titulo]}
            labelFormatter={(v) => new Date(v).toLocaleDateString("pt-BR")}
            contentStyle={{
              background: "#f8f5ef",
              border: "0.5px solid #d6d1c6",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "DM Sans",
              color: "#14130f",
            }}
          />
          <Area
            type="monotone"
            dataKey="valor"
            stroke="#14130f"
            strokeWidth={1.5}
            fill="#e8e4db"
            dot={{ r: 2, fill: "#14130f", strokeWidth: 0 }}
            activeDot={{ r: 4, fill: "#c9b97a", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className={styles.container}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Evolução</h1>
          <p className={styles.subtitle}>Acompanhe suas medidas ao longo do tempo.</p>
        </div>
        <button className={styles.addButton} onClick={() => navigate("/app/evolucao/adicionar")}>
          + Registrar
        </button>
      </div>

      {/* Cards métricas */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Sequência</span>
          <span className={styles.cardValue}>{streak}</span>
          <span className={styles.cardUnit}>dias</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Peso Inicial</span>
          <span className={styles.cardValue}>{resumo?.pesoInicial ?? "—"}</span>
          <span className={styles.cardUnit}>kg</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Peso Atual</span>
          <span className={styles.cardValue}>{resumo?.pesoAtual ?? "—"}</span>
          <span className={styles.cardUnit}>kg</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>IMC</span>
          <span className={styles.cardValue}>{resumo?.imc?.toFixed(1) ?? "—"}</span>
          {resumo?.imcClassificacao && (
            <span className={styles.cardTag}>{resumo.imcClassificacao}</span>
          )}
        </div>
      </div>

      {/* Gráficos */}
      <div className={styles.graphs}>
        <Grafico titulo="Peso" dados={montarDados("pesoKg")} unidade="kg" />
        <Grafico titulo="Cintura" dados={montarDados("cinturaCm")} unidade="cm" />
        <Grafico titulo="Braço" dados={montarDados("bracoCm")} unidade="cm" />
        <Grafico titulo="Coxa" dados={montarDados("coxaCm")} unidade="cm" />
      </div>

    </div>
  );
}