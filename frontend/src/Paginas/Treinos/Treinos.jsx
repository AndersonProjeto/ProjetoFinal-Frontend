import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./Treinos.module.css";
import { SearchBar } from "../../Componentes/Pesquisa/Pesquisa";
import { IconEdit, IconTrash, IconPlus } from "../../Componentes/Icones/Icones";
import { Spinner } from "../../Componentes/Spinner/Spinner";
import { formatarData } from "../../utils/formatarData";
import { sessao } from "../../client/sessao";
import TreinoAPI from "../../client/TreinoAPI";

export function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  const navigate = useNavigate();

  async function carregarTreinos() {
    try {
      setCarregando(true);
      const resultado = await TreinoAPI.listarPorUsuarioAsync(sessao.usuarioId());
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
      formatarData(treino.dataCriacao, "Sem data").includes(termo)
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
          <IconPlus size={14} stroke="#f8f5ef" />
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
          <Spinner size={26} />
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
                    <IconEdit size={14} stroke="#3a5fa0" />
                  </button>
                  <button
                    className={`${style.btnIcon} ${style.btnDelete}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Deseja excluir esse treino?")) {
                        TreinoAPI.deletarAsync(treino.treinoId)
                          .then(carregarTreinos)
                          .catch(() => alert("Erro ao excluir treino"));
                      }
                    }}
                    title="Excluir"
                  >
                    <IconTrash size={14} stroke="#b94040" />
                  </button>
                </div>
              </div>

              <h3 className={style.cardTitle}>{treino.nomeTreino}</h3>

              <div className={style.cardFooter}>
                <span className={style.cardDate}>
                  {formatarData(treino.dataCriacao, "Sem data")}
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