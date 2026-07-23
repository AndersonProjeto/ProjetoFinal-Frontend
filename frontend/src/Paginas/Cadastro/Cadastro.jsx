import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import style from "./Cadastro.module.css";
import UsuarioAPI from "../../client/UsuarioAPI";

const ESTILOS_AVATAR = [
  "avataaars",
  "adventurer",
  "big-smile",
  "bottts",
  "pixel-art",
  "lorelei",
];

export function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [alturaCm, setAlturaCm] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [estiloAvatar, setEstiloAvatar] = useState("avataaars");
  const [seed, setSeed] = useState(
    () => Math.random().toString(36).substring(2, 10)
  );

  const avatarUrl = useMemo(
    () => `https://api.dicebear.com/7.x/${estiloAvatar}/svg?seed=${seed}`,
    [estiloAvatar, seed]
  );

  const navigate = useNavigate();

  function gerarAvatar() {
    setSeed(Math.random().toString(36).substring(2, 10));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);

    try {
      await UsuarioAPI.registrarAsync({
        nome,
        email,
        senha,
        dataNascimento,
        alturaCm: Number(alturaCm),
        avatarEstilo: estiloAvatar,
        avatarSeed: seed,
      });

      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      // O backend valida com FluentValidation e retorna { erros: [{ campo, erro }] }
      const erros = error.response?.data?.erros;
      const mensagem = erros?.length
        ? erros[0].erro
        : error.response?.data?.mensagem || "Erro ao cadastrar. Tente novamente.";
      toast.error(mensagem);
      setEnviando(false);
    }
  }

  return (
    <div className={style.container}>
      <div className={style.card}>
        <div className={style.brand}>
          <h1 className={style.brandName}>Acadia</h1>
          <span className={style.brandTagline}>Crie sua conta</span>
        </div>

        <div className={style.avatarSection}>
          <img src={avatarUrl} alt="Avatar" className={style.avatar} />

          <div className={style.estilos}>
            {ESTILOS_AVATAR.map((estilo) => (
              <button
                key={estilo}
                type="button"
                className={`${style.estiloBtn} ${
                  estilo === estiloAvatar ? style.ativo : ""
                }`}
                onClick={() => setEstiloAvatar(estilo)}
              >
                {estilo}
              </button>
            ))}
          </div>

          <button type="button" className={style.avatarBtn} onClick={gerarAvatar}>
            Gerar aleatório
          </button>
        </div>

        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.field}>
            <label className={style.label}>Nome</label>
            <input
              className={style.input}
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className={style.field}>
            <label className={style.label}>E-mail</label>
            <input
              className={style.input}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={style.field}>
            <label className={style.label}>Senha</label>
            <input
              className={style.input}
              type="password"
              placeholder="Mín. 8 caracteres, maiúscula, minúscula e número"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className={style.row}>
            <div className={style.field}>
              <label className={style.label}>Data de nascimento</label>
              <input
                className={style.input}
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>

            <div className={style.field}>
              <label className={style.label}>Altura</label>
              <input
                className={style.input}
                type="number"
                placeholder="cm"
                value={alturaCm}
                onChange={(e) => setAlturaCm(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={style.submitBtn} disabled={enviando}>
            {enviando ? "Criando conta..." : "Criar minha conta"}
          </button>
        </form>

        <p className={style.loginLink}>
          Já tem conta? <Link to="/">Entrar</Link>
        </p>
      </div>

      <div className={style.footerBar}>©2026 ACADIA</div>
    </div>
  );
}
