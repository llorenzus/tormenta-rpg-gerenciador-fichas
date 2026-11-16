import {
  calcularGraduacaoPericia,
  FichaPersonagem,
  obterClassesFicha,
} from '../../models/ficha';
import talentosRaw from './talentos.json';
import type { TalentoData } from './index';

// Cache dos nomes limpos dos talentos para busca rápida
interface TalentoRef {
  nomeOriginal: string;
  nomeBusca: string;
  talento: TalentoData;
}

let _talentosRefOrdenados: TalentoRef[] | null = null;

function getTalentosRefOrdenados(): TalentoRef[] {
  if (!_talentosRefOrdenados) {
    const lista = (talentosRaw as unknown as TalentoData[]).map((t) => {
      const nomeLimpo = t.nome.replace(/\s*\[.*?\]/g, '').trim().toLowerCase();
      return {
        nomeOriginal: t.nome,
        nomeBusca: nomeLimpo,
        talento: t,
      };
    });
    _talentosRefOrdenados = lista.sort(
      (a, b) => b.nomeBusca.length - a.nomeBusca.length
    );
  }
  return _talentosRefOrdenados;
}

/**
 * Normaliza texto para comparações sem acento e em caixa baixa
 */
function normalizarTexto(txt: string): string {
  return (txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Retorna o maior nível que o personagem possui na classe solicitada (ex: 'guerreiro', 'mago', etc.)
 */
function obterNivelClasseFicha(ficha: FichaPersonagem, nomeClasseBuscada: string): number {
  const normBuscada = normalizarTexto(nomeClasseBuscada);
  const classes = obterClassesFicha(ficha);
  let maiorNivel = 0;

  for (const c of classes) {
    const cNorm = normalizarTexto(c.nome);
    if (cNorm && (cNorm === normBuscada || cNorm.includes(normBuscada) || normBuscada.includes(cNorm))) {
      if ((c.nivel || 1) > maiorNivel) {
        maiorNivel = c.nivel || 1;
      }
    }
  }

  // Se não achou na lista estruturada de classes, tenta checar a string textual ficha.classe
  if (maiorNivel === 0 && ficha.classe) {
    const fichaClasseNorm = normalizarTexto(ficha.classe);
    if (fichaClasseNorm.includes(normBuscada)) {
      const regex = new RegExp(`${normBuscada}\\s*(\\d+)`, 'i');
      const match = fichaClasseNorm.match(regex);
      maiorNivel = match ? parseInt(match[1], 10) || 1 : 1;
    }
  }

  return maiorNivel;
}

/**
 * Checa se o personagem possui uma habilidade de classe (ou poder/talento equivalente ou classe de origem)
 */
function possuiHabilidadeDeClasse(ficha: FichaPersonagem, nomeHabilidade: string): boolean {
  const habNorm = normalizarTexto(nomeHabilidade);

  // 1. Checa na lista de habilidades de classe / talentos / raça
  const todasHabs = [
    ...(ficha.habilidadesClasse || []),
    ...(ficha.habilidadesRaca || []),
    ...(ficha.talentos || []),
  ];
  const encontrada = todasHabs.some((h) => {
    const n = normalizarTexto(h.nome);
    return n.includes(habNorm) || habNorm.includes(n);
  });
  if (encontrada) return true;

  // 2. Mapeamento de habilidades características por classe
  const classesPersonagem = obterClassesFicha(ficha).map((c) => normalizarTexto(c.nome));
  const temClasse = (classe: string) =>
    classesPersonagem.some((c) => c.includes(classe) || classe.includes(c));

  if (habNorm.includes('furia') && temClasse('barbaro')) return true;
  if (
    (habNorm.includes('musica de bardo') ||
      habNorm.includes('cancao') ||
      habNorm.includes('conhecimento de bardo')) &&
    temClasse('bardo')
  ) {
    return true;
  }
  if (
    habNorm.includes('canalizar energia') &&
    (temClasse('clerigo') || temClasse('paladino'))
  ) {
    return true;
  }
  if (
    (habNorm.includes('destruir o mal') ||
      habNorm.includes('cura pelas maos') ||
      habNorm.includes('detectar o mal')) &&
    temClasse('paladino')
  ) {
    return true;
  }
  if (
    (habNorm.includes('companheiro animal') || habNorm.includes('forma selvagem')) &&
    temClasse('druida')
  ) {
    return true;
  }
  if (
    habNorm.includes('empatia selvagem') &&
    (temClasse('druida') || temClasse('ranger'))
  ) {
    return true;
  }
  if (
    (habNorm.includes('inimigo predileto') || habNorm.includes('terreno predileto')) &&
    temClasse('ranger')
  ) {
    return true;
  }
  if (
    (habNorm.includes('tecnica ladina') || habNorm.includes('ataque furtivo')) &&
    temClasse('ladino')
  ) {
    return true;
  }
  if (habNorm.includes('sortudo') && temClasse('swashbuckler')) return true;
  if (habNorm.includes('familiar') && (temClasse('mago') || temClasse('feiticeiro'))) {
    return true;
  }

  return false;
}

/**
 * Verifica se o personagem é treinado em uma perícia
 */
function verificarPericiaTreinada(ficha: FichaPersonagem, nomePericia: string): boolean {
  const pericias = ficha.pericias || [];
  const normBuscada = normalizarTexto(nomePericia.replace(/perícia\s*\(|\)/gi, ''));

  if (normBuscada.includes('escolhida') || normBuscada.includes('qualquer')) {
    return pericias.some((p) => p.treinada);
  }

  return pericias.some((p) => {
    const nomeNorm = normalizarTexto(p.nome);
    const compNorm = normalizarTexto(p.complemento || '');
    const combinado = `${nomeNorm} ${compNorm}`.trim();
    return (
      (combinado.includes(normBuscada) || normBuscada.includes(nomeNorm)) && p.treinada
    );
  });
}

/**
 * Retorna as graduações do personagem em uma perícia
 */
function obterGraduacaoPericia(ficha: FichaPersonagem, nomePericia: string): number {
  const pericias = ficha.pericias || [];
  const normBuscada = normalizarTexto(nomePericia.replace(/perícia\s*\(|\)/gi, ''));

  const pericia = pericias.find((p) => {
    const nomeNorm = normalizarTexto(p.nome);
    const compNorm = normalizarTexto(p.complemento || '');
    const combinado = `${nomeNorm} ${compNorm}`.trim();
    return combinado.includes(normBuscada) || normBuscada.includes(nomeNorm);
  });

  if (!pericia) {
    const niv = Number(ficha.nivel) || 1;
    return Math.floor(niv / 2);
  }

  return calcularGraduacaoPericia(ficha, pericia);
}

/**
 * Identifica talentos que são citados como pré-requisito no texto
 */
export function identificarTalentosCitadosEmPreRequisitos(
  preReqTexto: string,
  talentoAtualId?: string
): TalentoData[] {
  if (!preReqTexto || preReqTexto.trim() === 'Nenhum.' || preReqTexto.trim() === 'Nenhum') {
    return [];
  }

  const textoNorm = preReqTexto.toLowerCase();
  const encontrados: TalentoData[] = [];
  const nomesJaAdicionados = new Set<string>();

  for (const ref of getTalentosRefOrdenados()) {
    if (ref.talento.id === talentoAtualId) continue;

    // Evita falsos positivos com palavras curtas genéricas
    if (ref.nomeBusca.length < 4) continue;

    if (textoNorm.includes(ref.nomeBusca)) {
      if (!nomesJaAdicionados.has(ref.talento.id)) {
        nomesJaAdicionados.add(ref.talento.id);
        encontrados.push(ref.talento);
      }
    }
  }

  return encontrados;
}

export interface ResultadoPreRequisitos {
  cumpre: boolean;
  pendencias: string[];
}

/**
 * Verifica se um personagem atende aos pré-requisitos de um talento
 */
export function verificarPreRequisitosCumpridos(
  ficha: FichaPersonagem,
  talento: TalentoData
): ResultadoPreRequisitos {
  const texto = (talento.preRequisitos || '').trim();
  if (
    !texto ||
    texto === 'Nenhum.' ||
    texto === 'Nenhum' ||
    texto === '—' ||
    texto === '-'
  ) {
    return { cumpre: true, pendencias: [] };
  }

  const pendencias: string[] = [];

  // 1. Checagem de Atributos
  // Força
  const matchFor = texto.match(/(?:for(?:ça)?)\s*(\d+)/i);
  if (matchFor) {
    const min = parseInt(matchFor[1], 10);
    if ((Number(ficha.forca) || 0) < min) {
      pendencias.push(`Força ${min} (possui ${ficha.forca || 10})`);
    }
  }

  // Destreza
  const matchDes = texto.match(/(?:des(?:treza)?)\s*(\d+)/i);
  if (matchDes) {
    const min = parseInt(matchDes[1], 10);
    if ((Number(ficha.destreza) || 0) < min) {
      pendencias.push(`Destreza ${min} (possui ${ficha.destreza || 10})`);
    }
  }

  // Constituição
  const matchCon = texto.match(/(?:con(?:stituição)?)\s*(\d+)/i);
  if (matchCon) {
    const min = parseInt(matchCon[1], 10);
    if ((Number(ficha.constituicao) || 0) < min) {
      pendencias.push(`Constituição ${min} (possui ${ficha.constituicao || 10})`);
    }
  }

  // Inteligência
  const matchInt = texto.match(/(?:int(?:eligência)?)\s*(\d+)/i);
  if (matchInt) {
    const min = parseInt(matchInt[1], 10);
    if ((Number(ficha.inteligencia) || 0) < min) {
      pendencias.push(`Inteligência ${min} (possui ${ficha.inteligencia || 10})`);
    }
  }

  // Sabedoria
  const matchSab = texto.match(/(?:sab(?:edoria)?)\s*(\d+)/i);
  if (matchSab) {
    const min = parseInt(matchSab[1], 10);
    if ((Number(ficha.sabedoria) || 0) < min) {
      pendencias.push(`Sabedoria ${min} (possui ${ficha.sabedoria || 10})`);
    }
  }

  // Carisma
  const matchCar = texto.match(/(?:car(?:isma)?)\s*(\d+)/i);
  if (matchCar) {
    const min = parseInt(matchCar[1], 10);
    if ((Number(ficha.carisma) || 0) < min) {
      pendencias.push(`Carisma ${min} (possui ${ficha.carisma || 10})`);
    }
  }

  // 2. Checagem de BBA (Bônus Base de Ataque)
  const matchBba = texto.match(/(?:bônus base de ataque|bba)\s*\+?(\d+)/i);
  if (matchBba) {
    const minBba = parseInt(matchBba[1], 10);
    if ((Number(ficha.bba) || 0) < minBba) {
      pendencias.push(`BBA +${minBba} (possui +${ficha.bba || 0})`);
    }
  }

  // 3. Checagem de Nível de Personagem
  const matchNivel = texto.match(/(\d+)º?\s*nível\s+de\s+personagem/i);
  if (matchNivel) {
    const minNiv = parseInt(matchNivel[1], 10);
    if ((Number(ficha.nivel) || 1) < minNiv) {
      pendencias.push(`${minNiv}º nível de personagem (está no ${ficha.nivel || 1}º)`);
    }
  }

  // 4. Checagem de Classes e Níveis de Classe
  // a) Classe <Nome> (ex: 'Classe mago.', 'Classe druida', 'Classe clérigo', 'Classe feiticeiro')
  const classeApenasMatches = [
    ...texto.matchAll(/(?<!habilidade\s+de\s+)(?:classe|classes)\s+([A-Za-zÀ-ÿ]+)/gi),
  ];
  for (const m of classeApenasMatches) {
    const nomeClasse = m[1];
    const nomeNorm = normalizarTexto(nomeClasse);
    if (!['conjuradora', 'habilidade', 'prestigio', 'variante'].includes(nomeNorm)) {
      const nivelNaClasse = obterNivelClasseFicha(ficha, nomeClasse);
      if (nivelNaClasse < 1) {
        pendencias.push(`Classe ${nomeClasse}`);
      }
    }
  }

  // b) <Classe> [de] <X>º nível (ex: 'guerreiro 4º nível', 'mago 4º nível', 'Artífice 1º nível')
  const classeNivelMatches = [
    ...texto.matchAll(/([A-Za-zÀ-ÿ]+)(?:\s+de)?\s+(\d+)º?\s*nível(?!\s+de\s+personagem)/gi),
  ];
  for (const m of classeNivelMatches) {
    const nomeClasse = m[1];
    const nomeNorm = normalizarTexto(nomeClasse);
    if (
      ![
        'personagem',
        'outro',
        'outros',
        'magias',
        'magia',
        'conjurador',
        'divinas',
        'arcanas',
      ].includes(nomeNorm)
    ) {
      const nivelMin = parseInt(m[2], 10);
      const nivelAtual = obterNivelClasseFicha(ficha, nomeClasse);
      if (nivelAtual < nivelMin) {
        pendencias.push(
          `${nomeClasse} ${nivelMin}º nível (possui nível ${nivelAtual})`
        );
      }
    }
  }

  // c) Habilidade de classe <Nome> ou <Nome> como habilidade de classe
  const habClasseMatches = [
    ...texto.matchAll(/habilidade\s+de\s+classe\s+([A-Za-zÀ-ÿ\s\/\(\)]+?)(?:,|$|\.|\se\s)/gi),
  ];
  for (const m of habClasseMatches) {
    const nomeHab = m[1].trim();
    if (!possuiHabilidadeDeClasse(ficha, nomeHab)) {
      pendencias.push(`Habilidade de classe: ${nomeHab}`);
    }
  }

  const comoHabMatches = [
    ...texto.matchAll(/([A-Za-zÀ-ÿ\s]+?)\s+como\s+habilidade\s+de\s+classe/gi),
  ];
  for (const m of comoHabMatches) {
    const nomeHab = m[1].trim();
    if (!possuiHabilidadeDeClasse(ficha, nomeHab)) {
      pendencias.push(`Habilidade de classe: ${nomeHab}`);
    }
  }

  // d) Capacidade de lançar magias arcanas ou divinas
  if (/capacidade\s+de\s+lançar\s+magias?\s+arcanas?/i.test(texto)) {
    const classesArcanas = [
      'mago',
      'feiticeiro',
      'bardo',
      'necromante',
      'ilusionista',
      'evocador',
      'abjurador',
      'adivinho',
      'encantador',
      'transmutador',
    ];
    const temClasseArcana = classesArcanas.some(
      (c) => obterNivelClasseFicha(ficha, c) > 0
    );
    const temMagiaArcana = (ficha.magias || []).some(
      (m) => (m.tipo || '').toLowerCase().includes('arcana')
    );
    if (!temClasseArcana && !temMagiaArcana) {
      pendencias.push('Capacidade de lançar magias arcanas');
    }
  }

  if (/capacidade\s+de\s+lançar\s+magias?\s+divinas?/i.test(texto)) {
    const classesDivinas = ['clerigo', 'druida', 'paladino', 'ranger', 'abencoado'];
    const temClasseDivina = classesDivinas.some(
      (c) => obterNivelClasseFicha(ficha, c) > 0
    );
    const temMagiaDivina = (ficha.magias || []).some(
      (m) => (m.tipo || '').toLowerCase().includes('divina')
    );
    if (!temClasseDivina && !temMagiaDivina) {
      pendencias.push('Capacidade de lançar magias divinas');
    }
  }

  // 5. Checagem de Perícias
  // a) <Perícia> <X> graduações
  const gradMatches = [
    ...texto.matchAll(/([A-Za-zÀ-ÿ\s\(\)]+?)\s+(\d+)\s+graduaç(?:ão|ões)/gi),
  ];
  for (const m of gradMatches) {
    const nomePericia = m[1].replace(/^(?:e|ou|,)\s+/i, '').trim();
    const minGrad = parseInt(m[2], 10);
    const gradAtual = obterGraduacaoPericia(ficha, nomePericia);
    if (gradAtual < minGrad) {
      pendencias.push(`${nomePericia} ${minGrad} graduações (possui ${gradAtual})`);
    }
  }

  // b) Treinado em <Perícia> (suporta múltiplas perícias com 'e' ou 'ou')
  const treinadoMatches = [
    ...texto.matchAll(/(?:treinad[oa]s?\s+em|treinad[oa]\s+na\s+perícia)\s+([^,.;]+)/gi),
  ];
  for (const tm of treinadoMatches) {
    const raw = tm[1].trim();
    if (/\s+ou\s+/i.test(raw)) {
      const parts = raw.split(/\s+ou\s+/i).map((s) => s.trim());
      const atendeAoMenosUma = parts.some((p) => verificarPericiaTreinada(ficha, p));
      if (!atendeAoMenosUma) {
        pendencias.push(`Treinado em ${parts.join(' ou ')}`);
      }
    } else if (/\s+e\s+/i.test(raw)) {
      const parts = raw.split(/\s+e\s+/i).map((s) => s.trim());
      for (const p of parts) {
        if (!verificarPericiaTreinada(ficha, p)) {
          pendencias.push(`Treinado em ${p}`);
        }
      }
    } else {
      if (!verificarPericiaTreinada(ficha, raw)) {
        pendencias.push(`Treinado em ${raw}`);
      }
    }
  }

  // 6. Checagem de Talentos Pré-Requisito
  const talentosExigidos = identificarTalentosCitadosEmPreRequisitos(texto, talento.id);
  const talentosFichaNorm = (ficha.talentos || []).map((t) =>
    t.nome.replace(/\s*\[.*?\]/g, '').trim().toLowerCase()
  );

  for (const exigido of talentosExigidos) {
    const exigidoNomeBusca = exigido.nome.replace(/\s*\[.*?\]/g, '').trim().toLowerCase();
    const possui = talentosFichaNorm.some(
      (nomeFicha) =>
        nomeFicha === exigidoNomeBusca ||
        nomeFicha.includes(exigidoNomeBusca) ||
        exigidoNomeBusca.includes(nomeFicha)
    );
    if (!possui) {
      pendencias.push(`Talento: ${exigido.nome}`);
    }
  }

  return {
    cumpre: pendencias.length === 0,
    pendencias,
  };
}
