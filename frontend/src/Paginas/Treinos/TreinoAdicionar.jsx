import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./TreinoAdicionar.module.css";
import TreinoAPI from "../../client/TreinoAPI";
import TreinoExercicioAPI from "../../client/TreinoExercicioAPI";
import ExercicioAPI from "../../client/ExercicioAPI";

export function TreinoAdicionar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  const [nomeTreino, setNomeTreino] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
  const [exerciciosTreino, setExerciciosTreino] = useState([]);

  useEffect(() => {
    if (!grupoMuscular) return;
    async function carregar() {
      const dados = await ExercicioAPI.listarPorGrupoAsync(grupoMuscular, token);
      setExerciciosDisponiveis(dados);
    }
    carregar();
  }, [grupoMuscular]);

  function adicionarExercicio(ex) {
    if (exerciciosTreino.some((e) => e.exercicioId === ex.exercicioId)) return;
    setExerciciosTreino([
      ...exerciciosTreino,
      { exercicioId: ex.exercicioId, nome: ex.nome, series: 4, repeticoes: 12, descansoSegundos: 90 },
    ]);
  }

  function removerExercicio(exercicioId) {
    setExerciciosTreino(exerciciosTreino.filter((e) => e.exercicioId !== exercicioId));
  }

  function atualizarCampo(index, campo, valor) {
    const copia = [...exerciciosTreino];
    copia[index][campo] = Number(valor);
    setExerciciosTreino(copia);
  }

  const tempoTotal = exerciciosTreino.length * 20;

  async function salvarTreino() {
    if (!nomeTreino || exerciciosTreino.length === 0) {
      alert("Informe o nome e adicione exercícios");
      return;
    }
    try {
      const treinoId = await TreinoAPI.criarAsync({ nomeTreino, usuarioId }, token);
      if (!treinoId || treinoId <= 0) {
        alert("Erro: treino inválido ou não criado corretamente.");
        return;
      }
      for (const ex of exerciciosTreino) {
        await TreinoExercicioAPI.adicionarAsync(
          { treinoId, exercicioId: ex.exercicioId, series: ex.series, repeticoes: ex.repeticoes, descansoSegundos: ex.descansoSegundos },
          token
        );
      }
      navigate("/app/treinos");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar treino");
    }
  }

  return (
    <div className={style.page}>
      {/* Coluna Esquerda — Seleção */}
      <div className={style.colunaEsquerda}>
        <div className={style.colHeader}>
          <h2 className={style.title}>Novo Treino</h2>
          <p className={style.subtitle}>Configure e adicione exercícios.</p>
        </div>

        <div className={style.fieldGroup}>
          <label className={style.fieldLabel}>Nome do treino</label>
          <input
            className={style.input}
            placeholder="Ex: Peito e Tríceps"
            value={nomeTreino}
            onChange={(e) => setNomeTreino(e.target.value)}
          />
        </div>

        <div className={style.fieldGroup}>
          <label className={style.fieldLabel}>Grupo muscular</label>
          <select
            className={style.select}
            value={grupoMuscular}
            onChange={(e) => setGrupoMuscular(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="Peito">Peito</option>
            <option value="Costas">Costas</option>
            <option value="Pernas">Pernas</option>
            <option value="Ombros">Ombros</option>
            <option value="Biceps">Bíceps</option>
            <option value="Triceps">Tríceps</option>
            <option value="Abdomen">Abdômen</option>
          </select>
        </div>

        {exerciciosDisponiveis.length > 0 && (
          <div className={style.listaExercicios}>
            <span className={style.listaLabel}>Exercícios disponíveis</span>
            {exerciciosDisponiveis.map((ex) => {
              const adicionado = exerciciosTreino.some((e) => e.exercicioId === ex.exercicioId);
              return (
                <div key={ex.exercicioId} className={style.exercicioLinha}>
                  <span className={style.exercicioNome}>{ex.nome}</span>
                  <button
                    className={`${style.btnAdicionar} ${adicionado ? style.btnAdicionado : ""}`}
                    onClick={() => adicionarExercicio(ex)}
                    disabled={adicionado}
                  >
                    {adicionado ? "✓" : "+"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Coluna Direita — Treino montado */}
      <div className={style.colunaDireita}>
        <div className={style.colHeader}>
          <h3 className={style.title}>Exercícios do Treino</h3>
          <p className={style.subtitle}>{exerciciosTreino.length} exercício(s) — {tempoTotal} min estimados</p>
        </div>

        <div className={style.cardsList}>
          {exerciciosTreino.length === 0 ? (
            <div className={style.vazio}>
              <p>Adicione exercícios à esquerda para montar o treino.</p>
            </div>
          ) : (
            exerciciosTreino.map((ex, index) => (
              <div key={ex.exercicioId} className={style.cardExercicio}>
                <div className={style.cardExHeader}>
                  <strong className={style.cardExNome}>{ex.nome}</strong>
                  <button className={style.btnRemover} onClick={() => removerExercicio(ex.exercicioId)}>✕</button>
                </div>

                <div className={style.campos}>
                  <div className={style.campoItem}>
                    <label className={style.campoLabel}>Séries</label>
                    <input
                      className={style.campoInput}
                      type="number"
                      value={ex.series}
                      onChange={(e) => atualizarCampo(index, "series", e.target.value)}
                    />
                  </div>
                  <div className={style.campoItem}>
                    <label className={style.campoLabel}>Repetições</label>
                    <input
                      className={style.campoInput}
                      type="number"
                      value={ex.repeticoes}
                      onChange={(e) => atualizarCampo(index, "repeticoes", e.target.value)}
                    />
                  </div>
                  <div className={style.campoItem}>
                    <label className={style.campoLabel}>Pausa (s)</label>
                    <input
                      className={style.campoInput}
                      type="number"
                      value={ex.descansoSegundos}
                      onChange={(e) => atualizarCampo(index, "descansoSegundos", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={style.footer}>
          <span className={style.footerTempo}>Tempo total: {tempoTotal} min</span>
          <button className={style.btnSalvar} onClick={salvarTreino}>
            Salvar Treino
          </button>
        </div>
      </div>
    </div>
  );
}