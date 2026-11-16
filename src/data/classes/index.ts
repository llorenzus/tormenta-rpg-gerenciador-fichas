import classesRaw from './classes.json';

export interface HabilidadeClasse {
  nivel?: number;
  nome: string;
  descricao: string;
}

export interface ClasseData {
  id: string;
  nome: string;
  tipo: 'Basica' | 'Prestigio';
  pvInicial: number;
  pvPorNivel: number;
  pmPorNivel: number;
  periciasIniciais?: string;
  periciasDeClasse?: string[];
  bba: string;
  proficiencias: string;
  habilidades: HabilidadeClasse[];
  preRequisitos?: string;
  descricao: string;
  livroFonte: string;
}

export const classes: ClasseData[] = classesRaw as unknown as ClasseData[];

export const getClassePorId = (id: string): ClasseData | undefined => {
  return classes.find((c) => c.id === id);
};

export const getClassePorNome = (nome: string): ClasseData | undefined => {
  const norm = nome.trim().toLowerCase();
  return classes.find((c) => c.nome.trim().toLowerCase() === norm);
};

export const getClassesPorTipo = (tipo: 'Basica' | 'Prestigio'): ClasseData[] => {
  return classes.filter((c) => c.tipo === tipo);
};

export default classes;

