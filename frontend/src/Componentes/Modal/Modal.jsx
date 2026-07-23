import style from "./Modal.module.css";

// Casca de modal compartilhada: overlay que fecha ao clicar fora, cabeçalho com
// título e botão de fechar. O conteúdo vai como children.
// maxWidth/gap/scroll existem porque cada tela usa a mesma casca em medidas diferentes.
export function Modal({ titulo, aoFechar, maxWidth = 480, gap, scroll = false, children }) {
  const estiloCaixa = {
    maxWidth,
    ...(gap ? { display: "flex", flexDirection: "column", gap } : null),
    ...(scroll ? { maxHeight: "80vh", overflowY: "auto" } : null),
  };

  return (
    <div className={style.modalOverlay} onClick={aoFechar}>
      <div className={style.modal} style={estiloCaixa} onClick={(e) => e.stopPropagation()}>
        <div className={style.modalHeader}>
          <h3 className={style.modalTitulo}>{titulo}</h3>
          <button className={style.closeBtn} onClick={aoFechar}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
