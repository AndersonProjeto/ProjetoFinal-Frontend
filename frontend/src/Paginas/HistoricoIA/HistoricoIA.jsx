import { useEffect, useState } from "react";
import styles from "./HistoricoIA.module.css";
import IAAPI from "../../client/IAAPI";
import UsuarioAPI from "../../client/UsuarioAPI";
import { SearchBar } from "../../Componentes/Pesquisa/Pesquisa";

export function HistoricoIA() {
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecionado, setSelecionado] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await IAAPI.listarInteracoesAsync(usuarioId, token);
        setHistorico(dados);
        const usuario = await UsuarioAPI.obterAsync(usuarioId, token);
        setAvatarUrl(`https://api.dicebear.com/7.x/${usuario.avatarEstilo}/svg?seed=${usuario.avatarSeed}`);
      } catch (err) {
        console.error("Erro ao carregar histórico IA", err);
      } finally {
        setLoading(false);
      }
    }
    if (usuarioId && token) carregar();
  }, [usuarioId, token]);

  const historicoFiltrado = historico.filter((item) =>
    item.pergunta.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <p className={styles.loading}>Carregando histórico...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Histórico da IA</h1>
        <p className={styles.subtitle}>Todas as suas interações com a AcadIA</p>
      </div>

      <div className={styles.searchWrapper}>
        <SearchBar
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar pergunta..."
          width="100%"
        />
      </div>

      {historicoFiltrado.length === 0 && (
        <div className={styles.vazio}>
          <p className={styles.vazioTitulo}>Nenhuma interação encontrada</p>
          <p className={styles.vazioDesc}>Tente ajustar a busca ou inicie uma conversa com a AcadIA.</p>
        </div>
      )}

      <div className={styles.lista}>
        {historicoFiltrado.map((item) => (
          <div key={item.iaInteracaoId} className={styles.card} onClick={() => setSelecionado(item)}>

            <div className={styles.bloco}>
              <div className={styles.blocoHeader}>
                <img src={avatarUrl} alt="Avatar" className={styles.avatarMini} />
                <span className={styles.blocoLabel}>Pergunta</span>
              </div>
              <p className={styles.blocoTexto}>{item.pergunta}</p>
            </div>

            <div className={styles.divisor} />

            <div className={styles.bloco}>
              <div className={styles.blocoHeader}>
                <div className={styles.iaIcone}>IA</div>
                <span className={styles.blocoLabel}>Resposta</span>
              </div>
              <p className={styles.blocoTexto}>
                {item.resposta.length > 160 ? item.resposta.substring(0, 160) + "..." : item.resposta}
              </p>
            </div>

            <span className={styles.data}>{new Date(item.dataHora).toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </div>

      {selecionado && (
        <div className={styles.modalOverlay} onClick={() => setSelecionado(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitulo}>Interação completa</h3>
              <button className={styles.closeBtn} onClick={() => setSelecionado(null)}>✕</button>
            </div>

            <div className={styles.modalBloco}>
              <div className={styles.blocoHeader}>
                <img src={avatarUrl} alt="Avatar" className={styles.avatarMini} />
                <span className={styles.blocoLabel}>Pergunta</span>
              </div>
              <p className={styles.modalTexto}>{selecionado.pergunta}</p>
            </div>

            <div className={styles.divisor} />

            <div className={styles.modalBloco}>
              <div className={styles.blocoHeader}>
                <div className={styles.iaIcone}>IA</div>
                <span className={styles.blocoLabel}>Resposta</span>
              </div>
              <p className={styles.modalTexto}>{selecionado.resposta}</p>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.fechar} onClick={() => setSelecionado(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}