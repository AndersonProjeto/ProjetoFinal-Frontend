import { useEffect, useState, useMemo } from "react";
import styles from "./Perfil.module.css";
import UsuarioAPI from "../../client/UsuarioAPI";
import { useNavigate } from "react-router-dom";
import EvolucaoAPI from "../../client/EvolucaoAPI";

function IconEdit() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9a9180" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

const EstilosDeAvatar = [
  "avataaars", "adventurer", "big-smile", "bottts", "pixel-art", "lorelei",
];

export function Perfil() {
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem("usuarioId");

  const [usuario, setUsuario] = useState(null);
  const [ultimaEvolucao, setUltimaEvolucao] = useState(null);
  const [modalAvatar, setModalAvatar] = useState(false);
  const [modalEditarUsuario, setModalEditarUsuario] = useState(false);
  const [novoEstiloAvatar, setNovoEstiloAvatar] = useState("avataaars");
  const [novoSeed, setNovoSeed] = useState("");
  const [formUsuario, setFormUsuario] = useState({
    nome: "", email: "", alturaCm: "", dataNascimento: "",
  });

  useEffect(() => {
    async function carregarDados() {
      const u = await UsuarioAPI.obterAsync(usuarioId);
      const historico = await EvolucaoAPI.historicoAsync(usuarioId);
      setUsuario(u);
      setUltimaEvolucao(historico[0] ?? null);
      setNovoEstiloAvatar(u.avatarEstilo);
      setNovoSeed(u.avatarSeed);
    }
    carregarDados();
  }, [usuarioId]);

  function gerarSeed() {
    setNovoSeed(Math.random().toString(36).substring(2, 10));
  }

  const previewUrl = useMemo(() => {
    if (!novoSeed) return "";
    return `https://api.dicebear.com/7.x/${novoEstiloAvatar}/svg?seed=${novoSeed}`;
  }, [novoEstiloAvatar, novoSeed]);

  async function salvarAvatar() {
    await UsuarioAPI.atualizarAsync({
      usuarioId: usuario.usuarioId, nome: usuario.nome, email: usuario.email,
      alturaCm: usuario.alturaCm, dataNascimento: usuario.dataNascimento,
      avatarEstilo: novoEstiloAvatar, avatarSeed: novoSeed,
    });
    setUsuario({ ...usuario, avatarEstilo: novoEstiloAvatar, avatarSeed: novoSeed });
    setModalAvatar(false);
  }

  function abrirModalEditarUsuario() {
    setFormUsuario({
      nome: usuario.nome ?? "",
      email: usuario.email ?? "",
      alturaCm: usuario.alturaCm ?? "",
      dataNascimento: usuario.dataNascimento ? usuario.dataNascimento.substring(0, 10) : "",
    });
    setModalEditarUsuario(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormUsuario((prev) => ({ ...prev, [name]: value }));
  }

  async function salvarUsuario() {
    const payload = {
      usuarioId: usuario.usuarioId,
      nome: formUsuario.nome || usuario.nome,
      email: formUsuario.email || usuario.email,
      alturaCm: Number(formUsuario.alturaCm) || usuario.alturaCm,
      dataNascimento: formUsuario.dataNascimento || usuario.dataNascimento,
      avatarSeed: usuario.avatarSeed,
      avatarEstilo: usuario.avatarEstilo,
    };
    await UsuarioAPI.atualizarAsync(payload);
    setUsuario({ ...usuario, ...payload });
    setModalEditarUsuario(false);
  }

  if (!usuario) return <p style={{ padding: 32, color: "#7a7368", fontFamily: "DM Sans" }}>Carregando...</p>;

  const avatarUrl = `https://api.dicebear.com/7.x/${usuario.avatarEstilo}/svg?seed=${usuario.avatarSeed}`;

  return (
    <div className={styles.page}>

      {/* Card principal */}
      <div className={styles.card}>

        {/* Avatar */}
        <div className={styles.avatarWrapper}>
          <img src={avatarUrl} className={styles.avatar} alt="avatar" />
          <button className={styles.editarAvatarBtn} onClick={() => setModalAvatar(true)} title="Alterar avatar">
            <IconEdit />
          </button>
        </div>

        <h2 className={styles.nome}>{usuario.nome}</h2>
        <p className={styles.email}>{usuario.email}</p>

        <button className={styles.btnEditarPerfil} onClick={abrirModalEditarUsuario}>
          Editar perfil
        </button>

        {/* Métricas */}
        <div className={styles.metricas}>
          <div className={styles.metricaItem}>
            <span className={styles.metricaLabel}>Altura</span>
            <span className={styles.metricaValor}>{usuario.alturaCm} <small>cm</small></span>
          </div>
          <div className={styles.metricaItem}>
            <span className={styles.metricaLabel}>Peso</span>
            <span className={styles.metricaValor}>{ultimaEvolucao?.pesoKg ?? "—"} <small>kg</small></span>
          </div>
          <div className={styles.metricaItem}>
            <span className={styles.metricaLabel}>Cintura</span>
            <span className={styles.metricaValor}>{ultimaEvolucao?.cinturaCm ?? "—"} <small>cm</small></span>
          </div>
          <div className={styles.metricaItem}>
            <span className={styles.metricaLabel}>Braço</span>
            <span className={styles.metricaValor}>{ultimaEvolucao?.bracoCm ?? "—"} <small>cm</small></span>
          </div>
          <div className={styles.metricaItem}>
            <span className={styles.metricaLabel}>Coxa</span>
            <span className={styles.metricaValor}>{ultimaEvolucao?.coxaCm ?? "—"} <small>cm</small></span>
          </div>
        </div>

        {/* Histórico IA */}
        <div className={styles.iaCard} onClick={() => navigate(`/app/ia/historico/${usuarioId}`)}>
          <div>
            <div className={styles.iaLabel}>Histórico da IA</div>
            <div className={styles.iaDesc}>Veja todas as perguntas e respostas com a AcadIA</div>
          </div>
          <span className={styles.iaArrow}>→</span>
        </div>
      </div>

      {/* Modal Avatar */}
      {modalAvatar && (
        <div className={styles.modalOverlay} onClick={() => setModalAvatar(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitulo}>Alterar Avatar</h3>
              <button className={styles.closeBtn} onClick={() => setModalAvatar(false)}>✕</button>
            </div>

            <img src={previewUrl} className={styles.avatarPreview} alt="preview" />

            <button className={styles.btnGerar} onClick={gerarSeed}>Gerar outro</button>

            <div className={styles.estilosLabel}>Estilo</div>
            <div className={styles.estilos}>
              {EstilosDeAvatar.map((estilo) => (
                <button
                  key={estilo}
                  className={`${styles.estiloBtn} ${estilo === novoEstiloAvatar ? styles.estiloAtivo : ""}`}
                  onClick={() => setNovoEstiloAvatar(estilo)}
                >
                  {estilo}
                </button>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnCancelar} onClick={() => setModalAvatar(false)}>Cancelar</button>
              <button className={styles.btnSalvar} onClick={salvarAvatar}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Perfil */}
      {modalEditarUsuario && (
        <div className={styles.modalOverlay} onClick={() => setModalEditarUsuario(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitulo}>Editar Perfil</h3>
              <button className={styles.closeBtn} onClick={() => setModalEditarUsuario(false)}>✕</button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome</label>
              <input className={styles.formInput} type="text" name="nome" value={formUsuario.nome} onChange={handleChange} placeholder="Nome" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>E-mail</label>
              <input className={styles.formInput} type="email" name="email" value={formUsuario.email} onChange={handleChange} placeholder="E-mail" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Altura (cm)</label>
              <input className={styles.formInput} type="number" name="alturaCm" value={formUsuario.alturaCm} onChange={handleChange} placeholder="Altura" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Data de nascimento</label>
              <input className={styles.formInput} type="date" name="dataNascimento" value={formUsuario.dataNascimento} onChange={handleChange} />
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnCancelar} onClick={() => setModalEditarUsuario(false)}>Cancelar</button>
              <button className={styles.btnSalvar} onClick={salvarUsuario}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}