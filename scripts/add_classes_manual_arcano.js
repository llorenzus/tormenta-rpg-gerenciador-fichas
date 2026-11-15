const fs = require('fs');
const path = require('path');

const classesFilePath = path.join(__dirname, '..', 'src', 'data', 'classes', 'classes.json');
const classes = JSON.parse(fs.readFileSync(classesFilePath, 'utf8'));

const novasClasses = [
  // --- MAGOS ESPECIALISTAS ---
  {
    id: 'mago_abjurador',
    nome: 'Mago: Abjurador (Especialista)',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mago especialista na escola de Abjuração. Mestres da proteção mágica, barreiras impenetráveis e anulação de feitiços inimigos.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Escola Especializada: Abjuração",
        descricao: "Você recebe 1 PM extra para cada nível de mago para lançar magias de Abjuração. Escolas Proibidas: Ilusão e Necromancia (ou Transmutação)."
      },
      {
        nivel: 1,
        nome: "Escudo Protetor",
        descricao: "Pode gastar 1 PM como reação para receber CA +2 contra um ataque iminente."
      },
      {
        nivel: 5,
        nome: "Resistência Arcana",
        descricao: "Recebe bônus de +2 em todos os testes de resistência contra magias e efeitos mágicos."
      },
      {
        nivel: 10,
        nome: "Mestre da Contramágica",
        descricao: "Pode anular magias inimigas como uma ação preparada gastando metade dos PM normais."
      },
      {
        nivel: 15,
        nome: "Barreira Impenetrável",
        descricao: "Suas magias de abjuração não podem ser dissipadas por conjuradores de nível inferior ao seu."
      },
      {
        nivel: 20,
        nome: "Invulnerabilidade Mística",
        descricao: "Uma vez por dia, ganha imunidade completa a qualquer dano ou magia por 1 rodada inteira."
      }
    ]
  },
  {
    id: 'mago_adivinho',
    nome: 'Mago: Adivinho (Especialista)',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Especialista em desvendar segredos passados, presentes e futuros, ler mentes e antever as ações dos oponentes.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Escola Especializada: Adivinhação",
        descricao: "Você recebe 1 PM extra por nível para lançar magias de Adivinhação. Possui apenas uma única Escola Proibida à sua escolha (exceto Adivinhação)."
      },
      {
        nivel: 1,
        nome: "Antevisão",
        descricao: "Soma seu modificador de Inteligência em iniciativa e não pode ser pego desprevenido."
      },
      {
        nivel: 5,
        nome: "Olho do Conjurador",
        descricao: "Recebe Visão no Escuro (ou dobra o alcance existente) e +4 em testes de Percepção."
      },
      {
        nivel: 10,
        nome: "Desvendar Fraqueza",
        descricao: "Como ação de movimento, estuda um alvo para conceder a você e aliados +2 nas jogadas de ataque contra ele."
      },
      {
        nivel: 15,
        nome: "Clarividência Instantânea",
        descricao: "Pode conjurar magias de adivinhação com tempo de execução padrão como ação livre (1/dia)."
      },
      {
        nivel: 20,
        nome: "Onisciência Tática",
        descricao: "Recebe bônus de esquiva de +4 na CA e em todos os testes de resistência pelo resto da vida."
      }
    ]
  },
  {
    id: 'mago_bruxo',
    nome: 'Mago: Bruxo (Variante)',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mago que pratica tradições arcanas rituais e ocultas com caldeirões, vassouras, bonecos e poções sinistras.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Foco Bruxo",
        descricao: "Usa um caldeirão, cajado de bruxo ou vassoura como foco de poder ritualístico."
      },
      {
        nivel: 1,
        nome: "Maldição Menor",
        descricao: "Como ação padrão e 1 PM, inflige -2 em testes de perícia ou ataque de um inimigo que falhe em Vontade."
      },
      {
        nivel: 5,
        nome: "Preparo Rápido de Poções",
        descricao: "Pode preparar poções na metade do tempo normal e com custo de TO reduzido em 25%."
      },
      {
        nivel: 10,
        nome: "Olho Mau",
        descricao: "Suas maldições impõem -4 em testes e causam 2d6 de dano de trevas a cada rodada."
      },
      {
        nivel: 15,
        nome: "Boneco de Cera",
        descricao: "Pode criar uma efígie de um inimigo conhecido para atingi-lo à distância com feitiços pessoais."
      },
      {
        nivel: 20,
        nome: "Mestre da Bruxaria",
        descricao: "Qualquer criatura amaldiçoada sofre penalidade dobrada e você absorve metade dos PM gastos pelo alvo."
      }
    ]
  },
  {
    id: 'mago_cronomante',
    nome: 'Mago: Cronomante (Variante)',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mago dos segredos temporais. Dobra o fluxo dos segundos para desacelerar oponentes ou agir com velocidade sobre-humana.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Aceleração Temporal Menor",
        descricao: "Gasta 2 PM para realizar uma ação de movimento adicional na rodada."
      },
      {
        nivel: 5,
        nome: "Retardar",
        descricao: "Gasta 3 PM para forçar um inimigo a realizar teste de Vontade; falha deixa o alvo sob efeito de Lentidão por 1d4 rodadas."
      },
      {
        nivel: 10,
        nome: "Eco Temporal",
        descricao: "Uma vez por dia, pode repetir uma jogada de ataque ou teste de resistência que acabou de falhar."
      },
      {
        nivel: 15,
        nome: "Salto Temporal",
        descricao: "Teleporta até 18m como ação livre após lançar uma magia temporal."
      },
      {
        nivel: 20,
        nome: "Parar o Tempo Supremo",
        descricao: "Pode conjurar Parar o Tempo gastando metade dos PM normais uma vez por descanso longo."
      }
    ]
  },
  {
    id: 'mago_encantador',
    nome: 'Mago: Encantador (Especialista)',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Manipulador das mentes, emoções e lealdades. Escolas Proibidas: Evocação e Necromancia.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Escola Especializada: Encantamento",
        descricao: "1 PM extra por nível para magias de Encantamento. Escolas Proibidas: Evocação e Necromancia."
      },
      {
        nivel: 1,
        nome: "Presença Cativante",
        descricao: "Adiciona seu modificador de Inteligência em Diplomacia, Enganação e Intimidação."
      },
      {
        nivel: 5,
        nome: "Fascinação Hipnótica",
        descricao: "Inimigos que sofrem suas magias de sono ou charme têm CD de teste aumentada em +2."
      },
      {
        nivel: 10,
        nome: "Mente Dominadora",
        descricao: "Criaturas encantadas por você realizam ações arriscadas sem direito a novo teste imediato de Vontade."
      },
      {
        nivel: 15,
        nome: "Manto da Amizade Falsa",
        descricao: "Criaturas inteligentes hesitam em atacá-lo; devem passar em Vontade para escolher você como alvo."
      },
      {
        nivel: 20,
        nome: "Mestre dos Títeres",
        descricao: "Pode manter até 2 alvos sob controle mental permanente simultaneamente sem concentração."
      }
    ]
  },
  {
    id: 'mago_evocador',
    nome: 'Mago: Evocador (Especialista)',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mestre do poder elemental bruto: fogo, raios, gelo e forças destrutivas que varrem campos de batalha inteiros.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Escola Especializada: Evocação",
        descricao: "1 PM extra por nível para magias de Evocação. Escolas Proibidas: Encantamento e Ilusão."
      },
      {
        nivel: 1,
        nome: "Energia Brutal",
        descricao: "Suas magias de dano de evocação causam +1 ponto de dano por dado rolado."
      },
      {
        nivel: 5,
        nome: "Molda Feitiço",
        descricao: "Pode excluir até seu modificador de Inteligência em quadrados/criaturas de áreas de efeito de suas magias."
      },
      {
        nivel: 10,
        nome: "Potência Concentrada",
        descricao: "Gasta 2 PM extras ao lançar uma evocação para maximizar metade dos dados de dano."
      },
      {
        nivel: 15,
        nome: "Penetração Elemental",
        descricao: "Suas magias de evocação ignoram até 10 pontos de resistência a energia de qualquer tipo."
      },
      {
        nivel: 20,
        nome: "Apocalipse Elemental",
        descricao: "Uma vez por dia, sua próxima evocação causa dano máximo automático sem custo extra de PM."
      }
    ]
  },
  {
    id: 'mago_geomante',
    nome: 'Mago: Geomante (Variante)',
    tipo: 'Basica',
    pvInicial: 10,
    pvPorNivel: 3,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mago que extrai magia telúrica da própria rocha, solo e montanhas, com resistência física acima da média dos arcanistas.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Sintonia com a Rocha",
        descricao: "Recebe +1 na CA e estabilidade (+4 em testes contra ser derrubado ou empurrado) em terreno natural rochoso."
      },
      {
        nivel: 5,
        nome: "Pele de Pedra Natural",
        descricao: "Ganha Redução de Dano 2/adamante permanente."
      },
      {
        nivel: 10,
        nome: "Sentido Sísmico",
        descricao: "Percebe vibrações e criaturas em contato com o solo em até 18 metros."
      },
      {
        nivel: 15,
        nome: "Fendas da Terra",
        descricao: "Suas magias que alteram a terra ou rocha dobram de área de efeito e causam dano extra de esmagamento."
      },
      {
        nivel: 20,
        nome: "Forma de Titã Telúrico",
        descricao: "Uma vez por dia, funde-se com rocha viva ganhando RD 10/adamante e bônus de +6 em Força por 1 hora."
      }
    ]
  },
  {
    id: 'mago_ilusionista',
    nome: 'Mago: Ilusionista (Especialista)',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Artífice da ilusão, decepção visual e sensorial. Escolas Proibidas: Abjuração e Evocação.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Escola Especializada: Ilusão",
        descricao: "1 PM extra por nível para magias de Ilusão. Escolas Proibidas: Abjuração e Evocação."
      },
      {
        nivel: 1,
        nome: "Duplo Fantasmagórico",
        descricao: "Como reação a um ataque recebido, projeta cópia ilusória causando 50% de chance de erro no atacante."
      },
      {
        nivel: 5,
        nome: "Ilusão Convincente",
        descricao: "Inimigos que tentam desacreditar de suas ilusões sofrem penalidade de -3 no teste de Vontade."
      },
      {
        nivel: 10,
        nome: "Sombra Semi-Real",
        descricao: "Suas ilusões de monstros ou ataques causam 20% do dano real mesmo se desacreditadas."
      },
      {
        nivel: 15,
        nome: "Invisibilidade Perfeita",
        descricao: "Seus efeitos de invisibilidade não são cancelados por testes de Percepção normais ou farejar."
      },
      {
        nivel: 20,
        nome: "Mundo de Fantasmas",
        descricao: "Pode reescrever a percepção visual de uma área de até 1km por até 24 horas."
      }
    ]
  },
  {
    id: 'mago_invocador',
    nome: 'Mago: Invocador (Especialista)',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mestre da convocação de criaturas astrais, elementais, demônios e teletransporte. Escolas Proibidas: Adivinhação e Transmutação.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Escola Especializada: Invocação",
        descricao: "1 PM extra por nível para magias de Invocação. Escolas Proibidas: Adivinhação e Transmutação."
      },
      {
        nivel: 1,
        nome: "Invocação Fortalecida",
        descricao: "Criaturas invocadas por você ganham +2 em testes de ataque e dano e +2 PV por dado de vida."
      },
      {
        nivel: 5,
        nome: "Teletransporte Tático",
        descricao: "Pode trocar de posição com uma criatura aliada ou convocada a até 9m como ação de movimento."
      },
      {
        nivel: 10,
        nome: "Convocação Rápida",
        descricao: "Magias de Invocar Monstro que exigem 1 rodada completa podem ser lançadas como ação padrão."
      },
      {
        nivel: 15,
        nome: "Vínculo Astral Duradouro",
        descricao: "A duração das criaturas invocadas por você é dobrada sem custo adicional de PM."
      },
      {
        nivel: 20,
        nome: "Exército Dimensional",
        descricao: "Pode manter dois grupos de criaturas convocadas ativas no campo simultaneamente."
      }
    ]
  },
  {
    id: 'mago_necromante',
    nome: 'Mago: Necromante (Especialista)',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Estudioso da fronteira entre a vida e a morte, mestre de energias negativas, maldições de definhamento e mortos-vivos.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Escola Especializada: Necromancia",
        descricao: "1 PM extra por nível para magias de Necromancia. Escolas Proibidas: Abjuração e Encantamento."
      },
      {
        nivel: 1,
        nome: "Toque Macabro",
        descricao: "Ataque de toque que causa 1d6 de dano de trevas e cura você em metade do valor causado (1/combate)."
      },
      {
        nivel: 5,
        nome: "Lorde dos Cadáveres",
        descricao: "O limite de dados de vida de mortos-vivos sob seu comando aumenta em +2 por nível de mago."
      },
      {
        nivel: 10,
        nome: "Resistência à Morte",
        descricao: "Ganha imunidade a efeitos de dreno de energia e resistência a trevas 10."
      },
      {
        nivel: 15,
        nome: "Animação Efêmera",
        descricao: "Como ação padrão, reanima temporariamente um cadáver inimigo derrotado por 1 minuto sem custo de material."
      },
      {
        nivel: 20,
        nome: "Comandante da Morte Eterna",
        descricao: "Mortos-vivos criados por você ganham bônus profano de +4 em Força, Destreza e CA."
      }
    ]
  },
  {
    id: 'mago_transmutador',
    nome: 'Mago: Transmutador (Especialista)',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 13. Mago de 1º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mago que domina a mudança física, a metamorfose corporal e a alteração da matéria física.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Escola Especializada: Transmutação",
        descricao: "1 PM extra por nível para magias de Transmutação. Escolas Proibidas: Adivinhação e Invocação."
      },
      {
        nivel: 1,
        nome: "Alterar Propriedade",
        descricao: "Pode mudar temporariamente a rigidez, peso ou forma de um objeto inanimado por 10 minutos."
      },
      {
        nivel: 5,
        nome: "Metamorfose Adaptativa",
        descricao: "Ao assumir outra forma, ganha +2 em jogadas de ataque e bônus de deslocamento de +3m."
      },
      {
        nivel: 10,
        nome: "Corpo Maleável",
        descricao: "Recebe Redução de Dano 5/perfurante ou cortante (à sua escolha no início do dia)."
      },
      {
        nivel: 15,
        nome: "Transmutação Permanente",
        descricao: "Pode tornar permanentes certas alterações de materiais simples com custo de XP reduzido em 50%."
      },
      {
        nivel: 20,
        nome: "Mestre da Forma Pura",
        descricao: "Pode usar Metamorfose à vontade em si mesmo como ação de movimento."
      }
    ]
  },

  // --- LINHAGENS DE FEITICEIRO ---
  {
    id: 'feiticeiro_linhagem_caotica',
    nome: 'Feiticeiro: Linhagem Caótica',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Carisma 13. Tendência não Leal.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Feiticeiro cujo sangue ferve com a instabilidade do Caos elemental e planar.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Herança do Caos",
        descricao: "Uma vez por dia, pode rerrolar qualquer dado com resultado 1 natural."
      },
      {
        nivel: 5,
        nome: "Sorte Inconstante",
        descricao: "No início de cada dia, role 1d6: 1-2 recebe +1 na CA, 3-4 recebe +1 em ataques, 5-6 recebe +2 em resistências."
      },
      {
        nivel: 10,
        nome: "Corpo Imprevisível",
        descricao: "Garante 20% de chance de camuflagem permanente contra ataques à distância e corpo a corpo."
      },
      {
        nivel: 15,
        nome: "Ruptura da Realidade",
        descricao: "Suas magias ignoram imunidades elementais de criaturas ordeiras ou neutras."
      },
      {
        nivel: 20,
        nome: "Entropia Total",
        descricao: "Ao lançar uma magia, pode escolher 1 alvo para forçar 2 testes de resistência e usar o pior resultado."
      }
    ]
  },
  {
    id: 'feiticeiro_linhagem_celestial',
    nome: 'Feiticeiro: Linhagem Celestial',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Carisma 13. Tendência não Maligna.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Descendente de anjos, arcontes e seres dos reinos de luz e bondade.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Sangue Sagrado",
        descricao: "Pode lançar Curar Ferimentos Leves gastando PM mesmo sendo feiticeiro arcano."
      },
      {
        nivel: 5,
        nome: "Asas Astrais",
        descricao: "Manifesta asas luminescentes concedendo deslocamento de voo 12m por até 10 rodadas ao custo de 2 PM."
      },
      {
        nivel: 10,
        nome: "Aura de Retidão",
        descricao: "Gera aura de luz de 6m; aliados na área recebem +2 em testes contra medo e efeitos de trevas."
      },
      {
        nivel: 15,
        nome: "Luz Purificadora",
        descricao: "Suas magias causam 50% de dano adicional contra mortos-vivos e criaturas malignas."
      },
      {
        nivel: 20,
        nome: "Forma Angelical",
        descricao: "Ganha asas permanentes, redução de dano 10/mal e imunidade a ácido, frio e petrificação."
      }
    ]
  },
  {
    id: 'feiticeiro_linhagem_demoniaca',
    nome: 'Feiticeiro: Linhagem Demoníaca',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Carisma 13. Tendência não Bondosa.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Descendente do Abismo voraz. Sangue carregado de fúria corrupta e destruição sanguinária.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Garras Abissais",
        descricao: "Pode manifestar garras retráteis que causam 1d6 de dano perfurante/cortante como armas naturais leves."
      },
      {
        nivel: 5,
        nome: "Pele Demoníaca",
        descricao: "Ganha resistência a fogo 5 e bônus de armadura natural de +2 na CA."
      },
      {
        nivel: 10,
        nome: "Chama do Abismo",
        descricao: "Seu dano de fogo e ácido converte metade do valor em dano profano irresistível."
      },
      {
        nivel: 15,
        nome: "Resistência Ímpia",
        descricao: "Recebe RD 5/bem ou ferro frio e resistência a fogo aumentada para 15."
      },
      {
        nivel: 20,
        nome: "Lorde Demoníaco",
        descricao: "Assume traços de demônio puro: imunidade a venenos e eletricidade, e presença aterradora (CD Vontade 20)."
      }
    ]
  },
  {
    id: 'feiticeiro_linhagem_diabolica',
    nome: 'Feiticeiro: Linhagem Diabólica',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Carisma 13. Tendência não Caótica.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Herdeiro dos nove círculos infernais, mestre de contratos ardilosos, intrigas e coerção.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Língua Serpentina",
        descricao: "Recebe +4 em testes de Enganação e Intimidação ao fazer pactos e acordos."
      },
      {
        nivel: 5,
        nome: "Chamas Infernais",
        descricao: "Gasta 2 PM para imbuir suas magias ofensivas com fogo do inferno (+2d6 de dano de fogo profano)."
      },
      {
        nivel: 10,
        nome: "Olhar do Enganador",
        descricao: "Detecta pensamentos superficiais e intenções hostis de qualquer criatura que conversar com você."
      },
      {
        nivel: 15,
        nome: "Contrato Forçado",
        descricao: "Pode forçar um alvo sob efeito de Encantamento a aceitar uma condição estrita como se fosse Missão Sagrada/Profana."
      },
      {
        nivel: 20,
        nome: "Tirano dos Infernos",
        descricao: "Imunidade a fogo e venenos, resistência a magia +4 e comando sobre diabos menores."
      }
    ]
  },
  {
    id: 'feiticeiro_linhagem_feerica',
    nome: 'Feiticeiro: Linhagem Feérica',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Carisma 13.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Tocado pela magia primordial do Reino das Fadas, leveza mística, riso encantador e mistérios silvestres.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Graça das Fadas",
        descricao: "Soma modificador de Carisma em iniciativa e recebe +2 em testes de Adestrar Animais e Diplomacia."
      },
      {
        nivel: 5,
        nome: "Voo Silfídeo",
        descricao: "Gasta 2 PM para levitar e planar livremente por 10 minutos (deslocamento 9m)."
      },
      {
        nivel: 10,
        nome: "Confusão Feérica",
        descricao: "Suas magias de ilusão e encantamento ignoram imunidades a sono ou charme comuns."
      },
      {
        nivel: 15,
        nome: "Dança Ilusória",
        descricao: "Ao ser atacado, pode se teletransportar 6m como reação e deixar ilusão cintilante no lugar."
      },
      {
        nivel: 20,
        nome: "Senhor do Primeiro Mundo",
        descricao: "Ganha RD 10/ferro frio, deslocamento de voo 18m permanente e imunidade total a encantamentos."
      }
    ]
  },
  {
    id: 'feiticeiro_linhagem_ofidica',
    nome: 'Feiticeiro: Linhagem Ofídica',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Carisma 13.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Sangue ancestral ligado aos grandes répteis venenosos e deuses-serpente.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Presas Venenosas",
        descricao: "Ataque de mordida natural (1d4 + veneno que causa 1d6 de dano de Constituição se falhar em Fortitude CD 10 + 1/2 nível + Carisma)."
      },
      {
        nivel: 5,
        nome: "Olhar Hipnótico",
        descricao: "Como ação padrão gasta 2 PM para fascinar uma criatura a até 9m com seu olhar imóvel."
      },
      {
        nivel: 10,
        nome: "Corpo Serpentino",
        descricao: "Recebe +4 em testes de Furtividade e Acrobacia, e bônus de armadura de escamas +2 na CA."
      },
      {
        nivel: 15,
        nome: "Imunidade a Peçonhas",
        descricao: "Imunidade absoluta a qualquer tipo de veneno natural, mágico ou alquímico."
      },
      {
        nivel: 20,
        nome: "A Grande Serpente",
        descricao: "Pode se transformar em uma cobra gigante monstruosa à vontade, ganhando bônus de Força +8 e veneno letal."
      }
    ]
  },
  {
    id: 'feiticeiro_linhagem_ordeira',
    nome: 'Feiticeiro: Linhagem Ordeira',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Carisma 13. Tendência não Caótica.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Conexão com a harmonia e perfeição geométrica dos planos leais e da Grande Ordem cósmica.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Mente Metódica",
        descricao: "Pode escolher 10 em testes de qualquer perícia treinada mesmo sob pressão e perigo imediato (3/dia)."
      },
      {
        nivel: 5,
        nome: "Axioma Puro",
        descricao: "Suas magias causam dano pleno (sem rolagem, usando média arredondada para cima) se você desejar."
      },
      {
        nivel: 10,
        nome: "Julgamento Inflexível",
        descricao: "Recebe +3 em testes de resistência contra magias e habilidades usadas por criaturas caóticas."
      },
      {
        nivel: 15,
        nome: "Barreira da Ordem",
        descricao: "Cria campo de 6m ao seu redor que anula efeitos de sorte, azar ou caos por 5 rodadas."
      },
      {
        nivel: 20,
        nome: "Perfeição Absoluta",
        descricao: "Ganha imunidade a atordoamento, confusão e sono, e bônus de +4 em todas as salvaguardas."
      }
    ]
  },
  {
    id: 'feiticeiro_linhagem_primordial',
    nome: 'Feiticeiro: Linhagem Primordial',
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Carisma 13.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Descendente direto das energias elementais primordiais da criação do universo.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Afinidade Elemental",
        descricao: "Escolha um elemento (Água/Frio, Fogo, Terra/Ácido ou Ar/Eletricidade). Suas magias desse tipo causam +1 de dano por dado."
      },
      {
        nivel: 5,
        nome: "Resistência Primordial",
        descricao: "Ganha resistência 10 contra o tipo de energia escolhido na afinidade elemental."
      },
      {
        nivel: 10,
        nome: "Pulso Elemental",
        descricao: "Gasta 3 PM como ação de movimento para liberar uma onda de 6m de raio causando 4d6 do seu elemento."
      },
      {
        nivel: 15,
        nome: "Transcendência Elemental",
        descricao: "Pode transmutar qualquer magia de dano arcano para o tipo do seu elemento primordial."
      },
      {
        nivel: 20,
        nome: "Encarnação Elemental",
        descricao: "Imunidade completa ao seu elemento escolhido e deslocamento de voo/escavação/natação de 18m."
      }
    ]
  },

  // --- CLASSES DE PRESTÍGIO DO MANUAL DO ARCANO ---
  {
    id: 'amador_farsante',
    nome: 'Amador Farsante',
    tipo: 'Prestigio',
    pvInicial: 12,
    pvPorNivel: 3,
    pmPorNivel: 3,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Enganação 8 graduações, Ladinagem 8 graduações, capacidade de lançar magias arcanas de 1º nível, talento Blefe Arcano ou Trapaça Ágil.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Trapaceiro místico que finge poderes miraculosos, ilude testemunhas e ludibria até os conjuradores mais sábios com truques arcanos ousados.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Farsa Mágica",
        descricao: "Ao usar Enganação para fingir conjurar magias que não possui, recebe +4 no teste e pode imitar efeitos visuais convincentes."
      },
      {
        nivel: 2,
        nome: "Magia Roubada",
        descricao: "Ao observar um oponente conjurar magia até 3º nível, pode gastar PM correspondentes para conjurá-la no próximo turno."
      },
      {
        nivel: 3,
        nome: "Fuga Dramática",
        descricao: "Ao sofrer dano letal, pode gastar 3 PM para se teleportar 9m deixando uma fumaça ilusória dramática no local."
      },
      {
        nivel: 4,
        nome: "Trapaça dos Sentidos",
        descricao: "Suas ilusões afetam o tato e o olfato dos alvos mesmo sem componentes avançados."
      },
      {
        nivel: 5,
        nome: "O Maior Espetáculo",
        descricao: "Pode iludir uma multidão inteira forçando teste de Vontade contra Enganação para deixá-los fascinados."
      }
    ]
  },
  {
    id: 'arcano_da_torre',
    nome: 'Arcano da Torre',
    tipo: 'Prestigio',
    pvInicial: 10,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Conhecimento (arcano) 10 graduações, Identificar Magia 10 graduações, capacidade de lançar magias arcanas de 3º nível, membro da Grande Academia Arcana.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mestre da alta erudição acadêmica de Wynlla, detentor dos tomos arcanos mais raros e das fórmulas de poder mais refinadas de Arton.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Acesso aos Tomos Supremos",
        descricao: "Adiciona 2 magias adicionais de qualquer círculo que possa lançar ao seu grimório sem custo de tempo ou TO."
      },
      {
        nivel: 2,
        nome: "Economia de Mana Acadêmica",
        descricao: "Uma vez por dia para cada nível nesta classe, reduz o custo de uma magia lançada em 1 PM (mínimo 1)."
      },
      {
        nivel: 3,
        nome: "Teoria Mágica Avançada",
        descricao: "A CD de todas as suas magias arcanas aumenta em +1."
      },
      {
        nivel: 4,
        nome: "Canalização de Torre",
        descricao: "Gasta 2 PM para aumentar o alcance de uma magia em uma categoria (Curto -> Médio -> Longo)."
      },
      {
        nivel: 5,
        nome: "Cátedra Arcana",
        descricao: "Pode preparar ou memorizar uma magia extra do seu círculo mais alto disponível."
      }
    ]
  },
  {
    id: 'genio_do_mal',
    nome: 'Gênio do Mal',
    tipo: 'Prestigio',
    pvInicial: 10,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Inteligência 15, Tendência Maligna ou Neutra, Conhecimento (engenharia ou arcano) 8 graduações, capacidade de lançar magias de 2º nível.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mente brilhante e implacável que arquiteta planos mirabolantes de conquista, armadilhas mortais e construtos mecânico-mágicos.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Plano Maquiavélico",
        descricao: "Ao planejar com antecedência um encontro, concede +2 em jogadas de ataque e dano a todos os seus capangas e lacaios."
      },
      {
        nivel: 2,
        nome: "Armadilha Mirabolante",
        descricao: "Pode preparar armadilhas mágicas em metade do tempo com CD de percepção aumentada em +3."
      },
      {
        nivel: 3,
        nome: "Discurso Vilanesco",
        descricao: "Uma vez por combate, desfere um monólogo intimidante: oponentes que ouvem ficam abalados (Vontade anula)."
      },
      {
        nivel: 4,
        nome: "Fuga de Mestre",
        descricao: "Recebe bônus de +4 na CA e em testes de resistência quando estiver em retirada ou fugindo de um combate."
      },
      {
        nivel: 5,
        nome: "Engenho da Destruição",
        descricao: "Cria um dispositivo mágico-mecânico mortal ou autômato lacaio sob seu controle inquestionável."
      }
    ]
  },
  {
    id: 'guerreiro_magico',
    nome: 'Guerreiro Mágico',
    tipo: 'Prestigio',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 2,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +4, capacidade de lançar magias arcanas de 1º nível, Usar Armas Marciais, Especialização em Combate ou Foco em Arma.",
    proficiencias: "Todas as armas simples e marciais, todas as armaduras e escudos.",
    descricao: "Guerreiro que fundiu o domínio da espada com fórmulas arcanas, desferindo golpes embebidos com chamas, relâmpagos e feitiços concentrados.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Golpe Mágico",
        descricao: "Como ação padrão, pode desferir um ataque corpo a corpo e descarregar uma magia de toque através da arma caso acerte."
      },
      {
        nivel: 2,
        nome: "Armadura Arcana Fluida",
        descricao: "A chance de falha de magia arcana por usar armaduras leves e médias é reduzida a 0%."
      },
      {
        nivel: 3,
        nome: "Canalizar Poder Marcial",
        descricao: "Gasta 2 PM para imbuir sua arma com bônus de +2 no ataque e dano durante 1 minuto."
      },
      {
        nivel: 4,
        nome: "Defesa Protetora Reativa",
        descricao: "Ao receber um acerto, pode gastar 2 PM como reação para ganhar CA +3 contra aquele ataque."
      },
      {
        nivel: 5,
        nome: "Tempestade de Lâmina e Feitiço",
        descricao: "Ao realizar uma ação de Ataque Total, pode conjurar uma magia de ação padrão como ação livre gastando 3 PM adicionais."
      }
    ]
  },
  {
    id: 'inquisidor_de_wynna',
    nome: 'Inquisidor de Wynna',
    tipo: 'Prestigio',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 3,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Devoto de Wynna, capacidade de lançar magias arcanas ou divinas de 2º nível, Conhecimento (religião ou arcano) 8 graduações, Identificar Magia 8 graduações.",
    proficiencias: "Armas marciais, armaduras leves e médias.",
    descricao: "Agente sagrado da Deusa da Magia encarregado de caçar magos corruptos, usuários da Tormenta e conjuradores que profanam o dom místico.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Detecção da Profanação Arcana",
        descricao: "Detecta auras mágicas e corrupção lefeu constantemente como uma ação livre."
      },
      {
        nivel: 2,
        nome: "Julgamento do Conjurador",
        descricao: "Recebe +2 em jogadas de ataque, dano e testes de resistência contra qualquer criatura capaz de lançar magias arcanas."
      },
      {
        nivel: 3,
        nome: "Silêncio Purificador",
        descricao: "Gasta 2 PM ao atingir um alvo para forçá-lo a fazer teste de Vontade; falha impede o alvo de conjurar magias por 1 rodada."
      },
      {
        nivel: 4,
        nome: "Dissipação Devastadora",
        descricao: "Ao dissipar uma magia com sucesso, causa 1d6 de dano de energia pura por círculo da magia anulada no conjurador inimigo."
      },
      {
        nivel: 5,
        nome: "Veredito de Wynna",
        descricao: "Cria campo de 9m ao seu redor onde nenhuma magia de necromancia ou feitiço profano pode ser conjurado."
      }
    ]
  },
  {
    id: 'magi_ranger',
    nome: 'Magi-Ranger',
    tipo: 'Prestigio',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 3,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, Sobrevivência 8 graduações, Conhecimento (natureza) 8 graduações, capacidade de lançar magias de 1º nível, talento Rastrear.",
    proficiencias: "Armas marciais, armaduras leves e escudos.",
    descricao: "Rastreador selvagem que aprendeu a canalizar os fluxos arcanos da terra virgem, rastreando auras arcanas e imbuindo suas flechas com poder místico.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Disparo Feitiço",
        descricao: "Pode imbuir uma flecha ou projétil disparado com uma magia de toque ou área conhecida."
      },
      {
        nivel: 2,
        nome: "Rastreio Arcano",
        descricao: "Pode usar Sobrevivência para seguir rastros de resíduos arcanos e criaturas mágicas mesmo sobre rochas ou água."
      },
      {
        nivel: 3,
        nome: "Companheiro Místico",
        descricao: "Seu companheiro animal ganha resistência a magia +2 e ataques considerados mágicos para superar RD."
      },
      {
        nivel: 4,
        nome: "Camuflagem Mística",
        descricao: "Gasta 2 PM para receber invisibilidade enquanto estiver em terreno natural por 10 minutos."
      },
      {
        nivel: 5,
        nome: "Chuva de Feitiços",
        descricao: "Dispara uma saraivada mágica: um ataque à distância contra todos os inimigos em um cone de 9m com flechas energizadas."
      }
    ]
  },
  {
    id: 'professor_de_magia',
    nome: 'Professor de Magia',
    tipo: 'Prestigio',
    pvInicial: 10,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (médio/baixo)",
    preRequisitos: "Conhecimento (arcano) 10 graduações, Diplomacia 8 graduações, capacidade de lançar magias arcanas de 3º nível, talento Mestre em Perícia (Conhecimento arcano).",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mestre pedagógico que instrui novos aprendizes arcanos, capaz de amplificar os feitiços de seus aliados e desarmar erros em pleno combate.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Instrução Tática",
        descricao: "Como ação de movimento, instrui um aliado conjurador; a próxima magia dele recebe +2 na CD ou +2 no teste de resistência."
      },
      {
        nivel: 2,
        nome: "Correção de Postura Arcana",
        descricao: "Quando um aliado a até 9m falha num teste de concentração ou resistir a magia, você pode permitir que ele rerrole o teste."
      },
      {
        nivel: 3,
        nome: "Compartilhar Grimório",
        descricao: "Aliados preparados ao seu lado podem preparar 1 magia do seu grimório como se fizesse parte da lista deles."
      },
      {
        nivel: 4,
        nome: "Leitura de Campo",
        descricao: "Identifica instantaneamente qualquer magia lançada por inimigos sem necessidade de teste de perícia."
      },
      {
        nivel: 5,
        nome: "Aula Magna",
        descricao: "Gasta 4 PM: todos os aliados conjuradores a até 9m recuperam 2 PM e recebem +2 em CD de magias por 1 minuto."
      }
    ]
  },
  {
    id: 'racionalista',
    nome: 'Racionalista',
    tipo: 'Prestigio',
    pvInicial: 14,
    pvPorNivel: 3,
    pmPorNivel: 0,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Inteligência 15, Conhecimento (qualquer dois) 8 graduações, não possuir capacidade de lançar magias arcanas ou divinas espontâneas ou devotas.",
    proficiencias: "Armas simples, armaduras leves e médias.",
    descricao: "Cético intransigente que não aceita o misticismo e as mentiras mágicas, demonstrando que a razão, a ciência e a física anulam feitiços arcanos.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Desdém Científico",
        descricao: "Recebe bônus em testes de resistência contra magias igual ao seu modificador de Inteligência."
      },
      {
        nivel: 2,
        nome: "Análise Lógica de Feitiços",
        descricao: "Ao ver uma ilusão ou efeito mágico, faz teste de Intuição ou Conhecimento para dissipar a ilusão para todos os aliados."
      },
      {
        nivel: 3,
        nome: "Ruptura Racional",
        descricao: "Ao acertar um conjurador, força teste de Concentração com CD aumentada em +5 para não perder a magia em preparo."
      },
      {
        nivel: 4,
        nome: "Zona Livre de Misticismo",
        descricao: "Gera campo de 3m ao seu redor com 25% de chance de anular qualquer magia que cruze a área."
      },
      {
        nivel: 5,
        nome: "Triunfo da Razão",
        descricao: "Ganha imunidade total a magias das escolas de Encantamento e Ilusão, e resistência a dano mágico 10."
      }
    ]
  },
  {
    id: 'renegado_tribal',
    nome: 'Renegado Tribal',
    tipo: 'Prestigio',
    pvInicial: 18,
    pvPorNivel: 5,
    pmPorNivel: 2,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, Sobrevivência 8 graduações, Fúria ou Fúria Bárbara 1/dia, capacidade de lançar magias de 1º nível.",
    proficiencias: "Armas marciais, todas as armaduras e escudos.",
    descricao: "Guerreiro banido de tribos selvagens por sua herança arcana, que mistura a fúria sangrenta primitiva com feitiçarias ancestrais cruas.",
    livroFonte: "Manual do Arcano",
    habilidades: [
      {
        nivel: 1,
        nome: "Fúria Arcana",
        descricao: "Ao entrar em Fúria, pode conjurar magias arcanas mesmo com a mente inflamada pela selvageria."
      },
      {
        nivel: 2,
        nome: "Tatuagens Protetoras Ancestrais",
        descricao: "Recebe bônus de armadura natural de +2 na CA e RD 2/– que acumula com a redução de bárbaro."
      },
      {
        nivel: 3,
        nome: "Canalizar Fúria no Feitiço",
        descricao: "Enquanto em fúria, suas magias de dano causam dano adicional igual ao seu bônus de Fúria no ataque (+2 ou mais)."
      },
      {
        nivel: 4,
        nome: "Resistência Selvagem à Magia",
        descricao: "Ganha bônus de +3 em testes de Fortitude e Vontade contra efeitos de conjuradores civilizados."
      },
      {
        nivel: 5,
        nome: "Cataclismo Primitivo",
        descricao: "Pode encerrar a Fúria para liberar explosão mística centrada em si causando 6d8 de dano em área (Reflexos metade, aliados excluídos)."
      }
    ]
  }
];

let adicionados = 0;
for (const nc of novasClasses) {
  const index = classes.findIndex(c => c.id === nc.id);
  if (index >= 0) {
    classes[index] = nc;
    console.log(`Atualizada classe existente: ${nc.nome}`);
  } else {
    classes.push(nc);
    adicionados++;
    console.log(`Adicionada nova classe: ${nc.nome}`);
  }
}

fs.writeFileSync(classesFilePath, JSON.stringify(classes, null, 2), 'utf8');
console.log(`Sucesso: ${adicionados} novas classes inseridas no classes.json. Total agora: ${classes.length}`);

