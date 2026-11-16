export type AtributoSigla = 'FOR' | 'DES' | 'CON' | 'INT' | 'SAB' | 'CAR';

export interface AtributoInfo {
  sigla: AtributoSigla;
  nome: string;
  campo: keyof Pick<
    FichaPersonagem,
    'forca' | 'destreza' | 'constituicao' | 'inteligencia' | 'sabedoria' | 'carisma'
  >;
}

export const ATRIBUTOS_LISTA: AtributoInfo[] = [
  { sigla: 'FOR', nome: 'Força', campo: 'forca' },
  { sigla: 'DES', nome: 'Destreza', campo: 'destreza' },
  { sigla: 'CON', nome: 'Constituição', campo: 'constituicao' },
  { sigla: 'INT', nome: 'Inteligência', campo: 'inteligencia' },
  { sigla: 'SAB', nome: 'Sabedoria', campo: 'sabedoria' },
  { sigla: 'CAR', nome: 'Carisma', campo: 'carisma' },
];

export type TipoProtecao = 'ARMADURA' | 'ESCUDO';

export interface PericiaItem {
  id: string;
  nome: string;
  atributoChave: AtributoSigla;
  somenteTreinada?: boolean;
  treinada: boolean;
  outrosBonus: number;
  complemento?: string;
}

export interface HabilidadeOuTalento {
  id: string;
  nome: string;
  descricao: string;
}

export interface MagiaItem {
  id: string;
  nivelCirculo: number; // 0 a 9
  nome: string;
  custoPm: string;
  descricao: string;
}

export interface HabilidadeMagicaArma {
  id: string;
  nome: string;
  descricao?: string;
  bonusEquivalente?: string;
}

export interface ArmaItem {
  id: string;
  nome: string;
  bonusAtaque: string;
  dano: string;
  critico: string;
  distancia: string;
  tipoDano: string;
  usaDestreza?: boolean;
  outrosBonus?: number;
  habilidadesMagicas?: HabilidadeMagicaArma[];
}

export function obterHabilidadesMagicasArma(arma: ArmaItem): HabilidadeMagicaArma[] {
  if (!Array.isArray(arma.habilidadesMagicas)) return [];
  return arma.habilidadesMagicas.map((h: any, idx) => {
    if (typeof h === 'string') {
      return {
        id: `hab-arma-${idx}-${h}`,
        nome: h,
        descricao: '',
        bonusEquivalente: '',
      };
    }
    return {
      id: h.id || `hab-arma-${idx}`,
      nome: h.nome || '',
      descricao: h.descricao || '',
      bonusEquivalente: h.bonusEquivalente || '',
    };
  });
}

export interface ArmaduraEquipamento {
  id: string;
  nome: string;
  tipo: TipoProtecao;
  bonusCa: number;
  equipada: boolean;
}

export interface ItemGeral {
  id: string;
  nome: string;
  quantidade: string;
}

export interface ClassePersonagem {
  id: string;
  nome: string;
  nivel: number;
}

export interface FichaPersonagem {
  id: string;
  atualizadoEm: number;

  // 1. Dados Cadastrais
  nomePersonagem: string;
  jogador: string;
  raca: string;
  classe: string; // Resumo textual (ex: "Samurai 3 / Mago 4")
  nivel: number;  // Nível total do personagem (soma de todas as classes)
  classes?: ClassePersonagem[]; // Lista detalhada de classes e níveis
  tendencia: string;

  sexo: string;
  idade: string;
  divindade: string;
  tamanho: string;
  deslocamento: string;

  // 2. Atributos Principais
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;

  // Status de Combate: PV, PM, PE, Pontos de Ação, BBA, CA e Resistências (campos manuais)
  pvTotal: number;
  pvAtual: number;
  pmTotal: number;
  pmAtual: number;
  pontosAcao?: number; // Pontos de Ação (PA)
  peTotal?: number;    // Pontos de Energia Totais (PE)
  peAtual?: number;    // Pontos de Energia Atuais (PE)
  bba: number;
  caBonusTamanho: number;
  caOutrosBonus: number;
  fortitudeOutros: number;
  reflexosOutros: number;
  vontadeOutros: number;

  // 3. Perícias
  pericias: PericiaItem[];

  // 4. Habilidades de Raça, Classe, Manobras, Talentos e Magias
  habilidadesRaca: HabilidadeOuTalento[];
  habilidadesClasse: HabilidadeOuTalento[];
  manobras?: HabilidadeOuTalento[];
  talentos: HabilidadeOuTalento[];
  magias: MagiaItem[];

