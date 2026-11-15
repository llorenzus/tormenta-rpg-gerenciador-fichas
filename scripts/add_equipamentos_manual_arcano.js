const fs = require('fs');
const path = require('path');

const equipamentosFilePath = path.join(__dirname, '..', 'src', 'data', 'equipamentos', 'equipamentos.json');
const armasMagicasFilePath = path.join(__dirname, '..', 'src', 'data', 'regras', 'armas_magicas.json');

const equipamentos = JSON.parse(fs.readFileSync(equipamentosFilePath, 'utf8'));
const armasMagicas = JSON.parse(fs.readFileSync(armasMagicasFilePath, 'utf8'));

const novosEquipamentos = [
  // --- INSTRUMENTOS E FERRAMENTAS ARCANAS ---
  {
    id: 'ampulheta_alquimica',
    nome: 'Ampulheta Alquímica',
    tipo: 'Item Geral',
    categoria: 'Ferramentas e Instrumentos',
    preco: '25 TO',
    peso: '0,5Kg',
    descricao: 'Ampulheta calibrada com areia fina encantada, essencial para cronometrar reações químicas e rituais mágicos precisos. Concede +1 em testes de Ofício (alquimia).',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'astrolabio_arcano',
    nome: 'Astrolábio Arcano',
    tipo: 'Item Geral',
    categoria: 'Ferramentas e Instrumentos',
    preco: '100 TO',
    peso: '1Kg',
    descricao: 'Dispositivo mecânico de latão e lentes de quartzo que mapeia constelações e auras planares. Concede +2 em testes de Conhecimento (arcano) para reconhecer influências cosmológicas e portais.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'balanca_precisao_alquimica',
    nome: 'Balança de Precisão Alquímica',
    tipo: 'Item Geral',
    categoria: 'Ferramentas e Instrumentos',
    preco: '30 TO',
    peso: '1Kg',
    descricao: 'Balança de pratos de prata capaz de medir frações mínimas de grãos e pós mágicos. Reduz em 5% o custo de matérias-primas na preparação de poções.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'bolsa_componentes_luxo',
    nome: 'Bolsa de Componentes de Luxo',
    tipo: 'Item Geral',
    categoria: 'Ferramentas e Instrumentos',
    preco: '50 TO',
    peso: '1Kg',
    descricao: 'Bolsa de veludo impermeável forrada com compartimentos almofadados, preservando ervas raras, pós e gemas mágicas sem risco de contaminação.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'frasco_obra_prima',
    nome: 'Frasco Obra-Prima',
    tipo: 'Item Geral',
    categoria: 'Ferramentas e Instrumentos',
    preco: '10 TO',
    peso: '0,2Kg',
    descricao: 'Frasco de cristal temperado com rolha de chumbo e runas protetoras. Poções e óleos armazenados nele nunca se deterioram e têm +2 em testes contra quebra.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'giz_circulo_magico',
    nome: 'Giz de Círculo Mágico',
    tipo: 'Item Geral',
    categoria: 'Ferramentas e Instrumentos',
    preco: '15 TO',
    peso: '0,1Kg',
    descricao: 'Giz feito com cinzas de incenso sagrado e prata moída. Permite desenhar círculos arcanos concedendo +1 na CD de magias de abjuração ou rituais de proteção.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'grimorio_obra_prima',
    nome: 'Grimório Obra-Prima',
    tipo: 'Item Geral',
    categoria: 'Ferramentas e Instrumentos',
    preco: '150 TO',
    peso: '1,5Kg',
    descricao: 'Tomo encadernado em couro de basilisco com folhas de pergaminho tratadas com elixir alquímico impermeável e resistente a fogo. Comporta até 200 magias.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'caldeirao_bronze_arcano',
    nome: 'Caldeirão de Bronze Arcano',
    tipo: 'Item Geral',
    categoria: 'Ferramentas e Instrumentos',
    preco: '80 TO',
    peso: '5Kg',
    descricao: 'Caldeirão gravado com símbolos ocultos, ideal para rituais de bruxaria e preparação de infusões de grande volume.',
    livroFonte: 'Manual do Arcano'
  },

  // --- VARINHAS DE MATERIAIS ESPECIAIS ---
  {
    id: 'varinha_madeira_teixo',
    nome: 'Varinha de Madeira de Teixo',
    tipo: 'Item Geral',
    categoria: 'Foco Arcano',
    preco: '50 TO',
    peso: '0,2Kg',
    descricao: 'Varinha entalhada em teixo sagrado, com afinidade por magias de morte e necromancia. Aumenta a CD de magias de necromancia lançadas através dela em +1.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'varinha_carvalho_supremo',
    nome: 'Varinha de Carvalho Supremo',
    tipo: 'Item Geral',
    categoria: 'Foco Arcano',
    preco: '50 TO',
    peso: '0,2Kg',
    descricao: 'Varinha robusta extraída de carvalhos milenares de Galrasia ou Tollon. Concede +1 no dano por dado para magias da escola de Evocação.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'varinha_sabugueiro',
    nome: 'Varinha de Sabugueiro Antigo',
    tipo: 'Item Geral',
    categoria: 'Foco Arcano',
    preco: '75 TO',
    peso: '0,2Kg',
    descricao: 'Varinha feita de madeira tradicional de bruxaria. Concede +1 em testes de Concentração e na superação de resistência a magia de oponentes.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'varinha_osso_dragao',
    nome: 'Varinha de Osso de Dragão',
    tipo: 'Item Geral',
    categoria: 'Foco Arcano',
    preco: '200 TO',
    peso: '0,3Kg',
    descricao: 'Entalhada a partir de uma costela de dragão ancião, imbuída com centelhas elementais. Concede +1 na CD de todas as magias elementais correspondentes ao dragão.',
    livroFonte: 'Manual do Arcano'
  },

  // --- ITENS ALQUÍMICOS E POÇÕES ESPECIAIS ---
  {
    id: 'elixir_mana_menor',
    nome: 'Elixir de Mana Menor',
    tipo: 'Item Geral',
    categoria: 'Item Alquímico',
    preco: '60 TO',
    peso: '0,2Kg',
    descricao: 'Líquido azul brilhante aromático. Como ação padrão ao bebê-lo, o usuário recupera instantaneamente 1d4 Pontos de Mana (PM). Máximo 1 uso benéfico por hora.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'elixir_mana_normal',
    nome: 'Elixir de Mana',
    tipo: 'Item Geral',
    categoria: 'Item Alquímico',
    preco: '250 TO',
    peso: '0,2Kg',
    descricao: 'Versão aprimorada do elixir místico. Como ação padrão ao bebê-lo, recupera instantaneamente 2d4 Pontos de Mana (PM).',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'elixir_mana_maior',
    nome: 'Elixir de Mana Maior',
    tipo: 'Item Geral',
    categoria: 'Item Alquímico',
    preco: '750 TO',
    peso: '0,2Kg',
    descricao: 'Poderosa infusão de mana destilada em laboratório arcano de alto grau. Bebê-lo recupera instantaneamente 4d4 Pontos de Mana (PM).',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'balsamo_restaurador_arcano',
    nome: 'Bálsamo Restaurador Arcano',
    tipo: 'Item Geral',
    categoria: 'Item Alquímico',
    preco: '90 TO',
    peso: '0,5Kg',
    descricao: 'Pomada luminescente que recupera 2d6 PV e remove condições de fadiga mística e esgotamento leve.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'fogo_alquimico_concentrado',
    nome: 'Fogo Alquímico Concentrado',
    tipo: 'Item Geral',
    categoria: 'Item Alquímico',
    preco: '50 TO',
    peso: '0,5Kg',
    descricao: 'Frasco de arremesso contendo composto incendiário refinado. Causa 3d6 de dano de fogo no ponto de impacto e 1d6 no início da rodada seguinte.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'nevoa_ocultante_frasco',
    nome: 'Névoa Ocultante em Frasco',
    tipo: 'Item Geral',
    categoria: 'Item Alquímico',
    preco: '40 TO',
    peso: '0,5Kg',
    descricao: 'Ao ser quebrado no chão, libera uma fumaça densa que obscurece a visão em um raio de 4,5m por 1d4 rodadas (camuflagem total).',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'granada_atordoamento_alquimica',
    nome: 'Granada de Atordoamento Alquímica',
    tipo: 'Item Geral',
    categoria: 'Item Alquímico',
    preco: '70 TO',
    peso: '0,5Kg',
    descricao: 'Bomba de pó de magnésio e fósforo que explode em clarão e estrondo ensurdecedor. Criaturas a até 3m devem ter sucesso em Fortitude CD 15 ou ficam atordoadas por 1 rodada.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'po_dissipacao_efemera',
    nome: 'Pó da Dissipação Efêmera',
    tipo: 'Item Geral',
    categoria: 'Item Alquímico',
    preco: '120 TO',
    peso: '0,2Kg',
    descricao: 'Soprado em cone de 3m como ação padrão. Realiza teste de dissipação (1d20+5) contra todas as magias ativas de até 2º círculo na área.',
    livroFonte: 'Manual do Arcano'
  },

  // --- VESTIMENTAS E ITENS MÁGICOS NOTÁVEIS ---
  {
    id: 'tunica_das_escolas',
    nome: 'Túnica das Escolas Arcanas',
    tipo: 'Item Geral',
    categoria: 'Vestuário Mágico',
    preco: '1.200 TO',
    peso: '1Kg',
    descricao: 'Manto bordado com fios de seda prateada que reage à escola de magia predileta do usuário, concedendo +1 na classe de armadura e +1 em testes de Concentração.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'manto_do_conjurador',
    nome: 'Manto do Conjurador',
    tipo: 'Item Geral',
    categoria: 'Vestuário Mágico',
    preco: '2.500 TO',
    peso: '1,5Kg',
    descricao: 'Capa requintada que concede ao usuário +2 em todos os testes de resistência contra magias e habilidades similares a magia.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'luvas_canalizacao_toque',
    nome: 'Luvas de Canalização de Toque',
    tipo: 'Item Geral',
    categoria: 'Vestuário Mágico',
    preco: '2.000 TO',
    peso: '0,5Kg',
    descricao: 'Luvas finas de couro de hidra. Permitem ao conjurador desferir magias de toque corpo a corpo com alcance curto de 9 metros uma vez por combate.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'botas_andarilho_astral',
    nome: 'Botas de Andarilho Astral',
    tipo: 'Item Geral',
    categoria: 'Item Maravilhoso',
    preco: '4.500 TO',
    peso: '1Kg',
    descricao: 'Permitem ao usuário caminhar sobre o ar ou superfícies líquidas por até 10 minutos por dia e concedem +3m no deslocamento terrestre.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'anel_contramagica',
    nome: 'Anel da Contramágica',
    tipo: 'Item Geral',
    categoria: 'Item Mágico',
    preco: '8.000 TO',
    peso: '—',
    descricao: 'Anel de platina com um safira central. Permite armazenar uma magia de dissipar magia ou anulação que dispara automaticamente como reação quando o portador é alvo de feitiço hostil.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'anel_graca_das_aguas',
    nome: 'Anel da Graça das Águas',
    tipo: 'Item Geral',
    categoria: 'Item Mágico',
    preco: '3.000 TO',
    peso: '—',
    descricao: 'Concede capacidade de respirar embaixo d\'água indefinidamente e velocidade de natação igual ao deslocamento terrestre.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'barraca_segura_aleph',
    nome: 'Barraca Segura de Aleph',
    tipo: 'Item Geral',
    categoria: 'Item Maravilhoso',
    preco: '3.500 TO',
    peso: '2Kg',
    descricao: 'Pano dobrável de seda que, quando montado com uma palavra de comando, transforma-se em abrigo fortificado impermeável, quente e com camuflagem mágica.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'bastao_favor_wynna',
    nome: 'Bastão do Favor de Wynna',
    tipo: 'Item Geral',
    categoria: 'Item Mágico',
    preco: '12.000 TO',
    peso: '1,5Kg',
    descricao: 'Bastão encimado por uma esfera de cristal flutuante. Uma vez por dia, permite lançar uma magia arcana qualquer de até 4º círculo sem gastar Pontos de Mana.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'bordao_defesa',
    nome: 'Bordão de Defesa',
    tipo: 'Arma',
    categoria: 'Arma Mágica',
    preco: '14.000 TO',
    dano: '1d6/1d6',
    critico: 'x2',
    peso: '2Kg',
    tipoDano: 'Esmagamento',
    empunhadura: 'Dupla',
    descricao: 'Bordão mágico +2 de defesa que permite conjurar Armadura Arcana, Escudo da Fé e Proteção contra o Mal gastando cargas ou PM.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'bordao_evocacao',
    nome: 'Bordão de Evocação',
    tipo: 'Arma',
    categoria: 'Arma Mágica',
    preco: '18.000 TO',
    dano: '1d6/1d6',
    critico: 'x2',
    peso: '2Kg',
    tipoDano: 'Esmagamento',
    empunhadura: 'Dupla',
    descricao: 'Bordão mágico entalhado com runas ígneas e elétricas (+2 no ataque). Permite lançar Bola de Fogo, Relâmpago e Mísseis Mágicos com CD aumentada em +2.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'bordao_invocacao',
    nome: 'Bordão de Invocação',
    tipo: 'Arma',
    categoria: 'Arma Mágica',
    preco: '16.000 TO',
    dano: '1d6/1d6',
    critico: 'x2',
    peso: '2Kg',
    tipoDano: 'Esmagamento',
    empunhadura: 'Dupla',
    descricao: 'Bordão encimado por garras entalhadas segurando uma pedra da lua (+2 no ataque). Permite conjurar Invocar Monstro III e Teletransporte com menor custo.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'bordao_do_tempo',
    nome: 'Bordão do Tempo',
    tipo: 'Arma',
    categoria: 'Arma Mágica',
    preco: '25.000 TO',
    dano: '1d6/1d6',
    critico: 'x2',
    peso: '2Kg',
    tipoDano: 'Esmagamento',
    empunhadura: 'Dupla',
    descricao: 'Obra-prima cronomântica. Permite usar Velocidade e Lentidão à vontade gastando PM normais, e 1/dia conceder uma rodada inteira extra de ações ao portador.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'chave_de_wynna',
    nome: 'Chave de Wynna',
    tipo: 'Item Geral',
    categoria: 'Item Maravilhoso',
    preco: '9.000 TO',
    peso: '0,1Kg',
    descricao: 'Chave ornamental de oricalco capaz de trancar ou destrancar qualquer porta, baú ou barreira mágica como a magia Tranca Arcana e Arrombar supremas.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'colar_bolas_fogo',
    nome: 'Colar das Bolas de Fogo',
    tipo: 'Item Geral',
    categoria: 'Item Maravilhoso',
    preco: '5.400 TO',
    peso: '0,5Kg',
    descricao: 'Colar dourado com esferas vermelhas brilhantes destacáveis. Cada esfera pode ser arremessada como ação de ataque gerando uma explosão de Bola de Fogo (5d6 a 8d6 de dano).',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'manto_dos_dao',
    nome: 'Manto dos Dao',
    tipo: 'Item Geral',
    categoria: 'Item Maravilhoso',
    preco: '15.000 TO',
    peso: '2Kg',
    descricao: 'Tecido com pó de pedras preciosas da terra elemental. Concede ao usuário Redução de Dano 10/adamante e a capacidade de atravessar rocha sólida.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'monoculo_aguia',
    nome: 'Monóculo da Águia',
    tipo: 'Item Geral',
    categoria: 'Item Maravilhoso',
    preco: '2.500 TO',
    peso: '—',
    descricao: 'Lente de cristal límpido. Concede +5 em testes de Percepção visual e permite enxergar detalhes a até 1 quilômetro de distância.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'robe_das_estrelas',
    nome: 'Robe das Estrelas',
    tipo: 'Item Geral',
    categoria: 'Item Maravilhoso',
    preco: '22.000 TO',
    peso: '1,5Kg',
    descricao: 'Túnica de veludo azul-noite cintilante como o céu estrelado. Permite viajar instantaneamente para o Plano Astral e disparar até 6 estrelas brilhantes de energia pura (dano 4d6 cada).',
    livroFonte: 'Manual do Arcano'
  }
];

