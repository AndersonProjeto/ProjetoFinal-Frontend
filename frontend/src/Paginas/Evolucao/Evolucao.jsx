import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

    const dias = [
      ...new Set(
        dados.map((h) =>
          new Date(h.dataRegistro).toISOString().split("T")[0]
        )
      ),
    ].sort((a, b) => new Date(b) - new Date(a));

    let total = 1;
    for (let i = 0; i < dias.length - 1; i++) {
      const diff =
        (new Date(dias[i]) - new Date(dias[i + 1])) /
        (1000 * 60 * 60 * 24);
      if (diff === 1) total++;
      else break;
    }
    return total;
  };

  // 🔹 monta dados mantendo TODAS as datas reais
  const montarDados = (campo) =>
    historico
      .slice()
      .sort(
        (a, b) => new Date(a.dataRegistro) - new Date(b.dataRegistro)
      )
      .map((h) => ({
        data: h.dataRegistro,
        valor: h[campo] ?? 0,
      }));

  const Grafico = ({ titulo, dados, unidade }) => (
    <div className={styles.graphCard}>
      <h2 className={styles.graphTitle}>{titulo}</h2>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={dados}>
          <XAxis
            dataKey="data"
            tickFormatter={(v) =>
              new Date(v).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              })
            }
          />

          <YAxis />

          <Tooltip
            formatter={(v) => [`${v} ${unidade}`, "Valor"]}
            labelFormatter={(v) =>
              new Date(v).toLocaleString("pt-BR")
            }
          />

          <Area
            type="monotone"
            dataKey="valor"
            stroke="#000"
            fill="#cfcfcf"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Evolução</h1>

        <button
          className={styles.addButton}
          onClick={() => navigate("/app/evolucao/adicionar")}
        >
          Adicionar Evolução
        </button>
      </div>

      {/* CARDS */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Sequência</p>
          <h2 className={styles.cardValue}>{streak} dias</h2>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Peso Inicial</p>
          <h2 className={styles.cardValue}>
            {resumo?.pesoInicial ?? 0} kg
          </h2>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Peso Atual</p>
          <h2 className={styles.cardValue}>
            {resumo?.pesoAtual ?? 0} kg
          </h2>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className={styles.graphs}>
        <Grafico titulo="Peso" dados={montarDados("pesoKg")} unidade="kg" />
        <Grafico titulo="Cintura" dados={montarDados("cinturaCm")} unidade="cm" />
        <Grafico titulo="Braço" dados={montarDados("bracoCm")} unidade="cm" />
        <Grafico titulo="Coxa" dados={montarDados("coxaCm")} unidade="cm" />
      </div>
    </div>
  );
}