  // 5. Equipamentos
  armas: ArmaItem[];
  armaduras: ArmaduraEquipamento[];
  itensGerais: ItemGeral[];
  tibares: string;

  // Ordem personalizada das abas da ficha
  ordemAbas?: string[];

  // Buffs e Efeitos Temporários (Atributos, Resistências e PV Temporário)
  buffsTemporarios?: BuffsTemporarios;
}

export interface BuffsTemporarios {
  forca?: number;
  destreza?: number;
  constituicao?: number;
  inteligencia?: number;
  sabedoria?: number;
  carisma?: number;
  fortitude?: number;
  reflexos?: number;
  vontade?: number;
  pvTemporario?: number;
}

export function obterBuffsTemporarios(ficha: FichaPersonagem): Required<BuffsTemporarios> {
  const b = ficha.buffsTemporarios || {};
  return {
    forca: Number(b.forca) || 0,
    destreza: Number(b.destreza) || 0,
    constituicao: Number(b.constituicao) || 0,
    inteligencia: Number(b.inteligencia) || 0,
    sabedoria: Number(b.sabedoria) || 0,
    carisma: Number(b.carisma) || 0,
    fortitude: Number(b.fortitude) || 0,
    reflexos: Number(b.reflexos) || 0,
    vontade: Number(b.vontade) || 0,
    pvTemporario: Number(b.pvTemporario) || 0,
  };
}

export function temBuffsAtivos(ficha: FichaPersonagem): boolean {
  const b = obterBuffsTemporarios(ficha);
  return (
    b.forca !== 0 ||
    b.destreza !== 0 ||
    b.constituicao !== 0 ||
    b.inteligencia !== 0 ||
    b.sabedoria !== 0 ||
    b.carisma !== 0 ||
    b.fortitude !== 0 ||
    b.reflexos !== 0 ||
    b.vontade !== 0 ||
    b.pvTemporario !== 0
  );
}

export function contarBuffsAtivos(ficha: FichaPersonagem): number {
  const b = obterBuffsTemporarios(ficha);
  let count = 0;
  if (b.forca !== 0) count++;
  if (b.destreza !== 0) count++;
  if (b.constituicao !== 0) count++;
  if (b.inteligencia !== 0) count++;
  if (b.sabedoria !== 0) count++;
  if (b.carisma !== 0) count++;
  if (b.fortitude !== 0) count++;
  if (b.reflexos !== 0) count++;
  if (b.vontade !== 0) count++;
  if (b.pvTemporario !== 0) count++;
  return count;
}

export function zerarBuffsTemporarios(ficha: FichaPersonagem): FichaPersonagem {
  return {
    ...ficha,
    buffsTemporarios: {
      forca: 0,
      destreza: 0,
      constituicao: 0,
      inteligencia: 0,
      sabedoria: 0,
      carisma: 0,
      fortitude: 0,
      reflexos: 0,
      vontade: 0,
      pvTemporario: 0,
    },
  };
}

export function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function calcularModificador(valor: number): number {
  const num = Number.isFinite(valor) ? valor : 10;
  return Math.floor((num - 10) / 2);
}

