import { useEffect, useState } from "react";
import styles from "./EvolucaoAdicionar.module.css";
import EvolucaoAPI from "../../client/EvolucaoAPI";
import { useNavigate } from "react-router-dom";

export function EvolucaoAdicionar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  const [peso, setPeso] = useState("");
  const [cintura, setCintura] = useState("");
  const [braco, setBraco] = useState("");
  const [coxa, setCoxa] = useState("");

  const [resumo, setResumo] = useState(null);
  const [mostrarResumo, setMostrarResumo] = useState(false); 

  useEffect(() => {
    async function carregarResumo() {
      const r = await EvolucaoAPI.resumoAsync(usuarioId, token);
      setResumo(r);
    }

    carregarResumo();
  }, [usuarioId, token]);

  async function salvar() {
    if (!peso) {
      alert("Informe o peso!");
      return;
    }

    try {
      await EvolucaoAPI.criarAsync(
        {
          usuarioId: Number(usuarioId),
          pesoKg: Number(peso),
          cinturaCm: cintura ? Number(cintura) : null,
          bracoCm: braco ? Number(braco) : null,
          coxaCm: coxa ? Number(coxa) : null,
        },
        token
      );

      navigate("/app/evolucao", {
        state: { atualizou: true },
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar evolução");
    }
  }

  return (
    <div className={styles.container}>
      <h1>Adicionar Evolução</h1>

      <div className={styles.form}>
        <label>Peso (kg)</label>
        <input
          type="number"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />

        <label>Cintura (cm)</label>
        <input
          type="number"
          value={cintura}
          onChange={(e) => setCintura(e.target.value)}
        />

        <label>Braço (cm)</label>
        <input
          type="number"
          value={braco}
          onChange={(e) => setBraco(e.target.value)}
        />

        <label>Coxa (cm)</label>
        <input
          type="number"
          value={coxa}
          onChange={(e) => setCoxa(e.target.value)}
        />

        <button className={styles.saveButton} onClick={salvar}>
          Salvar
        </button>

     
        {resumo && (
          <div className={styles.accordion}>
            <div
              className={styles.accordionTitle}
              onClick={() => setMostrarResumo(!mostrarResumo)}
            >
              <span>Dados atuais (clique para ver)</span>
              <span className={styles.accordionArrow}>
                {mostrarResumo ? "-" : "+"}
              </span>
            </div>

            {mostrarResumo && (
              <div className={styles.accordionBody}>
                <div><b>Peso:</b> {resumo.pesoAtual} kg</div>
                <div><b>Cintura:</b> {resumo.cinturaAtual} cm</div>
                <div><b>Braço:</b> {resumo.bracoAtual} cm</div>
                <div><b>Coxa:</b> {resumo.coxaAtual} cm</div>
                <div><b>IMC:</b> {resumo.imc}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
