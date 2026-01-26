import { useEffect, useRef, useState } from "react";
import IAAPI from "../../client/IAAPI";
import ReactMarkdown from "react-markdown";
import styles from "./ChatIA.module.css";
import UsuarioAPI from "../../client/UsuarioAPI";
import { useNavigate } from "react-router-dom";

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

      const interacoes = await IAAPI.ultimasInteracoesAsync(
        Number(usuarioId),
        10,
        token
      );

      const formatado = interacoes
        .reverse()
        .map((i) => [
          {
            tipo: "usuario",
            texto: i.pergunta,
            avatar: avatarUrl,
            hora: i.dataHora,
          },
          {
            tipo: "bot",
            texto: i.resposta,
            hora: i.dataHora,
          },
        ])
        .flat();

      setChat(formatado);
    }

    carregar();
  }, [usuarioId, token, avatarUrl]);

  function digitarResposta(texto) {
    let i = 0;
    const velocidade = 22;

    setChat((prev) => [...prev, { tipo: "bot", texto: "", hora: new Date() }]);

    const interval = setInterval(() => {
      i++;

      setChat((prev) => {
        const novo = [...prev];
        novo[novo.length - 1] = {
          tipo: "bot",
          texto: texto.slice(0, i),
          hora: new Date(),
        };
        return novo;
      });

      if (i >= texto.length) clearInterval(interval);
    }, velocidade);
  }

  async function enviar() {
    if (!mensagem.trim() || carregando) return;

    setChat((prev) => [
      ...prev,
      {
        tipo: "usuario",
        texto: mensagem,
        avatar: avatarUrl,
        hora: new Date(),
      },
    ]);

    setMensagem("");
    setCarregando(true);

    try {
      const resposta = await IAAPI.salvarInteracaoAsync(
        {
          UsuarioId: Number(usuarioId),
          Pergunta: mensagem,
        },
        token
      );

      digitarResposta(resposta.resposta);
    } catch {
      setChat((prev) => [
        ...prev,
        { tipo: "bot", texto: "❌ Erro ao obter resposta.", hora: new Date() },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  function formatarHora(dataHora) {
    const data = new Date(dataHora);
    return `${String(data.getHours()).padStart(2, "0")}:${String(
      data.getMinutes()
    ).padStart(2, "0")}`;
  }

  return (
    <div className={styles.page}>
      <div
        className={styles.historicoLateral}
        onClick={() => navigate(`/app/ia/historico/${usuarioId}`)}
      >
        <strong>Histórico da IA</strong>
        <p>Ver todas as perguntas e respostas</p>
      </div>

      <div className={styles.container}>
        <div className={styles.chatBox}>
          <h2 className={styles.title}>AcadIA</h2>

          <div className={styles.chatArea} ref={chatRef}>

          {!carregando && chat.length === 0 && (
            <div className={styles.emptyChat}>
               Ainda não há nenhuma conversa 
              <br />
              Comece fazendo sua primeira pergunta!
            </div>
          )}

          {chat.map((item, index) => (
            <div
              key={index}
              className={
                item.tipo === "usuario"
                  ? styles.userMsg
                  : styles.botMsg
              }
            >
              {item.tipo === "usuario" && (
                <img
                  src={item.avatar}
                  alt="avatar"
                  className={styles.avatar}
                />
              )}

              <div className={styles.msgContent}>
                {item.tipo === "bot" ? (
                  <ReactMarkdown>{item.texto}</ReactMarkdown>
                ) : (
                  item.texto
                )}
                <span className={styles.hora}>
                  {formatarHora(item.hora)}
                </span>
              </div>
            </div>
          ))}

          {carregando && (
            <div className={styles.botMsg}>Digitando…</div>
          )}
        </div>

          <div className={styles.inputArea}>
            <input
              className={styles.input}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua pergunta..."
              onKeyDown={(e) => e.key === "Enter" && enviar()}
            />
            <button className={styles.btn} onClick={enviar}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}