import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TreinoAPI from "../../client/TreinoAPI";
import ExercicioAPI from "../../client/ExercicioAPI";
import { FiArrowLeft } from "react-icons/fi";
import style from "./TreinoDetalhe.module.css";
import TreinoExercicioAPI from "../../client/TreinoExercicioAPI";

function formatarData(dataUtc) {
  if (!dataUtc) return "—";
  const [ano, mes, dia] = dataUtc.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
}

export function TreinoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [treino, setTreino] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const treinoDados = await TreinoAPI.obterAsync(id, token);
        const treinoExercicios = await TreinoExercicioAPI.listarPorTreinoAsync(id, token);

        const completos = await Promise.all(
          treinoExercicios.map(async (te) => {
            const exercicioInfo = await ExercicioAPI.obterAsync(te.exercicioId, token);
            
            return {
              ...te,            // Pega as info do treino (séries, reps, descanso)
              ...exercicioInfo, // Pega TODAS as info do exercício (descricao, nome, grupo, etc)
              exercicioNome: exercicioInfo.nome, // Mantém para o seu <strong>
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
  }, [id, token]);

  if (carregando) return <p className={style.loading}>Carregando...</p>;
  if (!treino) return <p>Treino não encontrado</p>;

  const tempoTotal = exercicios.length * 20;

  return (
    <div className={style.page}>
      <div className={style.header}>
        <button className={style.voltar} onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </button>

        <div>
          <h2 className={style.titulo}>{treino.nomeTreino}</h2>
          <span className={style.subtitulo}>
            Criado em {formatarData(treino.dataCriacao)}
          </span>
        </div>
      </div>

      <div className={style.resumo}>
        <span>{exercicios.length} exercícios</span>
        <span>{tempoTotal} min estimados</span>
      </div>

      <div className={style.lista}>
        {exercicios.map((ex) => (
          <div 
            key={ex.treinoExercicioId} 
            className={style.card}
            // Navega passando o objeto 'ex' completo no state para a tela de detalhes
            onClick={() => navigate("/app/exercicios/detalhes", { state: ex })}
          >
            <strong>{ex.exercicioNome}</strong>

            <div className={style.detalhes}>
              <span>{ex.series} séries</span>
              <span>{ex.repeticoes} reps</span>
              <span>{ex.descansoSegundos}s pausa</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}