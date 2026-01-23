import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiEdit3, FiTrash2, FiArrowRight } from "react-icons/fi";
import style from "./Treinos.module.css";
import { SearchBar } from "../../Componentes/Pesquisa/Pesquisa";
import TreinoAPI from "../../client/TreinoAPI";

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
      <div className={style.box}>
        <h2 className={style.title}>Treinos</h2>

        <div className={style.toolbar}>
          <SearchBar
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou data..."
            width="100%"
          />

          <Link className={style.botao_novo} to="/app/treinos/novo">
            <FiPlus /> Novo Treino
          </Link>
        </div>

        <div className={style.grid}>
          {carregando ? (
            <div className={style.loading}>
              <div className={style.spinner} />
            </div>
          ) : treinosFiltrados.length > 0 ? (
            treinosFiltrados.map((treino) => (
              <div
                key={treino.treinoId}
                className={style.card}
                onClick={() =>
                navigate(`/app/treinos/detalhes/${treino.treinoId}`)
                }
              >
                <div className={style.cardHeader}>
                  <div>
                    <h3 className={style.cardTitle}>{treino.nomeTreino}</h3>
                    <span className={style.cardSubtitle}>
                      Criado em: {formatarDataSemFuso(treino.dataCriacao)}
                    </span>
                  </div>

                  <div className={style.acoes}>
                    <button
                      className={`${style.btnIcon} ${style.btnEdit}`}
                      onClick={(e) => {
                        e.stopPropagation();
                       navigate(`/app/treinos/editar/${treino.treinoId}`);
                      }}
                    >
                      <FiEdit3 />
                    </button>

                    <button
                      className={`${style.btnIcon} ${style.btnDelete}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Deseja excluir esse treino?")) {
                          TreinoAPI.deletarAsync(treino.treinoId, token)
                            .then(carregarTreinos)
                            .catch(() =>
                              alert("Erro ao excluir treino")
                            );
                        }
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <p className={style.cardDescription}>
                  {treino.quantidadeExercicios
                    ? `${treino.quantidadeExercicios} exercícios`
                    : "Clique para ver detalhes"}
                </p>
              </div>
            ))
         ) : (
          <div className={style.mensagem_vazia}>
            <h4>Nenhum treino encontrado</h4>
            <p>Tente ajustar a busca ou criar um novo treino.</p>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
