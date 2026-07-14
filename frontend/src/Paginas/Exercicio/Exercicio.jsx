import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExercicioAPI from "../../client/ExercicioAPI";
import style from "./Exercicio.module.css";
import { SearchBar } from "../../Componentes/Pesquisa/Pesquisa";

export function Exercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [busca, setBusca] = useState("");
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [carregando, setCarregando] = useState(true);

  const [pagina, setPagina] = useState(1);
  const [tamanhoPagina] = useState(4);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const navigate = useNavigate();

  async function carregarExercicios() {
    try {
      setCarregando(true);

      if (grupoSelecionado) {
        const resultado = await ExercicioAPI.listarPorGrupoAsync(grupoSelecionado);
        setExercicios(resultado);
        setTotalPaginas(1);
        return;
      }

      const resultado = await ExercicioAPI.listarPaginadoAsync(pagina, tamanhoPagina);
      setExercicios(resultado.items);
      setTotalPaginas(resultado.totalPages);
    } catch {
      alert("Erro ao carregar exercícios.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarExercicios();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recarrega apenas quando página/grupo mudam
  }, [pagina, grupoSelecionado]);

  const exerciciosFiltrados = exercicios.filter((ex) => {
    const termo = busca.toLowerCase();
    return (
      ex.nome?.toLowerCase().includes(termo) ||
      ex.grupoMuscular?.toLowerCase().includes(termo) ||
      ex.equipamento?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className={style.container}>
      <div className={style.box}>
        <h2 className={style.title}>Exercícios</h2>

        <div className={style.toolbar}>
          <SearchBar
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, grupo ou equipamento..."
            width="100%"
          />
          <select
            className={style.selectFiltro}
            value={grupoSelecionado}
            onChange={(e) => {
              setPagina(1);
              setGrupoSelecionado(e.target.value);
            }}
          >
            <option value="">Todos os grupos</option>
            <option value="Peito">Peito</option>
            <option value="Costas">Costas</option>
            <option value="Pernas">Pernas</option>
            <option value="Ombros">Ombros</option>
            <option value="Biceps">Bíceps</option>
            <option value="Triceps">Tríceps</option>
            <option value="Abdomen">Abdômen</option>
          </select>
        </div>

        <div className={style.grid}>
          {carregando ? (
            <div className={style.loading}>
              <div className={style.spinner} />
            </div>
          ) : exerciciosFiltrados.length > 0 ? (
            exerciciosFiltrados.map((exercicio) => (
              <div
                key={exercicio.exercicioId || exercicio.id}
                className={style.card}
                onClick={() => navigate("/app/exercicios/detalhes", { state: exercicio })}
              >
                <div className={style.cardHeader}>
                  <div>
                    <h3 className={style.cardTitle}>{exercicio.nome}</h3>
                    <span className={style.cardSubtitle}>{exercicio.grupoMuscular}</span>
                  </div>
                </div>
                <p className={style.cardDescription}>
                  {exercicio.descricao || "Sem descrição disponível."}
                </p>
                {exercicio.equipamento && (
                  <span className={style.badge}>{exercicio.equipamento}</span>
                )}
              </div>
            ))
          ) : (
            <div className={style.mensagem_vazia}>
              <h4>Nenhum exercício encontrado</h4>
              <p>Tente ajustar os filtros ou a busca.</p>
            </div>
          )}
        </div>

        {!grupoSelecionado && (
          <div className={style.paginacao}>
            <button
              className={style.btnPagina}
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
            >
              ←
            </button>
            <span className={style.textoPagina}>
              {pagina} de {totalPaginas}
            </span>
            <button
              className={style.btnPagina}
              disabled={pagina === totalPaginas}
              onClick={() => setPagina(pagina + 1)}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}