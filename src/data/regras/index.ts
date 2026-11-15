import condicoesRaw from './condicoes.json';
import pontosAcaoRaw from './pontos_acao.json';
import armasMagicasRaw from './armas_magicas.json';

export interface CondicaoData {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  livroFonte: string;
}

export interface RegraData {
  id: string;
  nome: string;
  tipo: string; // 'Condição' | 'Pontos de Ação' | 'Armas Mágicas'
  subtipo?: string;
  bonusEquivalente?: string;
  preco?: string;
  descricao: string;
  detalhes?: string;
  livroFonte: string;
}

export const condicoes: CondicaoData[] = condicoesRaw as CondicaoData[];
export const pontosAcao: RegraData[] = pontosAcaoRaw as RegraData[];
export const armasMagicas: RegraData[] = armasMagicasRaw as RegraData[];

export const todasRegras: RegraData[] = [
  ...condicoes.map((c) => ({
    id: c.id,
    nome: c.nome,
    tipo: 'Condição',
    subtipo: 'Condição Prejudicial',
    descricao: c.descricao,
    livroFonte: c.livroFonte,
  })),
  ...pontosAcao,
  ...armasMagicas,
];

export const getCondicaoPorId = (id: string): CondicaoData | undefined => {
  return condicoes.find((c) => c.id === id);
};

export const getRegraPorId = (id: string): RegraData | undefined => {
  return todasRegras.find((r) => r.id === id);
};
