import racasRaw from './racas.json';

export interface TracoRacial {
  nome: string;
  descricao: string;
}

export interface RacaData {
  id: string;
  nome: string;
  modificadoresAtributos: string;
  tamanho: string;
  deslocamento: string;
  visao?: string;
  tracosRaciais: TracoRacial[];
  descricao: string;
  livroFonte: string;
}

export const racas: RacaData[] = racasRaw as unknown as RacaData[];

export const getRacaPorId = (id: string): RacaData | undefined => {
  return racas.find((r) => r.id === id);
};

export const getRacaPorNome = (nome: string): RacaData | undefined => {
  const norm = nome.trim().toLowerCase();
  return racas.find((r) => r.nome.trim().toLowerCase() === norm);
};

export default racas;

