import {useEffect, useState } from "react";
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
    if (exerciciosTreino.some((e) => e.exercicioId === ex.exercicioId)) {
      return;
    }

    setExerciciosTreino([
      ...exerciciosTreino,
      {
        exercicioId: ex.exercicioId,
        nome: ex.nome,
        series: 4,
        repeticoes: 12,
        descansoSegundos: 90,
      },
    ]);
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
    const treinoCriado = await TreinoAPI.criarAsync(
      {
        nomeTreino,
        usuarioId,
      },
      token
    );
    const treinoId = treinoCriado;

    if (!treinoId || treinoId <= 0) {
      alert("Erro: treino inválido ou não criado corretamente.");
      return;
    }

    for (const ex of exerciciosTreino) {
      await TreinoExercicioAPI.adicionarAsync(
        {
          treinoId,
          exercicioId: ex.exercicioId,
          series: ex.series,
          repeticoes: ex.repeticoes,
          descansoSegundos: ex.descansoSegundos,
        },
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
      <div className={style.colunaEsquerda}>
        <h2 className={style.title}>Novo Treino</h2>

        <input className={style.inputNome}
          placeholder="Nome do treino"
          value={nomeTreino}
          onChange={(e) => setNomeTreino(e.target.value)}
        />

        <select
          value={grupoMuscular}
          onChange={(e) => setGrupoMuscular(e.target.value)}
        >
          <option value="">Selecione o grupo muscular</option>
          <option value="Peito">Peito</option>
          <option value="Costas">Costas</option>
          <option value="Pernas">Pernas</option>
          <option value="Ombros">Ombros</option>
          <option value="Biceps">Biceps</option>
          <option value="Triceps">Triceps</option>
          <option value="Abdomen">Abdomen</option>
        </select>

        <div className={style.lista}>
          {exerciciosDisponiveis.map((ex) => (
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
      </div>

      <div className={style.colunaDireita}>
        <h3 className={style.subTitle}>Exercícios do Treino</h3>

        {exerciciosTreino.map((ex, index) => (
          <div key={ex.exercicioId} className={style.cardExercicio}>
            <strong>{ex.nome}</strong>

            <div className={style.campos}>
              <div className={style.campoItem}>
                <label>SÉRIES</label>
                <input
                  type="number"
                  value={ex.series}
                  onChange={(e) =>
                    atualizarCampo(index, "series", e.target.value)
                  }
                />
              </div>

              <div className={style.campoItem}>
                <label>Repetições</label>
                <input
                  type="number"
                  value={ex.repeticoes}
                  onChange={(e) =>
                    atualizarCampo(index, "repeticoes", e.target.value)
                  }
                />
              </div>

              <div className={style.campoItem}>
                <label>PAUSA(s)</label>
                <input
                  type="number"
                  value={ex.descansoSegundos}
                  onChange={(e) =>
                    atualizarCampo(index, "descansoSegundos", e.target.value)
                  }
                />
              </div>
            </div>

            <div className={style.tempo}>
              Tempo estimado: 20 minutos
            </div>
          </div>
        ))}

        <div className={style.footer}>
          <span>Tempo total: {tempoTotal} min</span>
          <button className={style.salvar} onClick={salvarTreino}>
            Salvar Treino
          </button>
        </div>
      </div>
    </div>
  );
}