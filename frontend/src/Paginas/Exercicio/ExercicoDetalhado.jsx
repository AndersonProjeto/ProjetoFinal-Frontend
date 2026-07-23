import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExercicioAPI from "../../client/ExercicioAPI";
import style from "./ExercicioDetalhado.module.css";
import { Spinner } from "../../Componentes/Spinner/Spinner";

function getEmbedUrl(url) {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`;
  }

  return null;
}

export function ExercicioDetalhado() {
  const location = useLocation();
  const navigate = useNavigate();

  const exercicioResumido = location.state;

  const [exercicio, setExercicio] = useState(exercicioResumido || null);
  const [carregando, setCarregando] = useState(true);


  useEffect(() => {
    async function buscarCompleto() {
      const id = exercicioResumido?.exercicioId || exercicioResumido?.id;
      if (!id) {
        setCarregando(false);
        return;
      }

      try {
        // Busca o exercício completo pela API — garante que videoUrl vem junto
        const completo = await ExercicioAPI.obterAsync(id);
        setExercicio(completo);
      } catch {
        // se falhar, usa o resumido que já temos do location.state
      } finally {
        setCarregando(false);
      }
    }

    buscarCompleto();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda uma vez com o exercício vindo do location.state
  }, []);

  if (carregando) {
    return (
      <div className={style.page}>
        <div className={style.loading}>
          <Spinner />
        </div>
      </div>
    );
  }

  if (!exercicio) {
    return (
      <div className={style.page}>
        <div className={style.infoCol}>
          <h2 className={style.title}>Exercício não encontrado</h2>
          <button className={style.button} onClick={() => navigate(-1)}>
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(exercicio.videoUrl);

  return (
    <div className={style.page}>
      <div className={style.layout}>

        {/* ── Coluna esquerda: vídeo ── */}
        <div className={style.videoCol}>
          {embedUrl ? (
            <div className={style.videoWrapper}>
              <iframe
                src={embedUrl}
                title={`Vídeo: ${exercicio.nome}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={style.iframe}
              />
            </div>
          ) : (
            <div className={style.videoPlaceholder}>
              <span className={style.placeholderIcon}>▶</span>
              <p className={style.placeholderText}>Nenhum vídeo disponível</p>
            </div>
          )}
        </div>

        {/* ── Coluna direita: informações ── */}
        <div className={style.infoCol}>
          <h2 className={style.title}>{exercicio.nome}</h2>

          <div className={style.info}>
            <div className={style.row}>
              <span className={style.label}>Grupo Muscular</span>
              <span className={style.value}>{exercicio.grupoMuscular}</span>
            </div>

            <div className={style.row}>
              <span className={style.label}>Equipamento</span>
              <span className={style.value}>
                {exercicio.equipamento || "Nenhum"}
              </span>
            </div>

            <div className={style.row}>
              <span className={style.label}>Descrição</span>
              <span className={style.value}>
                {exercicio.descricao || "Nenhuma descrição disponível."}
              </span>
            </div>
          </div>

          <button className={style.button} onClick={() => navigate(-1)}>
            ← Voltar
          </button>
        </div>

      </div>
    </div>
  );
}