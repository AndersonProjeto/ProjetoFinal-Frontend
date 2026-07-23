import style from "./RodapeTreino.module.css";

export function RodapeTreino({ tempoTotal, textoBotao, aoSalvar }) {
  return (
    <div className={style.footer}>
      <span className={style.footerTempo}>Tempo total: {tempoTotal} min</span>
      <button className={style.btnSalvar} onClick={aoSalvar}>
        {textoBotao}
      </button>
    </div>
  );
}
