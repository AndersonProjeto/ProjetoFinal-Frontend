// Formata uma data ISO para dd/mm/aaaa lendo direto a parte da string,
// sem passar por new Date() — evita o deslocamento de um dia por fuso horário.
export function formatarData(dataUtc, fallback = "—") {
  if (!dataUtc) return fallback;
  const [ano, mes, dia] = dataUtc.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
}
