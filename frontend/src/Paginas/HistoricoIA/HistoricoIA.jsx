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
        const url = `https://api.dicebear.com/7.x/${usuario.avatarEstilo}/svg?seed=${usuario.avatarSeed}`;
        setAvatarUrl(url);
      } catch (err) {
        console.error("Erro ao carregar histórico IA", err);
      } finally {
        setLoading(false);
      }
    }

    if (usuarioId && token) {
      carregar();
    }
  }, [usuarioId, token]);


  const historicoFiltrado = historico.filter((item) =>
    item.pergunta.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return <p className={styles.loading}>Carregando histórico...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Histórico da IA</h1>

  
      <div className={styles.searchWrapper}>
        <SearchBar
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar pergunta..."
          width="100%"
        />
      </div>

      {historicoFiltrado.length === 0 && (
        <p className={styles.empty}>Nenhuma interação encontrada.</p>
      )}

      {historicoFiltrado.map((item) => (
        <div
          key={item.iaInteracaoId}
          className={styles.card}
          onClick={() => setSelecionado(item)}
        >
          <div className={styles.perguntaLinha}>
            <img
              src={avatarUrl}
              alt="Avatar do usuário"
              className={styles.avatarMini}
            />

            <div className={styles.perguntaConteudo}>
              <strong>Você</strong>
              <p className={styles.perguntaTexto}>{item.pergunta}</p>
            </div>
          </div>

          <p className={styles.respostaCurta}>
            {item.resposta.length > 120
              ? item.resposta.substring(0, 120) + "..."
              : item.resposta}
          </p>

          <span className={styles.data}>
            {new Date(item.dataHora).toLocaleString("pt-BR")}
          </span>
        </div>
      ))}

      {selecionado && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelecionado(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Pergunta</h3>
            <p className={styles.modalTexto}>{selecionado.pergunta}</p>

            <h3>Resposta</h3>
            <p className={styles.modalTexto}>{selecionado.resposta}</p>

            <button className={styles.fechar} onClick={() => setSelecionado(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
