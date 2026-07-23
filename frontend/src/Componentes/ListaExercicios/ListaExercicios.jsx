import style from "./ListaExercicios.module.css";

// Lista os exercícios do grupo muscular selecionado, marcando os que já estão no treino.
export function ListaExercicios({ exercicios, exerciciosNoTreino, aoAdicionar }) {
  if (exercicios.length === 0) return null;

  return (
    <div className={style.listaExercicios}>
      <span className={style.listaLabel}>Exercícios disponíveis</span>
      {exercicios.map((ex) => {
        const adicionado = exerciciosNoTreino.some((e) => e.exercicioId === ex.exercicioId);
        return (
          <div key={ex.exercicioId} className={style.exercicioLinha}>
            <span className={style.exercicioNome}>{ex.nome}</span>
            <button
              className={`${style.btnAdicionar} ${adicionado ? style.btnAdicionado : ""}`}
              onClick={() => aoAdicionar(ex)}
              disabled={adicionado}
            >
              {adicionado ? "✓" : "+"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
