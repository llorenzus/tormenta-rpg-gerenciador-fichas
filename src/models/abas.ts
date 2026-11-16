export type AbaKey =
  | 'dados_cadastrais'
  | 'atributos'
  | 'pericias'
  | 'habilidades_raca'
  | 'habilidades_classe'
  | 'manobras'
  | 'talentos'
  | 'magias'
  | 'equipamentos';

export interface AbaInfo {
  key: AbaKey;
  titulo: string;
  icone: string;
}

export const TODAS_AS_ABAS: Record<AbaKey, AbaInfo> = {
  dados_cadastrais: { key: 'dados_cadastrais', titulo: 'Dados Cadastrais', icone: '📋' },
  atributos: { key: 'atributos', titulo: 'Atributos', icone: '🛡️' },
  pericias: { key: 'pericias', titulo: 'Perícias', icone: '🎯' },
  habilidades_raca: { key: 'habilidades_raca', titulo: 'Habilidades de Raça', icone: '🧬' },
  habilidades_classe: { key: 'habilidades_classe', titulo: 'Habilidades de Classe', icone: '📜' },
  manobras: { key: 'manobras', titulo: 'Manobras de Combate', icone: '⚔️' },
  talentos: { key: 'talentos', titulo: 'Talentos', icone: '⭐' },
  magias: { key: 'magias', titulo: 'Magias', icone: '✨' },
  equipamentos: { key: 'equipamentos', titulo: 'Equipamentos', icone: '🎒' },
};

export const ORDEM_ABAS_PADRAO: AbaKey[] = [
  'dados_cadastrais',
  'atributos',
  'pericias',
  'habilidades_raca',
  'habilidades_classe',
  'manobras',
  'talentos',
  'magias',
  'equipamentos',
];
