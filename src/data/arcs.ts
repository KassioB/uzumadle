import type { Arc } from '../types/character';

/** Arcos canônicos do mangá, em ordem. Capítulos conforme a Narutopedia. */
export const ARCS: readonly Arc[] = [
  { id: 'pais-das-ondas', name: 'Prólogo: País das Ondas', series: 'Clássico', chapters: [1, 33] },
  { id: 'exame-chunin', name: 'Exame Chūnin', series: 'Clássico', chapters: [34, 115] },
  { id: 'destruicao-konoha', name: 'Destruição de Konoha', series: 'Clássico', chapters: [116, 138] },
  { id: 'busca-tsunade', name: 'Busca por Tsunade', series: 'Clássico', chapters: [139, 171] },
  { id: 'resgate-sasuke', name: 'Resgate do Sasuke', series: 'Clássico', chapters: [172, 238] },
  { id: 'kakashi-gaiden', name: 'Kakashi Gaiden', series: 'Clássico', chapters: [239, 244] },
  { id: 'resgate-kazekage', name: 'Resgate do Kazekage', series: 'Shippuden', chapters: [245, 281] },
  { id: 'ponte-tenchi', name: 'Ponte Tenchi', series: 'Shippuden', chapters: [282, 310] },
  { id: 'supressao-akatsuki', name: 'Caçada à Akatsuki', series: 'Shippuden', chapters: [311, 342] },
  { id: 'perseguicao-itachi', name: 'Perseguição a Itachi', series: 'Shippuden', chapters: [343, 367] },
  { id: 'conto-jiraiya', name: 'O Conto de Jiraiya', series: 'Shippuden', chapters: [368, 383] },
  { id: 'batalha-irmaos', name: 'Batalha entre Irmãos', series: 'Shippuden', chapters: [384, 412] },
  { id: 'invasao-pain', name: 'Invasão de Pain', series: 'Shippuden', chapters: [413, 453] },
  { id: 'cupula-kages', name: 'Cúpula dos Cinco Kages', series: 'Shippuden', chapters: [454, 483] },
  { id: 'guerra-contagem', name: 'Guerra: Contagem Regressiva', series: 'Shippuden', chapters: [484, 515] },
  { id: 'guerra-confronto', name: 'Guerra: Confronto', series: 'Shippuden', chapters: [516, 559] },
  { id: 'guerra-climax', name: 'Guerra: Clímax', series: 'Shippuden', chapters: [560, 639] },
  { id: 'dez-caudas', name: 'Jinchūriki do Dez Caudas', series: 'Shippuden', chapters: [640, 677] },
  { id: 'ataque-kaguya', name: 'Ataque de Kaguya', series: 'Shippuden', chapters: [678, 699] },
];

const ARC_BY_ID = new Map(ARCS.map((arc) => [arc.id, arc]));

export function getArc(id: string): Arc {
  const arc = ARC_BY_ID.get(id);
  if (!arc) throw new Error(`Arco desconhecido: ${id}`);
  return arc;
}

export function findArcByChapter(chapter: number): Arc | undefined {
  return ARCS.find(({ chapters: [first, last] }) => chapter >= first && chapter <= last);
}
