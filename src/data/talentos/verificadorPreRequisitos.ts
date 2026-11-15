import { FichaPersonagem } from '../../models/ficha';
import { TalentoData, talentos } from './index';

// Cache dos nomes limpos dos talentos para busca rápida
interface TalentoRef {
  nomeOriginal: string;
  nomeBusca: string;
  talento: TalentoData;
}

const TALENTOS_REF: TalentoRef[] = talentos.map((t) => {
  const nomeLimpo = t.nome.replace(/\s*\[.*?\]/g, '').trim().toLowerCase();
  return {
    nomeOriginal: t.nome,
    nomeBusca: nomeLimpo,
    talento: t,
  };
});

// Ordenados por tamanho descrescente para casamento mais específico primeiro (ex: "Tiro Certeiro Preciso" antes de "Tiro Certeiro")
const TALENTOS_REF_ORDENADOS = [...TALENTOS_REF].sort(
  (a, b) => b.nomeBusca.length - a.nomeBusca.length
);

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

  for (const ref of TALENTOS_REF_ORDENADOS) {
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
  const textoNorm = texto.toLowerCase();

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

  // 4. Checagem de Perícias Treinadas
  const matchPericia = texto.match(/treinado em\s+([A-Za-zÀ-ÖØ-öø-ÿ\s]+?)(?:,|$|\.)/i);
  if (matchPericia) {
    const nomePericia = matchPericia[1].trim().toLowerCase();
    const possuiTreino = (ficha.pericias || []).some(
      (p) => p.nome.toLowerCase().includes(nomePericia) && p.treinada
    );
    if (!possuiTreino) {
      pendencias.push(`Treinado em ${matchPericia[1].trim()}`);
    }
  }

  // 5. Checagem de Talentos Pré-Requisito
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

