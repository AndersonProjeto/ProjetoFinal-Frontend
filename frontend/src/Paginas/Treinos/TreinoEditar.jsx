import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./TreinoEditar.module.css";
import TreinoAPI from "../../client/TreinoAPI";
import ExercicioAPI from "../../client/ExercicioAPI";
import TreinoExercicioAPI from "../../client/TreinoExercicioAPI";



export function TreinoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [nomeTreino, setNomeTreino] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState([]);
  const [exerciciosTreino, setExerciciosTreino] = useState([]);
  const [removidos, setRemovidos] = useState([]);

  /* 🔹 CARREGAR TREINO + EXERCÍCIOS */
  useEffect(() => {
    async function carregarTreino() {
      try {
        const treino = await TreinoAPI.obterAsync(id, token);
        setNomeTreino(treino.nomeTreino);
        setGrupoMuscular(treino.grupoMuscular || "");

        const treinoExercicios =
          await TreinoExercicioAPI.listarPorTreinoAsync(id, token);

        const completos = await Promise.all(
          treinoExercicios.map(async (te) => {
            const exercicio = await ExercicioAPI.obterAsync(
              te.exercicioId,
              token
            );

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

  /* 🔹 LISTAR EXERCÍCIOS POR GRUPO */
  useEffect(() => {
    if (!grupoMuscular) return;

    ExercicioAPI
      .listarPorGrupoAsync(grupoMuscular, token)
      .then(setExerciciosDisponiveis);
  }, [grupoMuscular]);

  /* 🔹 ADICIONAR EXERCÍCIO */
  function adicionarExercicio(ex) {
    if (exerciciosTreino.some(e => e.exercicioId === ex.exercicioId)) return;

    setExerciciosTreino([
      ...exerciciosTreino,
      {
        treinoExercicioId: null, // NOVO
        exercicioId: ex.exercicioId,
        nome: ex.nome,
        series: 4,
        repeticoes: 12,
        descansoSegundos: 90,
      },
    ]);
  }

  /* 🔹 REMOVER EXERCÍCIO */
  function removerExercicio(exercicioId) {
    const ex = exerciciosTreino.find(e => e.exercicioId === exercicioId);

    if (ex?.treinoExercicioId) {
      setRemovidos([...removidos, ex.treinoExercicioId]);
    }

    setExerciciosTreino(
      exerciciosTreino.filter(e => e.exercicioId !== exercicioId)
    );
  }

  /* 🔹 ATUALIZAR CAMPOS */
  function atualizarCampo(index, campo, valor) {
    const copia = [...exerciciosTreino];
    copia[index][campo] = Number(valor);
    setExerciciosTreino(copia);
  }

  /* 🔹 SALVAR */
  async function salvarEdicao() {
    try {
      // atualiza treino
      await TreinoAPI.atualizarAsync(
        { treinoId: id, nomeTreino },
        token
      );

      // deletar removidos
      for (const treinoExercicioId of removidos) {
        await TreinoExercicioAPI.deletarAsync(treinoExercicioId, token);
      }

      // atualizar ou criar
      for (const ex of exerciciosTreino) {
        if (ex.treinoExercicioId) {
          await TreinoExercicioAPI.atualizarAsync(
            {
              treinoExercicioId: ex.treinoExercicioId,
              series: ex.series,
              repeticoes: ex.repeticoes,
              descansoSegundos: ex.descansoSegundos,
            },
            token
          );
        } else {
          await TreinoExercicioAPI.adicionarAsync(
            {
              treinoId: id,
              exercicioId: ex.exercicioId,
              series: ex.series,
              repeticoes: ex.repeticoes,
              descansoSegundos: ex.descansoSegundos,
            },
            token
          );
        }
      }

      navigate("/app/treinos");
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar alterações");
    }
  }

  return (
    <div className={style.page}>
      {/* ESQUERDA */}
      <div className={style.colunaEsquerda}>
        <h2>Editar Treino</h2>

        <input
          value={nomeTreino}
          onChange={e => setNomeTreino(e.target.value)}
          placeholder="Nome do treino"
        />

        <select
          value={grupoMuscular}
          onChange={e => setGrupoMuscular(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="Peito">Peito</option>
          <option value="Costas">Costas</option>
          <option value="Pernas">Pernas</option>
          <option value="Ombros">Ombros</option>
          <option value="Biceps">Bíceps</option>
          <option value="Triceps">Tríceps</option>
          <option value="Abdomen">Abdômen</option>
        </select>

        {exerciciosDisponiveis.map(ex => (
          <div key={ex.exercicioId} className={style.exercicioLinha}>
            <span>{ex.nome}</span>
           <button
            className={style.botaoAdicionar}
            onClick={() => adicionarExercicio(ex)}
          >
            Adicionar
          </button>

          </div>
        ))}
      </div>

      {/* DIREITA */}
      <div className={style.colunaDireita}>
        <h3>Exercícios do Treino</h3>

        {exerciciosTreino.map((ex, index) => (
          <div key={ex.exercicioId} className={style.cardExercicio}>
            <strong>{ex.nome}</strong>

                <div className={style.campoLinha}>
                <span>Séries</span>
                <input
                  type="number"
                  value={ex.series}
                  onChange={e => atualizarCampo(index, "series", e.target.value)}
                />
              </div>

              <div className={style.campoLinha}>
                <span>Repetições</span>
                <input
                  type="number"
                  value={ex.repeticoes}
                  onChange={e => atualizarCampo(index, "repeticoes", e.target.value)}
                />
              </div>

              <div className={style.campoLinha}>
                <span>Descanso(s)</span>
                <input
                  type="number"
                  value={ex.descansoSegundos}
                  onChange={e =>
                    atualizarCampo(index, "descansoSegundos", e.target.value)
                  }
                />
              </div>


            <button onClick={() => removerExercicio(ex.exercicioId)}>
              Remover
            </button>
          </div>
        ))}

        <button onClick={salvarEdicao}>Salvar Alterações</button>
      </div>
    </div>
  );
}