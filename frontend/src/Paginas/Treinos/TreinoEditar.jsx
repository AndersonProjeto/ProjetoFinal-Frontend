import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import style from "./TreinoEditar.module.css";
import TreinoAPI from "../../client/TreinoAPI";
import ExercicioAPI from "../../client/ExercicioAPI";
import TreinoExercicioAPI from "../../client/TreinoExercicioAPI";
import { SeletorGrupoMuscular } from "../../Componentes/SeletorGrupoMuscular/SeletorGrupoMuscular";
import { ListaExercicios } from "../../Componentes/ListaExercicios/ListaExercicios";
import { CardExercicio } from "../../Componentes/CardExercicio/CardExercicio";
import { RodapeTreino } from "../../Componentes/RodapeTreino/RodapeTreino";

export function TreinoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nomeTreino, setNomeTreino] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
  const [exerciciosTreino, setExerciciosTreino] = useState([]);
  const [removidos, setRemovidos] = useState([]);

  useEffect(() => {
    async function carregarTreino() {
      try {
        const treino = await TreinoAPI.obterAsync(id);
        setNomeTreino(treino.nomeTreino);
        setGrupoMuscular(treino.grupoMuscular || "");
        const treinoExercicios = await TreinoExercicioAPI.listarPorTreinoAsync(id);
        const completos = await Promise.all(
          treinoExercicios.map(async (te) => {
            const exercicio = await ExercicioAPI.obterAsync(te.exercicioId);
            return {
              treinoExercicioId: te.treinoExercicioId,
              exercicioId: te.exercicioId,
              nome: exercicio.nome,
              series: te.series,
              repeticoes: te.repeticoes,
              descansoSegundos: te.descansoSegundos,
            };
          })
        );
        setExerciciosTreino(completos);
      } catch (e) {
        console.error(e);
        alert("Erro ao carregar treino");
      }
    }
    carregarTreino();
  }, [id]);

  useEffect(() => {
    if (!grupoMuscular) return;
    ExercicioAPI.listarPorGrupoAsync(grupoMuscular).then(setExerciciosDisponiveis);
  }, [grupoMuscular]);

  function adicionarExercicio(ex) {
    if (exerciciosTreino.some((e) => e.exercicioId === ex.exercicioId)) return;
    setExerciciosTreino([
      ...exerciciosTreino,
      { treinoExercicioId: null, exercicioId: ex.exercicioId, nome: ex.nome, series: 4, repeticoes: 12, descansoSegundos: 90 },
    ]);
  }

  function removerExercicio(exercicioId) {
    const ex = exerciciosTreino.find((e) => e.exercicioId === exercicioId);
    if (ex?.treinoExercicioId) setRemovidos([...removidos, ex.treinoExercicioId]);
    setExerciciosTreino(exerciciosTreino.filter((e) => e.exercicioId !== exercicioId));
  }

  function atualizarCampo(index, campo, valor) {
    const copia = [...exerciciosTreino];
    copia[index][campo] = Number(valor);
    setExerciciosTreino(copia);
  }

  async function salvarEdicao() {
    try {
      await TreinoAPI.atualizarAsync({ treinoId: id, nomeTreino });
      for (const treinoExercicioId of removidos) {
        await TreinoExercicioAPI.deletarAsync(treinoExercicioId);
      }
      for (const ex of exerciciosTreino) {
        if (ex.treinoExercicioId) {
          await TreinoExercicioAPI.atualizarAsync(
            { treinoExercicioId: ex.treinoExercicioId, series: ex.series, repeticoes: ex.repeticoes, descansoSegundos: ex.descansoSegundos }
          );
        } else {
          await TreinoExercicioAPI.adicionarAsync(
            { treinoId: id, exercicioId: ex.exercicioId, series: ex.series, repeticoes: ex.repeticoes, descansoSegundos: ex.descansoSegundos }
          );
        }
      }
      navigate("/app/treinos");
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar alterações");
    }
  }

  const tempoTotal = exerciciosTreino.length * 20;

  return (
    <div className={style.page}>
      {/* Coluna Esquerda */}
      <div className={style.colunaEsquerda}>
        <div className={style.colHeader}>
          <button className={style.voltar} onClick={() => navigate(-1)}>
            <FiArrowLeft size={15} />
          </button>
          <div>
            <h2 className={style.title}>Editar Treino</h2>
            <p className={style.subtitle}>Ajuste nome, exercícios e configurações.</p>
          </div>
        </div>

        <div className={style.fieldGroup}>
          <label className={style.fieldLabel}>Nome do treino</label>
          <input
            className={style.input}
            value={nomeTreino}
            onChange={(e) => setNomeTreino(e.target.value)}
            placeholder="Nome do treino"
          />
        </div>

        <SeletorGrupoMuscular
          label="Adicionar exercícios"
          placeholder="Selecione o grupo muscular..."
          value={grupoMuscular}
          onChange={(e) => setGrupoMuscular(e.target.value)}
        />

        <ListaExercicios
          exercicios={exerciciosDisponiveis}
          exerciciosNoTreino={exerciciosTreino}
          aoAdicionar={adicionarExercicio}
        />
      </div>

      {/* Coluna Direita */}
      <div className={style.colunaDireita}>
        <div className={style.colHeader}>
          <h3 className={style.title}>Exercícios do Treino</h3>
          <p className={style.subtitle}>{exerciciosTreino.length} exercício(s) — {tempoTotal} min estimados</p>
        </div>

        <div className={style.cardsList}>
          {exerciciosTreino.length === 0 ? (
            <div className={style.vazio}>
              <p>Nenhum exercício no treino. Adicione pelo painel à esquerda.</p>
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
          textoBotao="Salvar Alterações"
          aoSalvar={salvarEdicao}
        />
      </div>
    </div>
  );
}