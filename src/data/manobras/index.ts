import golpesRaw from './golpes.json';
import posturasRaw from './posturas.json';

export interface PosturaData {
  id: string;
  nome: string;
  tipo: 'Postura';
  efeito: string;
  descricao: string;
  livroFonte: string;
}

export interface GolpeMarcialData {
  id: string;
  nome: string;
  tipo: 'Golpe Marcial';
  custo: string;
  efeito: string;
  descricao: string;
  livroFonte: string;
}

export const posturas: PosturaData[] = posturasRaw as PosturaData[];
export const golpesMarciais: GolpeMarcialData[] = golpesRaw as GolpeMarcialData[];

export const getPosturaPorId = (id: string): PosturaData | undefined => {
  return posturas.find((p) => p.id === id);
};

export const getGolpePorId = (id: string): GolpeMarcialData | undefined => {
  return golpesMarciais.find((g) => g.id === id);
};

