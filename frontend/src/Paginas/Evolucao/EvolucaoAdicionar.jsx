import { useEffect, useState } from "react";
import styles from "./EvolucaoAdicionar.module.css";
import EvolucaoAPI from "../../client/EvolucaoAPI";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "../../Componentes/Icones/Icones";
import { sessao } from "../../client/sessao";

function hojeFormatado() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function EvolucaoAdicionar() {
  const navigate = useNavigate();
  const usuarioId = sessao.usuarioId();

  const [peso, setPeso] = useState("");
  const [cintura, setCintura] = useState("");
  const [braco, setBraco] = useState("");
  const [coxa, setCoxa] = useState("");
  const [data, setData] = useState(hojeFormatado());
  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    async function carregarResumo() {
      const r = await EvolucaoAPI.resumoAsync(usuarioId);
      setResumo(r);
    }
    carregarResumo();
  }, [usuarioId]);

  async function salvar() {
    if (!peso) { alert("Informe o peso!"); return; }
    try {
      await EvolucaoAPI.criarAsync({
        usuarioId: Number(usuarioId),
        pesoKg: Number(peso),
        cinturaCm: cintura ? Number(cintura) : null,
        bracoCm: braco ? Number(braco) : null,
        coxaCm: coxa ? Number(coxa) : null,
        dataRegistro: data ? new Date(data + "T12:00:00").toISOString() : null,
      });
      navigate("/app/evolucao", { state: { atualizou: true } });
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar evolução");
    }
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.voltar} onClick={() => navigate(-1)}>
          <IconArrowLeft size={15} />
        </button>
        <div>
          <h1 className={styles.title}>Registrar Evolução</h1>
          <p className={styles.subtitle}>Atualize suas medidas corporais.</p>
        </div>
      </div>

      <div className={styles.layout}>

        {/* Formulário */}
        <div className={styles.formCard}>
          <div className={styles.formGrid}>

            {/* Data — ocupa as duas colunas */}
            <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
              <label className={styles.fieldLabel}>Data do registro</label>
              <input
                className={styles.input}
                style={{ fontSize: "16px" }}
                type="date"
                value={data}
                max={hojeFormatado()}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Peso <span className={styles.fieldUnit}>(kg)</span></label>
              <input className={styles.input} type="number" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="0" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Cintura <span className={styles.fieldUnit}>(cm)</span></label>
              <input className={styles.input} type="number" value={cintura} onChange={(e) => setCintura(e.target.value)} placeholder="0" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Braço <span className={styles.fieldUnit}>(cm)</span></label>
              <input className={styles.input} type="number" value={braco} onChange={(e) => setBraco(e.target.value)} placeholder="0" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Coxa <span className={styles.fieldUnit}>(cm)</span></label>
              <input className={styles.input} type="number" value={coxa} onChange={(e) => setCoxa(e.target.value)} placeholder="0" />
            </div>
          </div>

          <button className={styles.btnSalvar} onClick={salvar}>
            Salvar Evolução
          </button>
        </div>

        {/* Resumo atual */}
        {resumo && (
          <div className={styles.resumoCard}>
            <span className={styles.resumoTitulo}>Medidas Atuais</span>
            <div className={styles.resumoGrid}>
              <div className={styles.resumoItem}>
                <span className={styles.resumoLabel}>Peso</span>
                <span className={styles.resumoValor}>{resumo.pesoAtual ?? "—"} <small>kg</small></span>
              </div>
              <div className={styles.resumoItem}>
                <span className={styles.resumoLabel}>Cintura</span>
                <span className={styles.resumoValor}>{resumo.cinturaAtual ?? "—"} <small>cm</small></span>
              </div>
              <div className={styles.resumoItem}>
                <span className={styles.resumoLabel}>Braço</span>
                <span className={styles.resumoValor}>{resumo.bracoAtual ?? "—"} <small>cm</small></span>
              </div>
              <div className={styles.resumoItem}>
                <span className={styles.resumoLabel}>Coxa</span>
                <span className={styles.resumoValor}>{resumo.coxaAtual ?? "—"} <small>cm</small></span>
              </div>
              <div className={styles.resumoItem}>
                <span className={styles.resumoLabel}>IMC</span>
                <span className={styles.resumoValor}>{resumo.imc?.toFixed(1) ?? "—"}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}