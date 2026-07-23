import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./TreinoAdicionar.module.css";
import TreinoAPI from "../../client/TreinoAPI";
import TreinoExercicioAPI from "../../client/TreinoExercicioAPI";
import ExercicioAPI from "../../client/ExercicioAPI";
import { sessao } from "../../client/sessao";
import { SeletorGrupoMuscular } from "../../Componentes/SeletorGrupoMuscular/SeletorGrupoMuscular";
import { ListaExercicios } from "../../Componentes/ListaExercicios/ListaExercicios";
import { CardExercicio } from "../../Componentes/CardExercicio/CardExercicio";
import { RodapeTreino } from "../../Componentes/RodapeTreino/RodapeTreino";

export function TreinoAdicionar() {
  const navigate = useNavigate();
  const usuarioId = sessao.usuarioId();

  const [nomeTreino, setNomeTreino] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
  const [exerciciosTreino, setExerciciosTreino] = useState([]);

  useEffect(() => {
    if (!grupoMuscular) return;
    async function carregar() {
      const dados = await ExercicioAPI.listarPorGrupoAsync(grupoMuscular);
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
      const treinoId = await TreinoAPI.criarAsync({ nomeTreino, usuarioId });
      if (!treinoId || treinoId <= 0) {
        alert("Erro: treino inválido ou não criado corretamente.");
        return;
      }
      for (const ex of exerciciosTreino) {
        await TreinoExercicioAPI.adicionarAsync(
          { treinoId, exercicioId: ex.exercicioId, series: ex.series, repeticoes: ex.repeticoes, descansoSegundos: ex.descansoSegundos }
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

        <SeletorGrupoMuscular
          label="Grupo muscular"
          placeholder="Selecione..."
          value={grupoMuscular}
          onChange={(e) => setGrupoMuscular(e.target.value)}
        />

        <ListaExercicios
          exercicios={exerciciosDisponiveis}
          exerciciosNoTreino={exerciciosTreino}
          aoAdicionar={adicionarExercicio}
        />
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
              <CardExercicio
                key={ex.exercicioId}
                exercicio={ex}
                aoRemover={removerExercicio}
                aoAlterarCampo={(campo, valor) => atualizarCampo(index, campo, valor)}
              />
            ))
          )}
        </div>

        <RodapeTreino
          tempoTotal={tempoTotal}
          textoBotao="Salvar Treino"
          aoSalvar={salvarTreino}
        />
      </div>
    </div>
  );
}