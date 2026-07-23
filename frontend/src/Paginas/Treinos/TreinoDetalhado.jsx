import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TreinoAPI from "../../client/TreinoAPI";
import ExercicioAPI from "../../client/ExercicioAPI";
import style from "./TreinoDetalhe.module.css";
import TreinoExercicioAPI from "../../client/TreinoExercicioAPI";
import { IconArrowLeft } from "../../Componentes/Icones/Icones";
import { formatarData } from "../../utils/formatarData";

export function TreinoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [treino, setTreino] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const treinoDados = await TreinoAPI.obterAsync(id);
        const treinoExercicios = await TreinoExercicioAPI.listarPorTreinoAsync(id);

        // Mesma lógica do original que funciona
        const completos = await Promise.all(
          treinoExercicios.map(async (te) => {
            const exercicioInfo = await ExercicioAPI.obterAsync(te.exercicioId);
            return {
              ...te,
              exercicioNome: exercicioInfo.nome,
              exercicioInfo,
            };
          })
        );

        setTreino(treinoDados);
        setExercicios(completos);
      } catch (e) {
        console.error(e);
        alert("Erro ao carregar treino");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  if (carregando) return <p className={style.loading}>Carregando...</p>;
  if (!treino) return <p>Treino não encontrado</p>;

  const tempoTotal = exercicios.length * 20;

  return (
    <div className={style.page}>
      {/* Header */}
      <div className={style.header}>
        <button className={style.voltar} onClick={() => navigate(-1)}>
          <IconArrowLeft />
        </button>
        <div>
          <h2 className={style.titulo}>{treino.nomeTreino}</h2>
          <span className={style.subtitulo}>Criado em {formatarData(treino.dataCriacao)}</span>
        </div>
      </div>

      {/* Resumo */}
      <div className={style.resumo}>
        <div className={style.resumoItem}>
          <span className={style.resumoLabel}>Exercícios</span>
          <span className={style.resumoValor}>{exercicios.length}</span>
        </div>
        <div className={style.resumoDivider} />
        <div className={style.resumoItem}>
          <span className={style.resumoLabel}>Tempo estimado</span>
          <span className={style.resumoValor}>{tempoTotal} min</span>
        </div>
      </div>

      {/* Lista — navigate usa os campos do ...te, igual ao original */}
      <div className={style.lista}>
        {exercicios.map((ex, i) => (
          <div
            key={ex.treinoExercicioId}
            className={style.card}
            onClick={() =>
              navigate("/app/exercicios/detalhes", {
                state: {
                  exercicioId: ex.exercicioId,
                  nome: ex.exercicioNome,
                  grupoMuscular: ex.exercicioInfo?.grupoMuscular,
                  equipamento: ex.exercicioInfo?.equipamento,
                  descricao: ex.exercicioInfo?.descricao,
                  videoUrl: ex.exercicioInfo?.videoUrl,
                },
              })
            }
          >
            <div className={style.cardNumero}>{String(i + 1).padStart(2, "0")}</div>
            <div className={style.cardCorpo}>
              <strong className={style.cardNome}>{ex.exercicioNome}</strong>
              <div className={style.detalhes}>
                <span>{ex.series} séries</span>
                <span>{ex.repeticoes} reps</span>
                <span>{ex.descansoSegundos}s pausa</span>
              </div>
            </div>
            <span className={style.cardArrow}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}