let eqAdicionados = 0;
for (const eq of novosEquipamentos) {
  const idx = equipamentos.findIndex(e => e.id === eq.id);
  if (idx >= 0) {
    equipamentos[idx] = eq;
  } else {
    equipamentos.push(eq);
    eqAdicionados++;
  }
}
fs.writeFileSync(equipamentosFilePath, JSON.stringify(equipamentos, null, 2), 'utf8');
console.log(`Equipamentos: ${eqAdicionados} itens inseridos. Total: ${equipamentos.length}`);

// --- NOVOS PODERES DE ARMAS E ARMADURAS MÁGICAS ---
const novosPoderes = [
  {
    id: 'poder_dolorosa',
    nome: 'Dolorosa',
    tipo: 'Armas Mágicas',
    subtipo: 'Poder Especial de Arma Corpo a Corpo',
    bonusEquivalente: '+1 de bônus',
    descricao: 'A arma possui serrilhas cruéis ou ganchos místicos que causam ferimentos profundos e hemorragias persistentes.',
    detalhes: 'Ao acertar um ataque com esta arma, o alvo sofre 1d4 de dano de sangramento contínuo no início de cada um de seus turnos. O sangramento cessa com um teste de Cura CD 15 ou qualquer efeito de magia de cura.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'poder_drenante',
    nome: 'Drenante',
    tipo: 'Armas Mágicas',
    subtipo: 'Poder Especial de Arma Corpo a Corpo',
    bonusEquivalente: '+2 de bônus',
    descricao: 'A arma ressoa com energias de drenagem espiritual que sugam a energia vital e mística de seus oponentes.',
    detalhes: 'Ao confirmar um acerto crítico contra uma criatura com capacidade mágica, a arma drena 1 Ponto de Mana (PM) do alvo e transfere imediatamente para a reserva de mana do usuário (não pode ultrapassar o máximo normal do usuário).',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'poder_impaciente',
    nome: 'Impaciente',
    tipo: 'Armas Mágicas',
    subtipo: 'Poder Especial de Arma',
    bonusEquivalente: '+1 de bônus',
    descricao: 'A arma pulsa com agilidade sobrenatural e anseia pelo combate antes mesmo de qualquer outro combatente reagir.',
    detalhes: 'Enquanto a arma estiver na bainha ou empunhada, o portador recebe um bônus de +2 em jogadas de Iniciativa e pode sacar ou embainhar a arma como uma ação livre imediata.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'poder_primitiva',
    nome: 'Primitiva',
    tipo: 'Armas Mágicas',
    subtipo: 'Poder Especial de Arma Corpo a Corpo',
    bonusEquivalente: '+1 de bônus',
    descricao: 'Feita com ossos afiados, dentes de feras e ligada aos espíritos da selvageria pura de Arton.',
    detalhes: 'Causa +2 pontos de dano adicionais. Se o usuário estiver em estado de Fúria (ou sob efeitos similares de ferocidade), o bônus de dano aumenta para +4.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'poder_celebre',
    nome: 'Célebre',
    tipo: 'Armas Mágicas',
    subtipo: 'Poder Especial de Arma ou Escudo',
    bonusEquivalente: '+2 de bônus',
    descricao: 'Item gravado com brasões faustosos e auras de magnetismo pessoal que realçam a presença do portador.',
    detalhes: 'Concede ao portador bônus de +2 em todos os testes baseados em Carisma (como Diplomacia, Atuação e Enganação) e aumenta a CD de todas as suas magias de Encantamento ou Ilusão em +1.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'poder_perseveranca',
    nome: 'Perseverança',
    tipo: 'Armas Mágicas',
    subtipo: 'Poder Especial de Armadura ou Escudo',
    bonusEquivalente: '+1 de bônus',
    descricao: 'A armadura ou escudo irradia uma barreira protetora constante contra feitiços hostis.',
    detalhes: 'O usuário recebe um bônus de +2 em todos os testes de resistência contra magias e habilidades similares a magia.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'poder_portal',
    nome: 'Portal',
    tipo: 'Armas Mágicas',
    subtipo: 'Poder Especial de Arma ou Escudo',
    bonusEquivalente: '+3 de bônus',
    descricao: 'Permite dobrar o espaço físico ao redor da lâmina ou do escudo para saltar através de fendas dimensionais.',
    detalhes: 'Uma vez por dia como uma ação de movimento, o usuário pode se teletransportar instantaneamente para qualquer espaço visível a até 9 metros, sem provocar ataques de oportunidade.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'poder_tufao',
    nome: 'Tufão',
    tipo: 'Armas Mágicas',
    subtipo: 'Poder Especial de Arma Corpo a Corpo',
    bonusEquivalente: '+2 de bônus',
    descricao: 'A arma é envolvida por um vórtice contínuo de ar pressurizado que uiva durante os golpes.',
    detalhes: 'Ao confirmar um acerto crítico, uma rajada de vento com força ciclônica é liberada: todos os oponentes adjacentes ao alvo original devem ser bem-sucedidos em um teste de Fortitude (CD 10 + metade do nível do portador + mod. Força) ou serão derrubados.',
    livroFonte: 'Manual do Arcano'
  }
];

let podAdicionados = 0;
for (const p of novosPoderes) {
  const idx = armasMagicas.findIndex(a => a.id === p.id);
  if (idx >= 0) {
    armasMagicas[idx] = p;
  } else {
    armasMagicas.push(p);
    podAdicionados++;
  }
}
fs.writeFileSync(armasMagicasFilePath, JSON.stringify(armasMagicas, null, 2), 'utf8');
console.log(`Armas e Armaduras Mágicas: ${podAdicionados} poderes inseridos. Total: ${armasMagicas.length}`);

