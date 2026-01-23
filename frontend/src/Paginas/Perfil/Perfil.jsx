import { useEffect, useState } from "react";
import { useMemo } from "react";
import styles from "./Perfil.module.css";
import UsuarioAPI from "../../client/UsuarioAPI";

import { FiEdit2 } from "react-icons/fi";

export function Perfil() {
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  const [usuario, setUsuario] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const estilosAvatar = [
    "avataaars",
    "adventurer",
    "big-smile",
    "bottts",
    "pixel-art",
    "lorelei",
  ];

  const [novoEstilo, setNovoEstilo] = useState("avataaars");
  const [novoSeed, setNovoSeed] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const dados = await UsuarioAPI.obterAsync(usuarioId, token);
        setUsuario(dados);
        setNovoEstilo(dados.avatarEstilo);
        setNovoSeed(dados.avatarSeed);
      } catch (err) {
        console.error("Erro ao carregar perfil", err);
      }
    }

    carregarPerfil();
  }, [usuarioId, token]);

  function gerarSeed() {
    setNovoSeed(Math.random().toString(36).substring(2, 10));
  }

  const previewUrl = useMemo(() => {
    if (!novoSeed) return "";
    return `https://api.dicebear.com/7.x/${novoEstilo}/svg?seed=${novoSeed}`;
  }, [novoEstilo, novoSeed]);

  async function salvarAvatar() {
    try {
      await UsuarioAPI.atualizarAsync(
        {
          usuarioId: usuario.usuarioId,
          nome: usuario.nome,
          email: usuario.email,
          alturaCm: usuario.alturaCm,
          avatarEstilo: novoEstilo,
          avatarSeed: novoSeed,
        },
        token
      );

      setUsuario({
        ...usuario,
        avatarEstilo: novoEstilo,
        avatarSeed: novoSeed,
      });

      setModalAberto(false);
    } catch (err) {
      alert("Erro ao atualizar avatar");
    }
  }

  // ⬇️ AGORA SIM, return condicional
  if (!usuario) {
    return <p>Carregando perfil...</p>;
  }

  const avatarUrl = `https://api.dicebear.com/7.x/${usuario.avatarEstilo}/svg?seed=${usuario.avatarSeed}`;

  return (
    <div className={styles.perfil}>
      <div className={styles.avatarWrapper}>
        <img src={avatarUrl} className={styles.avatar} />

        <button
          className={styles.editarAvatar}
          onClick={() => setModalAberto(true)}
        >
          <FiEdit2 />
        </button>
      </div>

      <h2>{usuario.nome}</h2>
      <p>{usuario.email}</p>

      <div className={styles.info}>
        <span>Altura: {usuario.alturaCm} cm</span>
      </div>

      {modalAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <img src={previewUrl} className={styles.avatarPreview} />

            <button onClick={gerarSeed} className={styles.btnGerar}>
              Gerar outro
            </button>

            <div className={styles.estilos}>
              {estilosAvatar.map((estilo) => (
                <button
                  key={estilo}
                  onClick={() => setNovoEstilo(estilo)}
                  className={
                    estilo === novoEstilo
                      ? styles.estiloAtivo
                      : styles.estiloBtn
                  }
                >
                  {estilo}
                </button>
              ))}
            </div>

            <div className={styles.acoes}>
              <button onClick={salvarAvatar}>Salvar</button>
              <button onClick={() => setModalAberto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}