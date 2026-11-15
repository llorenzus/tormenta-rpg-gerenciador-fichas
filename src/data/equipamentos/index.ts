import equipamentosRaw from './equipamentos.json';

export type TipoEquipamento = 'Arma' | 'Armadura' | 'Escudo' | 'Item Geral';

export interface EquipamentoData {
  id: string;
  nome: string;
  tipo: TipoEquipamento;
  categoria: string;
  preco: string;
  peso: string;
  // Campos de Arma
  dano?: string;
  critico?: string;
  alcance?: string;
  tipoDano?: string;
  empunhadura?: string;
  // Campos de Armadura / Escudo
  bonusCa?: number;
  destrezaMaxima?: string;
  penalidadeArmadura?: number;
  // Descrição geral
  descricao: string;
  livroFonte: string;
}

export const equipamentos: EquipamentoData[] =
  equipamentosRaw as unknown as EquipamentoData[];

export const getEquipamentoPorId = (id: string): EquipamentoData | undefined => {
  return equipamentos.find((e) => e.id === id);
};

export const getEquipamentosPorTipo = (
  tipo: TipoEquipamento
): EquipamentoData[] => {
  return equipamentos.filter((e) => e.tipo === tipo);
};

export const getArmas = (): EquipamentoData[] => {
  return equipamentos.filter((e) => e.tipo === 'Arma');
};

export const getArmadurasEEscudos = (): EquipamentoData[] => {
  return equipamentos.filter((e) => e.tipo === 'Armadura' || e.tipo === 'Escudo');
};

export const getItensGerais = (): EquipamentoData[] => {
  return equipamentos.filter((e) => e.tipo === 'Item Geral');
};

export default equipamentos;

