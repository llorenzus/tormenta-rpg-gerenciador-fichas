import {
  ArmaItem,
  ArmaduraEquipamento,
  gerarId,
  HabilidadeOuTalento,
  ItemGeral,
  MagiaItem,
} from '../models/ficha';
import { ClasseData, classes } from './classes';
import { EquipamentoData, equipamentos, TipoEquipamento } from './equipamentos';
import { MagiaData, magias } from './magias';
import { RacaData, racas } from './racas';
import { CategoriaTalento, TalentoData, talentos } from './talentos';
import { CondicaoData, condicoes, RegraData, todasRegras } from './regras';
import { GolpeMarcialData, golpesMarciais, PosturaData, posturas } from './manobras';

export const normalizarTexto = (texto: string): string => {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export const formatarDescricaoTalento = (talento: TalentoData): string => {
  const partes: string[] = [];
  partes.push(`[${talento.categoria}]`);
  if (talento.preRequisitos && talento.preRequisitos.trim()) {
    partes.push(`Pré-requisitos: ${talento.preRequisitos}`);
  }
  if (talento.beneficio && talento.beneficio.trim()) {
    partes.push(`Benefício: ${talento.beneficio}`);
  } else if (talento.descricao && talento.descricao.trim()) {
    partes.push(`Efeito: ${talento.descricao}`);
  }
  return partes.join('\n');
};

export const formatarDescricaoMagia = (magia: MagiaData): string => {
  const partes: string[] = [];
  partes.push(`[${magia.escola} • ${magia.tipo}]`);

  const detalhesCabecalho: string[] = [];
  if (magia.tempoExecucao) detalhesCabecalho.push(`Execução: ${magia.tempoExecucao}`);
  if (magia.alcance) detalhesCabecalho.push(`Alcance: ${magia.alcance}`);
  if (magia.alvoAreaEfeito) detalhesCabecalho.push(`Área/Alvo: ${magia.alvoAreaEfeito}`);
  if (magia.duracao) detalhesCabecalho.push(`Duração: ${magia.duracao}`);
  if (magia.resistencia) detalhesCabecalho.push(`Resistência: ${magia.resistencia}`);

  if (detalhesCabecalho.length > 0) {
    partes.push(detalhesCabecalho.join(' | '));
  }

  if (magia.componenteMaterial) {
    partes.push(`Componente Material: ${magia.componenteMaterial}`);
  }
  if (magia.custoXp) {
    partes.push(`Custo em XP: ${magia.custoXp}`);
  }

  if (magia.descricao) {
    partes.push(`\n${magia.descricao}`);
  }

  return partes.join('\n');
};

export const converterTalentoParaItem = (talento: TalentoData): HabilidadeOuTalento => {
  return {
    id: gerarId(),
    nome: talento.nome,
    descricao: formatarDescricaoTalento(talento),
  };
};

export const converterMagiaParaItem = (magia: MagiaData): MagiaItem => {
  return {
    id: gerarId(),
    nivelCirculo: magia.nivel,
    nome: magia.nome,
    custoPm: magia.nivel === 0 ? '0' : String(magia.nivel),
    descricao: formatarDescricaoMagia(magia),
  };
};

export const converterArmaParaItem = (equip: EquipamentoData): ArmaItem => {
  return {
    id: gerarId(),
    nome: equip.nome,
    bonusAtaque: '+0',
    dano: equip.dano || '1d6',
    critico: equip.critico || '20/x2',
    distancia: equip.alcance && equip.alcance !== '—' ? equip.alcance : '',
    tipoDano: equip.tipoDano || 'Corte',
    usaDestreza: false,
    outrosBonus: 0,
    habilidadesMagicas: [],
  };
};

export const converterArmaduraParaItem = (equip: EquipamentoData): ArmaduraEquipamento => {
  return {
    id: gerarId(),
    nome: equip.nome,
    tipo: equip.tipo === 'Escudo' ? 'ESCUDO' : 'ARMADURA',
    bonusCa: equip.bonusCa || 1,
    equipada: true,
  };
};

export const converterItemGeralParaItem = (equip: EquipamentoData): ItemGeral => {
  return {
    id: gerarId(),
    nome: equip.nome,
    quantidade: '1',
  };
};

export const buscarTalentosSugeridos = (
  termo: string,
  categoria?: CategoriaTalento,
  limite = 8
): TalentoData[] => {
  const norm = normalizarTexto(termo);
  if (!norm || norm.length < 2) return [];

  let lista = talentos;
  if (categoria) {
    lista = lista.filter((t) => t.categoria === categoria);
  }

  const exatos: TalentoData[] = [];
  const comecaCom: TalentoData[] = [];
  const contem: TalentoData[] = [];

  for (const t of lista) {
    const nomeNorm = normalizarTexto(t.nome);
    if (nomeNorm === norm) {
      exatos.push(t);
    } else if (nomeNorm.startsWith(norm)) {
      comecaCom.push(t);
    } else if (nomeNorm.includes(norm)) {
      contem.push(t);
    }
    if (exatos.length + comecaCom.length + contem.length >= limite * 2) break;
  }

  return [...exatos, ...comecaCom, ...contem].slice(0, limite);
};

export const buscarMagiasSugeridas = (
  termo: string,
  nivelFiltro?: number | null,
  limite = 8
): MagiaData[] => {
  const norm = normalizarTexto(termo);
  if (!norm || norm.length < 2) return [];

  let lista = magias;
  if (nivelFiltro !== undefined && nivelFiltro !== null) {
    lista = lista.filter((m) => m.nivel === nivelFiltro);
  }

  const exatos: MagiaData[] = [];
  const comecaCom: MagiaData[] = [];
  const contem: MagiaData[] = [];

  for (const m of lista) {
    const nomeNorm = normalizarTexto(m.nome);
    if (nomeNorm === norm) {
      exatos.push(m);
    } else if (nomeNorm.startsWith(norm)) {
      comecaCom.push(m);
    } else if (nomeNorm.includes(norm)) {
      contem.push(m);
    }
    if (exatos.length + comecaCom.length + contem.length >= limite * 2) break;
  }

  return [...exatos, ...comecaCom, ...contem].slice(0, limite);
};

export const buscarRacasSugeridas = (termo: string, limite = 8): RacaData[] => {
  const norm = normalizarTexto(termo);
  if (!norm || norm.length < 2) return [];

  return racas
    .filter((r) => normalizarTexto(r.nome).includes(norm))
    .slice(0, limite);
};

export const buscarClassesSugeridas = (termo: string, limite = 8): ClasseData[] => {
  const norm = normalizarTexto(termo);
  if (!norm || norm.length < 2) return [];

  return classes
    .filter((c) => normalizarTexto(c.nome).includes(norm))
    .slice(0, limite);
};

export const buscarEquipamentosSugeridos = (
  termo: string,
  tipo?: TipoEquipamento,
  limite = 8
): EquipamentoData[] => {
  const norm = normalizarTexto(termo);
  if (!norm || norm.length < 2) return [];

  let lista = equipamentos;
  if (tipo) {
    lista = lista.filter((e) => e.tipo === tipo);
  }

  return lista
    .filter((e) => normalizarTexto(e.nome).includes(norm))
    .slice(0, limite);
};

export interface FiltrosTalentos {
  termo?: string;
  categoria?: CategoriaTalento | 'Todas';
}

export const filtrarTalentos = ({
  termo = '',
  categoria = 'Todas',
}: FiltrosTalentos): TalentoData[] => {
  const normTermo = normalizarTexto(termo);

  return talentos
    .filter((t) => {
      if (categoria !== 'Todas' && t.categoria !== categoria) {
        return false;
      }
      if (!normTermo) return true;

      const nomeNorm = normalizarTexto(t.nome);
      const descNorm = normalizarTexto(t.descricao);
      const benefNorm = normalizarTexto(t.beneficio);
      const reqNorm = normalizarTexto(t.preRequisitos);

      return (
        nomeNorm.includes(normTermo) ||
        benefNorm.includes(normTermo) ||
        descNorm.includes(normTermo) ||
        reqNorm.includes(normTermo)
      );
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
};

export interface FiltrosMagias {
  termo?: string;
  nivel?: number | null; // null = todos
  tipo?: 'Todas' | 'Arcana' | 'Divina';
  escola?: string | 'Todas';
}

export const filtrarMagias = ({
  termo = '',
  nivel = null,
  tipo = 'Todas',
  escola = 'Todas',
}: FiltrosMagias): MagiaData[] => {
  const normTermo = normalizarTexto(termo);
  const normTipo = normalizarTexto(tipo);
  const normEscola = normalizarTexto(escola);

  return magias
    .filter((m) => {
      if (nivel !== null && m.nivel !== nivel) {
        return false;
      }

      if (tipo !== 'Todas') {
        const tipoMagiaNorm = normalizarTexto(m.tipo);
        if (!tipoMagiaNorm.includes(normTipo)) {
          return false;
        }
      }

      if (escola !== 'Todas') {
        const escolaMagiaNorm = normalizarTexto(m.escola);
        if (!escolaMagiaNorm.includes(normEscola)) {
          return false;
        }
      }

      if (!normTermo) return true;

      const nomeNorm = normalizarTexto(m.nome);
      const descNorm = normalizarTexto(m.descricao);

      return nomeNorm.includes(normTermo) || descNorm.includes(normTermo);
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
};

export const filtrarRacas = (termo = '', manual = 'Todos'): RacaData[] => {
  const normTermo = normalizarTexto(termo);
  const normManual = normalizarTexto(manual);

  return racas
    .filter((r) => {
      if (manual !== 'Todos') {
        const livroNorm = normalizarTexto(r.livroFonte || '');
        if (!livroNorm.includes(normManual)) {
          return false;
        }
      }

      if (!normTermo) return true;

      const nomeNorm = normalizarTexto(r.nome);
      const descNorm = normalizarTexto(r.descricao);
      const traçosNorm = r.tracosRaciais.map((t) => normalizarTexto(t.nome + ' ' + t.descricao)).join(' ');
      return nomeNorm.includes(normTermo) || descNorm.includes(normTermo) || traçosNorm.includes(normTermo);
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
};

export const filtrarClasses = (
  termo = '',
  tipo: 'Todas' | 'Basica' | 'Prestigio' = 'Todas',
  manual = 'Todos'
): ClasseData[] => {
  const normTermo = normalizarTexto(termo);
  const normManual = normalizarTexto(manual);

  return classes
    .filter((c) => {
      if (tipo !== 'Todas' && c.tipo !== tipo) return false;
      if (manual !== 'Todos') {
        const livroNorm = normalizarTexto(c.livroFonte || '');
        if (!livroNorm.includes(normManual)) {
          return false;
        }
      }
      if (!normTermo) return true;

      const nomeNorm = normalizarTexto(c.nome);
      const descNorm = normalizarTexto(c.descricao);
      const habsNorm = c.habilidades.map((h) => normalizarTexto(h.nome + ' ' + h.descricao)).join(' ');
      return nomeNorm.includes(normTermo) || descNorm.includes(normTermo) || habsNorm.includes(normTermo);
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
};

export const filtrarEquipamentos = (
  termo = '',
  tipo: 'Todos' | TipoEquipamento = 'Todos'
): EquipamentoData[] => {
  const normTermo = normalizarTexto(termo);

  return equipamentos
    .filter((e) => {
      if (tipo !== 'Todos' && e.tipo !== tipo) return false;
      if (!normTermo) return true;

      const nomeNorm = normalizarTexto(e.nome);
      const descNorm = normalizarTexto(e.descricao);
      const catNorm = normalizarTexto(e.categoria);
      return nomeNorm.includes(normTermo) || descNorm.includes(normTermo) || catNorm.includes(normTermo);
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
};

export const ESCOLAS_MAGIA = [
  'Todas',
  'Abjuração',
  'Adivinhação',
  'Convocação',
  'Encantamento',
  'Evocação',
  'Ilusão',
  'Necromancia',
  'Transmutação',
];

export const CATEGORIAS_TALENTO: Array<CategoriaTalento | 'Todas'> = [
  'Todas',
  'Combate',
  'Destino',
  'Magia',
  'Perícia',
  'Poderes Concedidos',
  'Regional',
  'Tormenta',
];

export const TIPOS_EQUIPAMENTO: Array<'Todos' | TipoEquipamento> = [
  'Todos',
  'Arma',
  'Armadura',
  'Escudo',
  'Item Geral',
];

export const MANUAIS_CLASSES = [
  'Todos',
  'Manual Básico',
  'Manual do Devoto',
  'Manual do Arcano',
  'Manual do Malandro',
  'Manual do Combate',
  'Reinos de Moreania',
  'Guia da Trilogia',
  'Guerras Táuricas',
  'Império de Jade',
] as const;

export const MANUAIS_RACAS = [
  'Todos',
  'Manual Básico',
  'Manual das Raças',
  'Manual do Arcano',
] as const;

export const NIVEIS_BONUS_ARMAS_MAGICAS = [
  'Todos',
  '+1',
  '+2',
  '+3',
  '+4',
  '+5',
] as const;

export const TIPOS_REGRA = [
  'Todas',
  'Condições',
  'Pontos de Ação',
  'Armas Mágicas',
] as const;

export type TipoRegraFiltro = (typeof TIPOS_REGRA)[number];

export const filtrarRegras = (
  termo = '',
  categoria: TipoRegraFiltro = 'Todas',
  bonusArma = 'Todos'
): RegraData[] => {
  const normTermo = normalizarTexto(termo);

  return todasRegras
    .filter((r) => {
      if (categoria === 'Condições' && r.tipo !== 'Condição') return false;
      if (categoria === 'Pontos de Ação' && r.tipo !== 'Pontos de Ação') return false;
      if (categoria === 'Armas Mágicas' && r.tipo !== 'Armas Mágicas') return false;

      if (categoria === 'Armas Mágicas' && bonusArma !== 'Todos') {
        const bonus = r.bonusEquivalente || '';
        if (!bonus.includes(bonusArma)) return false;
      }

      if (!normTermo) return true;

      const nomeNorm = normalizarTexto(r.nome);
      const descNorm = normalizarTexto(r.descricao);
      const detNorm = r.detalhes ? normalizarTexto(r.detalhes) : '';
      const subNorm = r.subtipo ? normalizarTexto(r.subtipo) : '';

      return (
        nomeNorm.includes(normTermo) ||
        descNorm.includes(normTermo) ||
        detNorm.includes(normTermo) ||
        subNorm.includes(normTermo)
      );
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
};

export const filtrarCondicoes = (termo = ''): CondicaoData[] => {
  const normTermo = normalizarTexto(termo);
  if (!normTermo) {
    return [...condicoes].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  return condicoes
    .filter((c) => {
      const nomeNorm = normalizarTexto(c.nome);
      const descNorm = normalizarTexto(c.descricao);
      return nomeNorm.includes(normTermo) || descNorm.includes(normTermo);
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
};

export const filtrarManobras = (
  termo = '',
  tipo: 'Todas' | 'Postura' | 'Golpe Marcial' = 'Todas'
): Array<PosturaData | GolpeMarcialData> => {
  const normTermo = normalizarTexto(termo);
  const todasManobras: Array<PosturaData | GolpeMarcialData> = [
    ...posturas,
    ...golpesMarciais,
  ];

  return todasManobras
    .filter((m) => {
      if (tipo !== 'Todas' && m.tipo !== tipo) return false;
      if (!normTermo) return true;

      const nomeNorm = normalizarTexto(m.nome);
      const descNorm = normalizarTexto(m.descricao);
      const efeitoNorm = normalizarTexto(m.efeito);
      return (
        nomeNorm.includes(normTermo) ||
        descNorm.includes(normTermo) ||
        efeitoNorm.includes(normTermo)
      );
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
};

export const buscarManobrasSugeridas = (
  termo: string,
  tipo?: 'Postura' | 'Golpe Marcial',
  limite = 6
): Array<PosturaData | GolpeMarcialData> => {
  return filtrarManobras(termo, tipo || 'Todas').slice(0, limite);
};

export const formatarDescricaoManobra = (
  manobra: PosturaData | GolpeMarcialData
): string => {
  const partes: string[] = [];
  if ('custo' in manobra && manobra.custo) {
    partes.push(`Custo: ${manobra.custo}`);
  }
  if (manobra.efeito) {
    partes.push(`Efeito: ${manobra.efeito}`);
  }
  if (manobra.descricao && manobra.descricao !== manobra.efeito) {
    partes.push(manobra.descricao);
  }
  return partes.join('\n\n');
};

export const converterManobraParaItem = (
  manobra: PosturaData | GolpeMarcialData
): HabilidadeOuTalento => {
  return {
    id: gerarId(),
    nome: `${manobra.nome} [${manobra.tipo}]`,
    descricao: formatarDescricaoManobra(manobra),
  };
};