export function formatarModificador(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function obterMeioNivel(nivel: number): number {
  const niv = Math.max(1, Math.floor(nivel || 1));
  return Math.floor(niv / 2);
}

export function obterValorAtributo(ficha: FichaPersonagem, sigla: AtributoSigla): number {
  const buffs = obterBuffsTemporarios(ficha);
  switch (sigla) {
    case 'FOR':
      return ficha.forca + buffs.forca;
    case 'DES':
      return ficha.destreza + buffs.destreza;
    case 'CON':
      return ficha.constituicao + buffs.constituicao;
    case 'INT':
      return ficha.inteligencia + buffs.inteligencia;
    case 'SAB':
      return ficha.sabedoria + buffs.sabedoria;
    case 'CAR':
      return ficha.carisma + buffs.carisma;
  }
}

export function obterValorAtributoBase(ficha: FichaPersonagem, sigla: AtributoSigla): number {
  switch (sigla) {
    case 'FOR':
      return ficha.forca;
    case 'DES':
      return ficha.destreza;
    case 'CON':
      return ficha.constituicao;
    case 'INT':
      return ficha.inteligencia;
    case 'SAB':
      return ficha.sabedoria;
    case 'CAR':
      return ficha.carisma;
  }
}

export function obterBuffAtributo(ficha: FichaPersonagem, sigla: AtributoSigla): number {
  const buffs = obterBuffsTemporarios(ficha);
  switch (sigla) {
    case 'FOR':
      return buffs.forca;
    case 'DES':
      return buffs.destreza;
    case 'CON':
      return buffs.constituicao;
    case 'INT':
      return buffs.inteligencia;
    case 'SAB':
      return buffs.sabedoria;
    case 'CAR':
      return buffs.carisma;
  }
}

export function obterModAtributo(ficha: FichaPersonagem, sigla: AtributoSigla): number {
  return calcularModificador(obterValorAtributo(ficha, sigla));
}

export function obterBonusArmaduraEquipada(ficha: FichaPersonagem): number {
  return (ficha.armaduras || [])
    .filter((a) => a.equipada && a.tipo === 'ARMADURA')
    .reduce((acc, item) => acc + (Number(item.bonusCa) || 0), 0);
}

export function obterBonusEscudoEquipado(ficha: FichaPersonagem): number {
  return (ficha.armaduras || [])
    .filter((a) => a.equipada && a.tipo === 'ESCUDO')
    .reduce((acc, item) => acc + (Number(item.bonusCa) || 0), 0);
}

/**
 * CA = 10 + 1/2 nível + mod_des + armadura + escudo + tamanho + outros bônus
 */
export function calcularCaTotal(ficha: FichaPersonagem): number {
  const meioNivel = obterMeioNivel(ficha.nivel);
  const modDes = obterModAtributo(ficha, 'DES');
  const armadura = obterBonusArmaduraEquipada(ficha);
  const escudo = obterBonusEscudoEquipado(ficha);
  const tamanho = Number(ficha.caBonusTamanho) || 0;
  const outros = Number(ficha.caOutrosBonus) || 0;
  return 10 + meioNivel + modDes + armadura + escudo + tamanho + outros;
}

/**
 * Graduação de perícia:
 * - Treinada: Nível + 3
 * - Não treinada: 1/2 Nível (arredondado para baixo)
 */
export function calcularGraduacaoPericia(ficha: FichaPersonagem, pericia: PericiaItem): number {
  const niv = Math.max(1, Math.floor(ficha.nivel || 1));
  return pericia.treinada ? niv + 3 : Math.floor(niv / 2);
}

/**
 * Total da perícia = Graduação + Mod. de Habilidade + Outros Bônus
 */
export function calcularTotalPericia(ficha: FichaPersonagem, pericia: PericiaItem): number {
  const grad = calcularGraduacaoPericia(ficha, pericia);
  const mod = obterModAtributo(ficha, pericia.atributoChave);
  const outros = Number(pericia.outrosBonus) || 0;
  return grad + mod + outros;
}

export function calcularResistencia(
  ficha: FichaPersonagem,
  tipo: 'fortitude' | 'reflexos' | 'vontade'
): number {
  const meioNivel = Math.floor((ficha.nivel || 1) / 2);
  const buffs = obterBuffsTemporarios(ficha);
  if (tipo === 'fortitude') {
    const modCon = obterModAtributo(ficha, 'CON');
    return meioNivel + modCon + (Number(ficha.fortitudeOutros) || 0) + buffs.fortitude;
  }
  if (tipo === 'reflexos') {
    const modDes = obterModAtributo(ficha, 'DES');
    return meioNivel + modDes + (Number(ficha.reflexosOutros) || 0) + buffs.reflexos;
  }
  const modSab = obterModAtributo(ficha, 'SAB');
  return meioNivel + modSab + (Number(ficha.vontadeOutros) || 0) + buffs.vontade;
}

export function calcularAtaqueArma(ficha: FichaPersonagem, arma: ArmaItem): number {
  const bba = Number(ficha.bba) || 0;
  const modAtributo = arma.usaDestreza
    ? obterModAtributo(ficha, 'DES')
    : obterModAtributo(ficha, 'FOR');
  const bonusTamanho = Number(ficha.caBonusTamanho) || 0;
  const outros = Number(arma.outrosBonus) || 0;

  return bba + modAtributo + bonusTamanho + outros;
}

export function criarPericiasPadrao(): PericiaItem[] {
  const base: Array<{ nome: string; atributoChave: AtributoSigla; somenteTreinada?: boolean }> = [
    { nome: 'Acrobacia', atributoChave: 'DES' },
    { nome: 'Adestrar Animais', atributoChave: 'CAR', somenteTreinada: true },
    { nome: 'Atletismo', atributoChave: 'FOR' },
    { nome: 'Atuação', atributoChave: 'CAR' },
    { nome: 'Cavalgar', atributoChave: 'DES' },
    { nome: 'Conhecimento', atributoChave: 'INT', somenteTreinada: true },
    { nome: 'Cura', atributoChave: 'SAB' },
    { nome: 'Diplomacia', atributoChave: 'CAR' },
    { nome: 'Enganação', atributoChave: 'CAR' },
    { nome: 'Furtividade', atributoChave: 'DES' },
    { nome: 'Identificar Magia', atributoChave: 'INT', somenteTreinada: true },
    { nome: 'Iniciativa', atributoChave: 'DES' },
    { nome: 'Intimidação', atributoChave: 'CAR' },
    { nome: 'Intuição', atributoChave: 'SAB' },
    { nome: 'Jogatina', atributoChave: 'CAR' },
    { nome: 'Ladinagem', atributoChave: 'DES', somenteTreinada: true },
    { nome: 'Meditação', atributoChave: 'SAB', somenteTreinada: true },
    { nome: 'Obter Informação', atributoChave: 'CAR' },
    { nome: 'Ofício', atributoChave: 'INT' },
    { nome: 'Percepção', atributoChave: 'SAB' },
    { nome: 'Sobrevivência', atributoChave: 'SAB' },
  ];

  return base.map((item, idx) => ({
    id: `pericia-${idx}-${item.nome.toLowerCase().replace(/\s+/g, '-')}`,
    nome: item.nome,
    atributoChave: item.atributoChave,
    somenteTreinada: item.somenteTreinada,
    treinada: false,
    outrosBonus: 0,
  }));
}

export function garantirPericiasPadrao(periciasAtuais: PericiaItem[]): PericiaItem[] {
  if (!Array.isArray(periciasAtuais) || periciasAtuais.length === 0) {
    return criarPericiasPadrao();
  }

  const padrao = criarPericiasPadrao();
  const nomesExistentes = new Set(
    periciasAtuais.map((p) => p.nome.trim().toLowerCase())
  );

  const novasAdicionadas = [...periciasAtuais];

  padrao.forEach((itemPadrao) => {
    const nomeNorm = itemPadrao.nome.trim().toLowerCase();
    const jaExiste = Array.from(nomesExistentes).some(
      (n) => n === nomeNorm || n.startsWith(`${nomeNorm} (`)
    );
    if (!jaExiste) {
      novasAdicionadas.push(itemPadrao);
      nomesExistentes.add(nomeNorm);
    }
  });

  return novasAdicionadas;
}

export function existeFichaComMesmoNome(
  fichas: FichaPersonagem[],
  nome: string,
  ignorarId?: string
): boolean {
  const normalizado = nome?.trim().toLowerCase();
  if (!normalizado) return false;
  return fichas.some(
    (f) => f.id !== ignorarId && f.nomePersonagem?.trim().toLowerCase() === normalizado
  );
}

export function gerarProximoNomePadrao(
  fichas: FichaPersonagem[],
  ignorarId?: string
): string {
  const base = 'Novo Personagem';
  const fichasValidas = fichas.filter((f) => f.id !== ignorarId);
  const nomesExistentes = new Set(
    fichasValidas
      .map((f) => f.nomePersonagem?.trim().toLowerCase())
      .filter(Boolean)
  );

  if (!nomesExistentes.has(base.toLowerCase())) {
    return base;
  }

  let indice = 2;
  while (nomesExistentes.has(`${base.toLowerCase()} ${indice}`)) {
    indice++;
  }
  return `${base} ${indice}`;
}

export function criarNovaFichaPadrao(): FichaPersonagem {
  return {
    id: gerarId(),
    atualizadoEm: Date.now(),
    nomePersonagem: '',
    jogador: '',
    raca: '',
    classe: '',
    nivel: 1,
    tendencia: '',
    sexo: '',
    idade: '',
    divindade: '',
    tamanho: 'Médio',
    deslocamento: '9m',
    forca: 10,
    destreza: 10,
    constituicao: 10,
    inteligencia: 10,
    sabedoria: 10,
    carisma: 10,
    pvTotal: 10,
    pvAtual: 10,
    pmTotal: 0,
    pmAtual: 0,
    pontosAcao: 1,
    peTotal: 0,
    peAtual: 0,
    bba: 0,
    caBonusTamanho: 0,
    caOutrosBonus: 0,
    fortitudeOutros: 0,
    reflexosOutros: 0,
    vontadeOutros: 0,
    pericias: criarPericiasPadrao(),
    habilidadesRaca: [],
    habilidadesClasse: [],
    manobras: [],
    talentos: [],
    magias: [],
    armas: [],
    armaduras: [],
    itensGerais: [],
    tibares: '',
    classes: [{ id: gerarId(), nome: '', nivel: 1 }],
  };
}

export function obterManobrasFicha(ficha: FichaPersonagem): HabilidadeOuTalento[] {
  return Array.isArray(ficha.manobras) ? ficha.manobras : [];
}

export function obterClassesFicha(ficha: FichaPersonagem): ClassePersonagem[] {
  if (Array.isArray(ficha.classes) && ficha.classes.length > 0) {
    return ficha.classes.map((c) => ({
      id: c.id || gerarId(),
      nome: c.nome || '',
      nivel: Math.max(1, Number(c.nivel) || 1),
    }));
  }
  const texto = ficha.classe?.trim() || '';
  if (!texto) {
    return [{ id: gerarId(), nome: '', nivel: Math.max(1, Number(ficha.nivel) || 1) }];
  }
  const partes = texto.split('/').map((p) => p.trim()).filter(Boolean);
  if (partes.length > 1) {
    return partes.map((p) => {
      const match = p.match(/^(.+?)\s*(?:\(?[Nn][íi]v\.?\s*)?(\d+)\)?$/);
      if (match) {
        return {
          id: gerarId(),
          nome: match[1].trim(),
          nivel: Math.max(1, parseInt(match[2], 10) || 1),
        };
      }
      return { id: gerarId(), nome: p, nivel: 1 };
    });
  }
  return [{ id: gerarId(), nome: texto, nivel: Math.max(1, Number(ficha.nivel) || 1) }];
}

export function formatarResumoClasses(classes: ClassePersonagem[]): string {
  const validas = classes.filter((c) => c.nome.trim());
  if (validas.length === 0) return '';
  return validas.map((c) => `${c.nome.trim()} ${c.nivel}`).join(' / ');
}

export function calcularNivelTotal(classes: ClassePersonagem[]): number {
  if (!classes || classes.length === 0) return 1;
  const total = classes.reduce((acc, c) => acc + (Math.max(1, Number(c.nivel) || 1)), 0);
  return Math.max(1, total);
}

export function atualizarClassesFicha(
  ficha: FichaPersonagem,
  novasClasses: ClassePersonagem[]
): FichaPersonagem {
  const classesNormalizadas = novasClasses.map((c) => ({
    ...c,
    nivel: Math.max(1, Number(c.nivel) || 1),
  }));
  const nivelTotal = calcularNivelTotal(classesNormalizadas);
  const resumo = formatarResumoClasses(classesNormalizadas);
  return {
    ...ficha,
    classes: classesNormalizadas,
    nivel: nivelTotal,
    classe: resumo || ficha.classe,
  };
}

export function aplicarClasseNaFicha(
  ficha: FichaPersonagem,
  classe: { nome: string; habilidades?: Array<{ nivel?: number; nome: string; descricao: string }> }
): FichaPersonagem {
  const classesAtuais = obterClassesFicha(ficha);
  let novasClasses = [...classesAtuais];
  const indexExistente = novasClasses.findIndex(
    (c) => c.nome.trim().toLowerCase() === classe.nome.trim().toLowerCase()
  );

  let nivelAlvo = 1;
  if (indexExistente >= 0) {
    nivelAlvo = novasClasses[indexExistente].nivel + 1;
    novasClasses[indexExistente] = {
      ...novasClasses[indexExistente],
      nivel: nivelAlvo,
    };
  } else if (novasClasses.length === 1 && !novasClasses[0].nome.trim()) {
    novasClasses[0] = {
      ...novasClasses[0],
      nome: classe.nome,
      nivel: 1,
    };
    nivelAlvo = 1;
  } else {
    novasClasses.push({
      id: gerarId(),
      nome: classe.nome,
      nivel: 1,
    });
    nivelAlvo = 1;
  }

  const novasHabs: HabilidadeOuTalento[] = (classe.habilidades || [])
    .filter((h) => (Number(h.nivel) || 1) <= nivelAlvo)
    .map((h) => ({
      id: gerarId(),
      nome: `${h.nome} [${classe.nome} ${h.nivel || 1}]`,
      descricao: h.descricao,
    }));

  const nomesExistentes = new Set(ficha.habilidadesClasse.map((h) => h.nome));
  const habsFiltradas = novasHabs.filter((h) => !nomesExistentes.has(h.nome));

  const fichaComClasses = atualizarClassesFicha(ficha, novasClasses);
  return {
    ...fichaComClasses,
    habilidadesClasse: [...fichaComClasses.habilidadesClasse, ...habsFiltradas],
  };
}




