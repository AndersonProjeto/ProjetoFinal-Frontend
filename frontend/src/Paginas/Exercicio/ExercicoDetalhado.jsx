import { useLocation, useNavigate } from "react-router-dom";
import style from "./ExercicioDetalhado.module.css";

export function ExercicioDetalhado() {
  const location = useLocation();
  const navigate = useNavigate();

  const exercicio = location.state;

  if (!exercicio) {
    return (
      <div className={style.page}>
        <div className={style.card}>
          <h2 className={style.title}>Exercício não encontrado</h2>
          <button className={style.button} onClick={() => navigate(-1)}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={style.page}>
      <div className={style.card}>
        <h2 className={style.title}>{exercicio.nome}</h2>

        <div className={style.info}>
          <div className={style.row}>
            <span className={style.label}>Grupo Muscular</span>
            <span className={style.value}>{exercicio.grupoMuscular}</span>
          </div>

          <div className={style.row}>
            <span className={style.label}>Equipamento</span>
            <span className={style.value}>
              {exercicio.equipamento || "Nenhum"}
            </span>
          </div>

          <div className={style.row}>
            <span className={style.label}>Descrição</span>
            <span className={style.value}>
              {exercicio.descricao || "Nenhuma descrição disponível."}
            </span>
          </div>
        </div>

        <button className={style.button} onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    </div>
  );
}
