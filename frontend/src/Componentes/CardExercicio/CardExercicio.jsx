import style from "./CardExercicio.module.css";

function CampoNumerico({ label, valor, aoAlterar }) {
  return (
    <div className={style.campoItem}>
      <label className={style.campoLabel}>{label}</label>
      <input
        className={style.campoInput}
        type="number"
        value={valor}
        onChange={(e) => aoAlterar(e.target.value)}
      />
    </div>
  );
}

// Card de um exercício dentro do treino, com séries, repetições e pausa editáveis.
export function CardExercicio({ exercicio, aoRemover, aoAlterarCampo }) {
  return (
    <div className={style.cardExercicio}>
      <div className={style.cardExHeader}>
        <strong className={style.cardExNome}>{exercicio.nome}</strong>
        <button className={style.btnRemover} onClick={() => aoRemover(exercicio.exercicioId)}>
          ✕
        </button>
      </div>

      <div className={style.campos}>
        <CampoNumerico
          label="Séries"
          valor={exercicio.series}
          aoAlterar={(valor) => aoAlterarCampo("series", valor)}
        />
        <CampoNumerico
          label="Repetições"
          valor={exercicio.repeticoes}
          aoAlterar={(valor) => aoAlterarCampo("repeticoes", valor)}
        />
        <CampoNumerico
          label="Pausa (s)"
          valor={exercicio.descansoSegundos}
          aoAlterar={(valor) => aoAlterarCampo("descansoSegundos", valor)}
        />
      </div>
    </div>
  );
}
