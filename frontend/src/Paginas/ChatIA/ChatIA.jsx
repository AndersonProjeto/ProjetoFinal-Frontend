import { useEffect, useRef, useState } from "react";
import IAAPI from "../../client/IAAPI";
import ReactMarkdown from "react-markdown";
import styles from "./ChatIA.module.css";
import UsuarioAPI from "../../client/UsuarioAPI";
import { useNavigate } from "react-router-dom";

function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f8f5ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

export function ChatIA() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const chatRef = useRef(null);

  useEffect(() => {
    async function carregarAvatar() {
      if (!token || !usuarioId) return;
      const usuario = await UsuarioAPI.obterAsync(usuarioId, token);
      const url = `https://api.dicebear.com/7.x/${usuario.avatarEstilo}/svg?seed=${usuario.avatarSeed}`;
      setAvatarUrl(url);
    }
    carregarAvatar();
  }, [usuarioId, token]);

  useEffect(() => {
    async function carregar() {
      if (!token || !usuarioId) return;
      const interacoes = await IAAPI.ultimasInteracoesAsync(Number(usuarioId), 10, token);
      const formatado = interacoes.reverse().map((i) => [
        { tipo: "usuario", texto: i.pergunta, avatar: avatarUrl, hora: i.dataHora },
        { tipo: "bot", texto: i.resposta, hora: i.dataHora },
      ]).flat();
      setChat(formatado);
    }
    carregar();
  }, [usuarioId, token, avatarUrl]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  function digitarResposta(texto) {
    let i = 0;
    setChat((prev) => [...prev, { tipo: "bot", texto: "", hora: new Date() }]);
    const interval = setInterval(() => {
      i++;
      setChat((prev) => {
        const novo = [...prev];
        novo[novo.length - 1] = { tipo: "bot", texto: texto.slice(0, i), hora: new Date() };
        return novo;
      });
      if (i >= texto.length) clearInterval(interval);
    }, 22);
  }

  async function enviar() {
    if (!mensagem.trim() || carregando) return;
    setChat((prev) => [...prev, { tipo: "usuario", texto: mensagem, avatar: avatarUrl, hora: new Date() }]);
    setMensagem("");
    setCarregando(true);
    try {
      const resposta = await IAAPI.salvarInteracaoAsync({ UsuarioId: Number(usuarioId), Pergunta: mensagem }, token);
      digitarResposta(resposta.resposta);
    } catch {
      setChat((prev) => [...prev, { tipo: "bot", texto: "Erro ao obter resposta.", hora: new Date() }]);
    } finally {
      setCarregando(false);
    }
  }

  function formatarHora(dataHora) {
    const data = new Date(dataHora);
    return `${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`;
  }

  return (
    <div className={styles.page}>
      <div className={styles.chatBox}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>AcadIA</h2>
            <p className={styles.subtitle}>Seu assistente de performance & saúde</p>
          </div>
          <button
            className={styles.btnHistorico}
            onClick={() => navigate(`/app/ia/historico/${usuarioId}`)}
          >
            Histórico →
          </button>
        </div>

        {/* Chat Area */}
        <div className={styles.chatArea} ref={chatRef}>
          {!carregando && chat.length === 0 && (
            <div className={styles.emptyChat}>
              <span className={styles.emptyIcon}>◎</span>
              <p className={styles.emptyTitulo}>Nenhuma conversa ainda</p>
              <p className={styles.emptyDesc}>Faça sua primeira pergunta sobre treino, nutrição ou evolução.</p>
            </div>
          )}

          {chat.map((item, index) => (
            <div key={index} className={item.tipo === "usuario" ? styles.userRow : styles.botRow}>
              {item.tipo === "bot" && (
                <div className={styles.botAvatar}>A</div>
              )}
              <div className={item.tipo === "usuario" ? styles.userBubble : styles.botBubble}>
                {item.tipo === "bot" ? (
                  <ReactMarkdown>{item.texto}</ReactMarkdown>
                ) : (
                  item.texto
                )}
                <span className={styles.hora}>{formatarHora(item.hora)}</span>
              </div>
              {item.tipo === "usuario" && item.avatar && (
                <img src={item.avatar} alt="avatar" className={styles.userAvatar} />
              )}
            </div>
          ))}

          {carregando && (
            <div className={styles.botRow}>
              <div className={styles.botAvatar}>A</div>
              <div className={styles.botBubble}>
                <span className={styles.typing}>Digitando<span className={styles.dots}>...</span></span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <input
            className={styles.input}
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua pergunta..."
            onKeyDown={(e) => e.key === "Enter" && enviar()}
          />
          <button className={styles.btnEnviar} onClick={enviar} disabled={carregando}>
            <IconSend />
          </button>
        </div>

      </div>
    </div>
  );
}