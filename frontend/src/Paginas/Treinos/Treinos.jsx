import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./Treinos.module.css";
import { SearchBar } from "../../Componentes/Pesquisa/Pesquisa";
import TreinoAPI from "../../client/TreinoAPI";

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a5fa0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b94040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f8f5ef" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function formatarDataSemFuso(dataUtc) {
  if (!dataUtc) return "Sem data";
  const [ano, mes, dia] = dataUtc.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
}

export function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function carregarTreinos() {
    try {
      setCarregando(true);
      const usuarioId = localStorage.getItem("usuarioId");
      const resultado = await TreinoAPI.listarPorUsuarioAsync(usuarioId, token);
      setTreinos(resultado);
    } catch {
      alert("Erro ao carregar treinos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTreinos();
  }, []);

  const treinosFiltrados = treinos.filter((treino) => {
    const termo = busca.toLowerCase();
    return (
      treino.nomeTreino?.toLowerCase().includes(termo) ||
      formatarDataSemFuso(treino.dataCriacao).includes(termo)
    );
  });

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div>
          <h1 className={style.title}>Treinos</h1>
          <p className={style.subtitle}>Gerencie suas sessões de treinamento.</p>
        </div>

        <Link className={style.botaoNovo} to="/app/treinos/novo">
          <IconPlus />
          Novo Treino
        </Link>
      </div>

      <div className={style.toolbar}>
        <SearchBar
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou data..."
          width="100%"
        />
      </div>

      {carregando ? (
        <div className={style.loading}>
          <div className={style.spinner} />
        </div>
      ) : treinosFiltrados.length > 0 ? (
        <div className={style.grid}>
          {treinosFiltrados.map((treino) => (
            <div
              key={treino.treinoId}
              className={style.card}
              onClick={() => navigate(`/app/treinos/detalhes/${treino.treinoId}`)}
            >
              <div className={style.cardTop}>
                <span className={style.cardLabel}>Treino</span>
                <div className={style.acoes}>
                  <button
                    className={`${style.btnIcon} ${style.btnEdit}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/treinos/editar/${treino.treinoId}`);
                    }}
                    title="Editar"
                  >
                    <IconEdit />
                  </button>
                  <button
                    className={`${style.btnIcon} ${style.btnDelete}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Deseja excluir esse treino?")) {
                        TreinoAPI.deletarAsync(treino.treinoId, token)
                          .then(carregarTreinos)
                          .catch(() => alert("Erro ao excluir treino"));
                      }
                    }}
                    title="Excluir"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>

              <h3 className={style.cardTitle}>{treino.nomeTreino}</h3>

              <div className={style.cardFooter}>
                <span className={style.cardDate}>
                  {formatarDataSemFuso(treino.dataCriacao)}
                </span>
                {treino.quantidadeExercicios != null && (
                  <span className={style.cardBadge}>
                    {treino.quantidadeExercicios} exercícios
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={style.vazio}>
          <p className={style.vazioTitulo}>Nenhum treino encontrado</p>
          <p className={style.vazioDesc}>Tente ajustar a busca ou crie um novo treino.</p>
        </div>
      )}
    </div>
  );
}