import { useState, useMemo } from "react";
import { useNavigate} from "react-router-dom";
import style from "./Cadastro.module.css";
import UsuarioAPI from "../../client/UsuarioAPI";

export function Cadastro() {
 const [nome, setNome] = useState("");
 const[email,setEmail] = useState("");
 const [senha,setSenha] = useState("");
 const [dataNascimento,setDataNascimento] = useState("")
 const [alturaCm, setAlturaCm] = useState("");
  const estilosAvatar = [
    "avataaars",
    "adventurer",
    "big-smile",
    "bottts",
    "pixel-art",
    "lorelei"
  ];

  const [estiloAvatar, setEstiloAvatar] = useState("avataaars");
  const [seed, setSeed] = useState(
    () => Math.random().toString(36).substring(2, 10)
  );

  const avatarUrl = useMemo(() => {
    return `https://api.dicebear.com/7.x/${estiloAvatar}/svg?seed=${seed}`;
  }, [estiloAvatar, seed]);

  const navigate = useNavigate();

  function gerarAvatar() {
    setSeed(Math.random().toString(36).substring(2, 10));
  }

  async function handleSubmit(e) {
    e.preventDefault();

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


      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro no cadastro", error);
      alert("Erro ao cadastrar");
    }
  }

  return (
    <div className={style.container}>
      <div className={style.avatarContainer}>
        <img src={avatarUrl} alt="Avatar" className={style.avatar} />

        <button
          type="button"
          className={style.avatarBtn}
          onClick={gerarAvatar}
        >
          Gerar outro
        </button>

        <div className={style.estilos}>
          {estilosAvatar.map((estilo) => (
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
      </div>
      <form onSubmit={handleSubmit} className={style.form}>
        <input
          className={style.input}
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          className={style.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className={style.input}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <input
          className={style.input}
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          required
        />

        <input
          className={style.input}
          type="number"
          placeholder="Altura (cm)"
          value={alturaCm}
          onChange={(e) => setAlturaCm(e.target.value)}
          required
        />

        <div className={style.botao}>
          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}