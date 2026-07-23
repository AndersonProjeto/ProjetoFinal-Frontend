import { useState, useEffect } from "react";
import { client } from "../../client/client";
import styles from "./RelatorioIA.module.css";
import { IconRelatorio } from "../../Componentes/Icones/Icones";
import { sessao } from "../../client/sessao";
import {
  LuActivity,
  LuTrendingUp,
  LuTriangleAlert,
  LuCircleCheck,
  LuDumbbell,
  LuTarget,
} from "react-icons/lu";

function IconTendencia({ valor }) {
  if (valor < 0) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
    </svg>
  );
  if (valor > 0) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0432a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b6560" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

export function RelatorioIA() {
  const usuarioId = sessao.usuarioId();

  const [relatorio, setRelatorio] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [erro, setErro] = useState(null);
  const [gerado, setGerado] = useState(false);

  useEffect(() => {
    async function carregarUltimoRelatorio() {
      if (!usuarioId) { setCarregandoInicial(false); return; }
      try {
        const res = await client.get(`/IARelatorio/ultimo/${usuarioId}`);
        if (res.data?.relatorio) {
          const json = typeof res.data.relatorio === "string"
            ? JSON.parse(res.data.relatorio)
            : res.data.relatorio;
          setRelatorio(json);
          setGerado(true);
        }
      } catch {
        // sem relatório anterior
      } finally {
        setCarregandoInicial(false);
      }
    }
    carregarUltimoRelatorio();
  }, [usuarioId]);

  async function gerarRelatorio() {
    if (carregando) return;
    setCarregando(true);
    setErro(null);
    try {
      const res = await client.post(`/IARelatorio/gerar/${usuarioId}`, {});
      const json = typeof res.data.relatorio === "string"
        ? JSON.parse(res.data.relatorio)
        : res.data.relatorio;
      setRelatorio(json);
      setGerado(true);
    } catch {
      setErro("Não foi possível gerar o relatório. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  const r = relatorio;
  const exibirSkeleton = carregando || carregandoInicial;

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Relatório IA</h2>
          <p className={styles.subtitle}>Análise inteligente da sua evolução</p>
        </div>
        <button className={styles.btnGerar} onClick={gerarRelatorio} disabled={carregando || carregandoInicial}>
          {carregando ? (
            <span className={styles.loadingDots}>Analisando<span className={styles.dots}>...</span></span>
          ) : (
            <><IconRelatorio size={18} />{gerado ? "Novo Relatório" : "Gerar Relatório"}</>
          )}
        </button>
      </div>

      {erro && <div className={styles.erro}>{erro}</div>}

      {!r && !exibirSkeleton && !erro && (
        <div className={styles.emptyState}>
          {/* Mesmo ícone do botão que gera o relatório: o vazio antecipa a ação. */}
          <span className={styles.emptyIcon}><IconRelatorio size={34} /></span>
          <p className={styles.emptyTitulo}>Nenhum relatório gerado</p>
          <p className={styles.emptyDesc}>
            Clique em "Gerar Relatório" para receber uma análise completa da sua evolução com recomendações personalizadas.
          </p>
        </div>
      )}

      {exibirSkeleton && (
        <div className={styles.skeleton}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={styles.skeletonCard} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}

      {r && !exibirSkeleton && (
        <div className={styles.conteudo}>

          {/* Mensagem motivacional */}
          {r.mensagemMotivacional && (
            <div className={styles.motivacional}>
              <span className={styles.motivacionalIcon}>✦</span>
              <p>{r.mensagemMotivacional}</p>
            </div>
          )}

          {/* Grid topo: Resumo + Evolução */}
          <div className={styles.gridTopo}>

            {r.resumoAtual && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardLabel}>Resumo Atual</span>
                  <LuActivity className={styles.cardIcon} aria-hidden />
                </div>

                <div className={styles.imcBloco}>
                  <span className={styles.imcValor}>{r.resumoAtual.imc?.toFixed(1)}</span>
                  <div>
                    <div className={styles.imcLabel}>IMC</div>
                    <div className={`${styles.imcClassificacao} ${getImcClass(r.resumoAtual.classificacaoImc, styles)}`}>
                      {r.resumoAtual.classificacaoImc}
                    </div>
                  </div>
                </div>

                <div className={styles.medidasGrid}>
                  <MedidaItem label="Peso" valor={`${r.resumoAtual.pesoAtual} kg`} />
                  {r.resumoAtual.cintura && <MedidaItem label="Cintura" valor={`${r.resumoAtual.cintura} cm`} />}
                  {r.resumoAtual.braco && <MedidaItem label="Braço" valor={`${r.resumoAtual.braco} cm`} />}
                  {r.resumoAtual.coxa && <MedidaItem label="Coxa" valor={`${r.resumoAtual.coxa} cm`} />}
                </div>

                {r.resumoAtual.destaquePositivo && (
                  <div className={styles.destaque}>
                    <span className={styles.destaqueIcon}>★</span>
                    <span>{r.resumoAtual.destaquePositivo}</span>
                  </div>
                )}
              </div>
            )}

            {r.evolucao && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardLabel}>Evolução</span>
                  <LuTrendingUp className={styles.cardIcon} aria-hidden />
                </div>

                <div className={styles.evolucaoBloco}>
                  <div className={styles.evolucaoStat}>
                    <span className={styles.evolucaoStatLabel}>Peso inicial</span>
                    <span className={styles.evolucaoStatValor}>{r.evolucao.pesoInicial} kg</span>
                  </div>
                  <div className={styles.evolucaoArrow}>→</div>
                  <div className={styles.evolucaoStat}>
                    <span className={styles.evolucaoStatLabel}>Peso atual</span>
                    <span className={styles.evolucaoStatValor}>{r.evolucao.pesoAtual} kg</span>
                  </div>
                </div>

                <div className={styles.variacaoBloco}>
                  <IconTendencia valor={r.evolucao.variacaoPesoKg} />
                  <span className={`${styles.variacaoValor} ${r.evolucao.variacaoPesoKg < 0 ? styles.positivo : r.evolucao.variacaoPesoKg > 0 ? styles.negativo : ""}`}>
                    {r.evolucao.variacaoPesoKg > 0 ? "+" : ""}{r.evolucao.variacaoPesoKg} kg ({r.evolucao.variacaoPesoPercent?.toFixed(1)}%)
                  </span>
                  <span className={styles.tendenciaTag}>{r.evolucao.tendencia}</span>
                </div>

                {r.evolucao.conquistasDestacadas?.length > 0 && (
                  <div className={styles.conquistas}>
                    <div className={styles.conquistasLabel}>Conquistas</div>
                    {r.evolucao.conquistasDestacadas.map((c, i) => (
                      <div key={i} className={styles.conquistaItem}>
                        <span className={styles.conquistaCheck}>✓</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}

                {r.evolucao.descricao && (
                  <p className={styles.evolucaoDesc}>{r.evolucao.descricao}</p>
                )}
              </div>
            )}
          </div>

          {/* Pontos de Atenção */}
          {r.pontosDeAtencao?.length > 0 && (
            <div className={styles.secao}>
              <div className={styles.secaoHeader}>
                <LuTriangleAlert className={`${styles.secaoIcon} ${styles.secaoIconAtencao}`} aria-hidden />
                <span className={styles.secaoTitulo}>Pontos de Atenção</span>
              </div>
              <div className={styles.listaCards}>
                {r.pontosDeAtencao.map((p, i) => (
                  <div key={i} className={`${styles.cardItem} ${styles.cardAtencao}`}>
                    <div className={styles.cardItemTitulo}>{p.titulo}</div>
                    <p className={styles.cardItemDesc}>{p.descricao}</p>
                    {p.comoMelhorar && (
                      <div className={styles.comoMelhorar}>
                        <span className={styles.comoMelhorarLabel}>Como melhorar</span>
                        <p>{p.comoMelhorar}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendações */}
          {r.recomendacoes?.length > 0 && (
            <div className={styles.secao}>
              <div className={styles.secaoHeader}>
                <LuCircleCheck className={`${styles.secaoIcon} ${styles.secaoIconRec}`} aria-hidden />
                <span className={styles.secaoTitulo}>Recomendações</span>
              </div>
              <div className={styles.listaCards}>
                {r.recomendacoes.map((rec, i) => (
                  <div key={i} className={`${styles.cardItem} ${styles.cardRec}`}>
                    <div className={styles.cardItemNumero}>{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <div className={styles.cardItemTitulo}>{rec.titulo}</div>
                      <p className={styles.cardItemDesc}>{rec.descricao}</p>
                      {rec.acaoPratica && (
                        <div className={styles.acaoPratica}>
                          <span>→</span> {rec.acaoPratica}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treinos + Próximo Objetivo */}
          <div className={styles.gridBottom}>

            {r.relacaoComTreinos && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardLabel}>Relação com Treinos</span>
                  <LuDumbbell className={styles.cardIcon} aria-hidden />
                </div>
                <p className={styles.treinoAnalise}>{r.relacaoComTreinos.analise}</p>
                {r.relacaoComTreinos.sugestoes?.length > 0 && (
                  <ul className={styles.treinoSugestoes}>
                    {r.relacaoComTreinos.sugestoes.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {r.proximoObjetivo && (
              <div className={`${styles.card} ${styles.cardObjetivo}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardLabel}>Próximo Objetivo</span>
                  <LuTarget className={styles.cardIcon} aria-hidden />
                </div>
                <p className={styles.objetivoTexto}>{r.proximoObjetivo}</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

function MedidaItem({ label, valor }) {
  return (
    <div className={styles.medidaItem}>
      <span className={styles.medidaLabel}>{label}</span>
      <span className={styles.medidaValor}>{valor}</span>
    </div>
  );
}

function getImcClass(classificacao, styles) {
  if (!classificacao) return "";
  const c = classificacao.toLowerCase();
  if (c.includes("normal") || c.includes("ideal")) return styles.imcNormal;
  if (c.includes("obeso") || c.includes("obesidade")) return styles.imcObeso;
  if (c.includes("sobrepeso")) return styles.imcSobrepeso;
  if (c.includes("abaixo") || c.includes("baixo")) return styles.imcBaixo;
  return "";
}