import { useEffect, useState, useMemo } from "react";
import styles from "./Perfil.module.css";
import UsuarioAPI from "../../client/UsuarioAPI";
import { useNavigate } from "react-router-dom";
import EvolucaoAPI from "../../client/EvolucaoAPI";
import { FiEdit2 } from "react-icons/fi";

export function Perfil() {
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  const [usuario, setUsuario] = useState(null);
  const [ultimaEvolucao, setUltimaEvolucao] = useState(null);

  const [modalAvatar, setModalAvatar] = useState(false);
  const [modalEditarUsuario, setModalEditarUsuario] = useState(false);

  const EstilosDeAvatar = [
    "avataaars",
    "adventurer",
    "big-smile",
    "bottts",
    "pixel-art",
    "lorelei",
  ];

  const [novoEstiloAvatar, setNovoEstiloAvatar] = useState("avataaars");
  const [novoSeed, setNovoSeed] = useState("");

  const [formUsuario, setFormUsuario] = useState({
    nome: "",
    email: "",
    alturaCm: "",
    dataNascimento: "",
  });

  useEffect(() => {
    async function carregarDados() {
      const usuario = await UsuarioAPI.obterAsync(usuarioId, token);
      const historico = await EvolucaoAPI.historicoAsync(usuarioId, token);

      setUsuario(usuario);
      setUltimaEvolucao(historico[0] ?? null);

      setNovoEstiloAvatar(usuario.avatarEstilo);
      setNovoSeed(usuario.avatarSeed);
    }

    carregarDados();
  }, [usuarioId, token]);

  function gerarSeed() {
    setNovoSeed(Math.random().toString(36).substring(2, 10));
  }

  const previewUrl = useMemo(() => {
    if (!novoSeed) return "";
    return `https://api.dicebear.com/7.x/${novoEstiloAvatar}/svg?seed=${novoSeed}`;
  }, [novoEstiloAvatar, novoSeed]);

  async function salvarAvatar() {
    await UsuarioAPI.atualizarAsync(
      {
        usuarioId: usuario.usuarioId,
        nome: usuario.nome,
        email: usuario.email,
        alturaCm: usuario.alturaCm,
        dataNascimento: usuario.dataNascimento,
        avatarEstilo: novoEstiloAvatar,
        avatarSeed: novoSeed,
      },
      token
    );

    setUsuario({
      ...usuario,
      avatarEstilo: novoEstiloAvatar,
      avatarSeed: novoSeed,
    });

    setModalAvatar(false);
  }

  function abrirModalEditarUsuario() {
    setFormUsuario({
      nome: usuario.nome ?? "",
      email: usuario.email ?? "",
      alturaCm: usuario.alturaCm ?? "",
      dataNascimento: usuario.dataNascimento
        ? usuario.dataNascimento.substring(0, 10)
        : "",
    });

    setModalEditarUsuario(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function salvarUsuario() {
    const payload = {
      usuarioId: usuario.usuarioId,
      nome: formUsuario.nome || usuario.nome,
      email: formUsuario.email || usuario.email,
      alturaCm: Number(formUsuario.alturaCm) || usuario.alturaCm,
      dataNascimento:
        formUsuario.dataNascimento || usuario.dataNascimento,
      avatarSeed: usuario.avatarSeed,
      avatarEstilo: usuario.avatarEstilo,
    };

    await UsuarioAPI.atualizarAsync(payload, token);

    setUsuario({
      ...usuario,
      ...payload,
    });

    setModalEditarUsuario(false);
  }

  if (!usuario) return <p>Carregando...</p>;

  const avatarUrl = `https://api.dicebear.com/7.x/${usuario.avatarEstilo}/svg?seed=${usuario.avatarSeed}`;

  return (
    <div className={styles.perfil}>
      <div className={styles.avatarWrapper}>
        <img src={avatarUrl} className={styles.avatar} />
        <button
          className={styles.editarAvatar}
          onClick={() => setModalAvatar(true)}
        >
          <FiEdit2 />
        </button>
      </div>

      <h2>{usuario.nome}</h2>
      <p>{usuario.email}</p>

      <button
        className={styles.editarAvatar}
        onClick={abrirModalEditarUsuario}
      >
        Editar perfil
      </button>

      <div className={styles.dados}>
        <div>
          <b>Altura:</b> {usuario.alturaCm} cm
        </div>
        <div>
          <b>Peso atual:</b> {ultimaEvolucao?.pesoKg ?? "--"} kg
        </div>
        <div>
          <b>Cintura:</b> {ultimaEvolucao?.cinturaCm ?? "--"} cm
        </div>
        <div>
          <b>Braço:</b> {ultimaEvolucao?.bracoCm ?? "--"} cm
        </div>
        <div>
          <b>Coxa:</b> {ultimaEvolucao?.coxaCm ?? "--"} cm
        </div>
      </div>

      <div className={styles.iaPlaceholder}>
        <h3>Histórico da IA</h3>
        <p>Veja todas as perguntas e respostas que você já teve com a IA</p>
        <button
          onClick={() => navigate(`/app/ia/historico/${usuarioId}`)}
        >
          Ver histórico completo
        </button>
      </div>

      {modalAvatar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <img src={previewUrl} className={styles.avatarPreview} />

            <button className={styles.btnGerar}
             onClick={gerarSeed}>Gerar outro</button>

            <div className={styles.estilos}>
              {EstilosDeAvatar.map((estilo) => (
                <button
                  key={estilo}
                  onClick={() => setNovoEstiloAvatar(estilo)}
                  className={
                    estilo === novoEstiloAvatar
                      ? styles.estiloAtivo
                      : ""
                  }
                >
                  {estilo}
                </button>
              ))}
            </div>

            <button className={styles.btnGerarSalvar}
             onClick={salvarAvatar}>Salvar</button>
            <button className={styles.btnGerarCancelar}
             onClick={() => setModalAvatar(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {modalEditarUsuario && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Editar perfil</h3>

            <input
              type="text"
              name="nome"
              value={formUsuario.nome}
              onChange={handleChange}
              placeholder="Nome"
            />

            <input
              type="email"
              name="email"
              value={formUsuario.email}
              onChange={handleChange}
              placeholder="Email"
            />

            <input
              type="number"
              name="alturaCm"
              value={formUsuario.alturaCm}
              onChange={handleChange}
              placeholder="Altura (cm)"
            />

            <input
              type="date"
              name="dataNascimento"
              value={formUsuario.dataNascimento}
              onChange={handleChange}
            />

            <button onClick={salvarUsuario}>Salvar</button>
            <button onClick={() => setModalEditarUsuario(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}