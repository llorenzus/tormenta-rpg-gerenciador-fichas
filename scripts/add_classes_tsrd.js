const fs = require('fs');
const path = require('path');

const classesFilePath = path.join(__dirname, '..', 'src', 'data', 'classes', 'classes.json');
const classes = JSON.parse(fs.readFileSync(classesFilePath, 'utf8'));

const novasClasses = [
  // --- CLASSES BÁSICAS OFICIAIS FALTANTES ---
  {
    id: 'nobre',
    nome: 'Nobre',
    tipo: 'Basica',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 3,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Nenhum.",
    proficiencias: "Armas simples e marciais, todas as armaduras e escudos.",
    descricao: "Líder carismático, aristocrata ou governante que utiliza sua riqueza, presença magnética e autoridade incontestável para inspirar aliados e subjugar adversários.",
    livroFonte: "Manual do Malandro / Tormenta RPG",
    habilidades: [
      {
        nivel: 1,
        nome: "Autoconfiança",
        descricao: "Você soma seu modificador de Carisma na sua Classe de Armadura (limitado pelo seu nível de nobre, bônus mínimo +1)."
      },
      {
        nivel: 1,
        nome: "Frivolidade",
        descricao: "Pode escolher qualquer perícia adicional para se tornar uma perícia de classe treinada."
      },
      {
        nivel: 1,
        nome: "Herança",
        descricao: "Começa o jogo com um item especial (mundano ou mágico) com preço de mercado de até 2.000 TO."
      },
      {
        nivel: 2,
        nome: "Comandar",
        descricao: "Como ação de movimento, emite ordem tática a um aliado a até 9m, concedendo +2 em sua próxima jogada de ataque ou teste de perícia."
      },
      {
        nivel: 5,
        nome: "Presença Aristocrática",
        descricao: "Inimigos que tentem atacá-lo devem realizar um teste de Vontade (CD 10 + 1/2 nível + mod. Car); falha impede a hostilidade contra você por 1 rodada."
      },
      {
        nivel: 10,
        nome: "Riqueza Abundante",
        descricao: "Recebe 1.000 TO adicionais por nível a cada aventura e pode adquirir itens com 20% de desconto."
      },
      {
        nivel: 20,
        nome: "Majestade Imperial",
        descricao: "Uma vez por dia como ação padrão, todos os inimigos a até 18m que ouvirem sua voz devem se ajoelhar e render-se (Vontade anula)."
      }
    ]
  },
  {
    id: 'shair',
    nome: "Sha'ir",
    tipo: 'Basica',
    pvInicial: 8,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (baixo)",
    preRequisitos: "Inteligência 13.",
    proficiencias: "Armas simples, nenhuma armadura ou escudo.",
    descricao: "Conjurador místico de inspiração tamuriana e dos desertos de Arton que canaliza magias através de um Gen, um espírito elemental miniatura mensageiro do cosmos.",
    livroFonte: "Manual do Arcano / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Invocar Gen",
        descricao: "Convoca um pequeno espírito elemental (Água, Ar, Fogo, Luz, Terra ou Trevas) que busca magias no plano elemental e comunica-se telepaticamente."
      },
      {
        nivel: 1,
        nome: "Obter Magias",
        descricao: "Não possui grimório fixo; envia seu Gen para buscar qualquer magia desejada no cosmos através de um teste de Obter Magias (1d20 + nível de sha'ir contra CD 10 + nível da magia)."
      },
      {
        nivel: 1,
        nome: "Proteção Elemental",
        descricao: "Recebe bônus de +2 em testes de resistência contra efeitos e magias ligados ao elemento de seu Gen."
      },
      {
        nivel: 5,
        nome: "Viagem do Gen",
        descricao: "O Gen pode atravessar fendas planares trazendo magias de círculos superiores com tempo de busca reduzido pela metade."
      },
      {
        nivel: 10,
        nome: "Comunhão Elemental",
        descricao: "Ganha imunidade ao elemento associado ao seu Gen e pode falar com todas as criaturas elementais."
      },
      {
        nivel: 20,
        nome: "Mestre dos Gênios",
        descricao: "Pode convocar um Nobre Djinn ou Efreeti verdadeiro para conceder 3 desejos uma vez por mês."
      }
    ]
  },
  {
    id: 'ninja',
    nome: 'Ninja',
    tipo: 'Basica',
    pvInicial: 12,
    pvPorNivel: 3,
    pmPorNivel: 3,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Nenhum.",
    proficiencias: "Armas simples, espada curta, shuriken, zarabatana, nenhuma armadura.",
    descricao: "Agente secreto e espião de Tamu-ra mestre das sombras, do disfarce, de venenos letais e de jutsus arcanos silenciosos.",
    livroFonte: "Império de Jade / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Ataque Furtivo (+1d6)",
        descricao: "Causa +1d6 de dano contra oponentes desprevenidos ou flanqueados (aumenta a cada 2 níveis)."
      },
      {
        nivel: 1,
        nome: "Dança das Sombras",
        descricao: "Soma modificador de Inteligência ou Sabedoria na Classe de Armadura quando sem armadura."
      },
      {
        nivel: 1,
        nome: "Uso de Venenos",
        descricao: "Pode aplicar venenos em armas sem risco de se envenenar acidentalmente."
      },
      {
        nivel: 2,
        nome: "Passo Fantasma",
        descricao: "Gasta 1 PM para ficar invisível como ação de movimento até o fim da rodada."
      },
      {
        nivel: 3,
        nome: "Evasão",
        descricao: "Se passar em teste de Reflexos contra efeito de metade do dano, não sofre dano algum."
      },
      {
        nivel: 5,
        nome: "Truques Ninja (Jutsus)",
        descricao: "Aprende técnicas ninjas como Salto das Sombras, Substituição de Tronco e Névoa Cegante."
      },
      {
        nivel: 20,
        nome: "Mestre Invisível",
        descricao: "Pode se manter sob invisibilidade contínua mesmo atacando ou lançando técnicas ofensivas."
      }
    ]
  },

  // --- VARIANTES DO MANUAL DO MALANDRO ---
  {
    id: 'bardo_menestreis',
    nome: 'Bardo: Colégio dos Menestréis',
    tipo: 'Basica',
    pvInicial: 12,
    pvPorNivel: 3,
    pmPorNivel: 3,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Carisma 13.",
    proficiencias: "Armas simples, armaduras leves.",
    descricao: "Bardo dedicado às baladas nobres, poemas épicos e à transmissão de lendas antigas que inspiram corações em batalha.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Música de Menestrel",
        descricao: "Sua Música de Bardo de Inspirar Coragem concede bônus adicional de +1 no ataque e testes de resistência de aliados."
      },
      {
        nivel: 5,
        nome: "Canção da Esperança",
        descricao: "Cura 1d8 + mod. Car de dano de todos os aliados a até 9m durante a performance."
      },
      {
        nivel: 10,
        nome: "Hino da Vitória",
        descricao: "Aliados sob sua canção são imunes a medo e ganham 1 ação de movimento adicional por combate."
      }
    ]
  },
  {
    id: 'bardo_arcanitas',
    nome: 'Bardo: Colégio dos Arcanitas',
    tipo: 'Basica',
    pvInicial: 10,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (baixo)",
    preRequisitos: "Carisma 13, Inteligência 13.",
    proficiencias: "Armas simples, nenhuma armadura.",
    descricao: "Bardo focado na erudição arcana e fórmulas de feitiços complexos, aproximando a canção da alta magia.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Fórmula Melódica",
        descricao: "Pode escolher magias de qualquer escola da lista de mago/feiticeiro para aprender."
      },
      {
        nivel: 5,
        nome: "Harmonia Arcana",
        descricao: "A CD para resistir às suas magias arcanas aumenta em +1 e ganha +2 em Identificar Magia."
      },
      {
        nivel: 10,
        nome: "Crescendo Arcano",
        descricao: "Ao lançar uma magia com custo de PM, pode gastar 1 PM a menos uma vez por encontro."
      }
    ]
  },
  {
    id: 'ladino_gatunos',
    nome: 'Ladino: Guilda dos Gatunos',
    tipo: 'Basica',
    pvInicial: 12,
    pvPorNivel: 3,
    pmPorNivel: 0,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Destreza 13.",
    proficiencias: "Armas simples, armaduras leves.",
    descricao: "Especialista em invasão furtiva, arrombamento rápido e roubo sem ser percebido nem mesmo pelo mais vigilante guarda.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Mãos Rápidas",
        descricao: "Pode realizar testes de Ladinagem como ação de movimento em vez de ação padrão."
      },
      {
        nivel: 5,
        nome: "Infiltração Noturna",
        descricao: "Recebe +4 em testes de Furtividade e ignora penalidades de armaduras leves na Furtividade."
      },
      {
        nivel: 10,
        nome: "Desaparecer nas Sombras",
        descricao: "Pode se esconder mesmo sendo observado caso esteja a até 3m de qualquer sombra ou cobertura."
      }
    ]
  },
  {
    id: 'ladino_capangas',
    nome: 'Ladino: Guilda dos Capangas',
    tipo: 'Basica',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 0,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Força 13.",
    proficiencias: "Armas simples e marciais, armaduras leves e médias.",
    descricao: "Ladino de força física bruta, intimidador e cobrador de dívidas que quebra ossos e intimida oponentes em becos escuros.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Ataque Brutal",
        descricao: "Soma modificador de Força no dano do Ataque Furtivo com armas de esmagamento (como clavas e maças)."
      },
      {
        nivel: 5,
        nome: "Músculos da Máfia",
        descricao: "Usa modificador de Força em vez de Carisma para testes de Intimidação e ganha RD 2/–."
      },
      {
        nivel: 10,
        nome: "Nocaute Arrasador",
        descricao: "Ao atingir um inimigo desprevenido com dano não-letal, o alvo deve ter sucesso em Fortitude ou cai inconsciente."
      }
    ]
  },
  {
    id: 'ranger_cacadores_monstros',
    nome: 'Ranger: Patrulha dos Caçadores de Monstros',
    tipo: 'Basica',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 1,
    bba: "1 por nível (total)",
    preRequisitos: "Sabedoria 13.",
    proficiencias: "Armas marciais, armaduras leves e médias, escudos.",
    descricao: "Ranger especializado em caçar monstros gigantescos, aberrações e criaturas místicas perigosas.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Inimigo Monstruoso",
        descricao: "Recebe Inimigo Predileto contra Monstros ou Aberrações com bônus de +4 no ataque e dano."
      },
      {
        nivel: 5,
        nome: "Resistência a Garras e Presas",
        descricao: "Ganha +2 na CA contra ataques de armas naturais de monstros e bônus de +2 contra venenos de feras."
      },
      {
        nivel: 10,
        nome: "Derrubar Colossos",
        descricao: "Ao atingir criatura de tamanho Grande ou maior, pode tentar uma manobra de derrubar como ação livre."
      }
    ]
  },
  {
    id: 'ranger_arqueiros',
    nome: 'Ranger: Patrulha dos Arqueiros',
    tipo: 'Basica',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 1,
    bba: "1 por nível (total)",
    preRequisitos: "Destreza 13.",
    proficiencias: "Armas marciais, arcos, armaduras leves.",
    descricao: "Atirador de elite dos ermos com precisão cirúrgica e maestria com arcos longos e compostos.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Olho de Rapina",
        descricao: "Recebe os talentos Tiro Certeiro e Tiro Longo como talentos adicionais."
      },
      {
        nivel: 5,
        nome: "Chuva de Flechas",
        descricao: "Ao realizar ataque total à distância, pode desferir um disparo adicional com bônus pleno."
      },
      {
        nivel: 10,
        nome: "Disparo Penetrante",
        descricao: "Seus disparos ignoram até 5 pontos de Redução de Dano do alvo."
      }
    ]
  },
  {
    id: 'swashbuckler_duelistas',
    nome: 'Swashbuckler: Clube dos Duelistas',
    tipo: 'Basica',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 0,
    bba: "1 por nível (total)",
    preRequisitos: "Destreza 13, Inteligência 13.",
    proficiencias: "Armas marciais leves, florete, nenhuma armadura ou armadura leve.",
    descricao: "Duelista gracioso que trata o combate como uma dança de esgrima com floretes e lâminas rápidas.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Postura do Duelista",
        descricao: "Recebe +1 na CA e margem de crítico expandida em +1 ao lutar empunhando arma em uma mão e a outra livre."
      },
      {
        nivel: 5,
        nome: "Aparar Lâmina",
        descricao: "Uma vez por rodada como reação, pode gastar um ataque de oportunidade para tentar desviar um golpe corpo a corpo recebido."
      },
      {
        nivel: 10,
        nome: "Estocada no Coração",
        descricao: "Seus acertos críticos causam dano adicional igual ao seu bônus de Inteligência multiplicado por 2."
      }
    ]
  },
  {
    id: 'swashbuckler_exploradores',
    nome: 'Swashbuckler: Clube dos Exploradores',
    tipo: 'Basica',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 0,
    bba: "1 por nível (total)",
    preRequisitos: "Destreza 13, Carisma 13.",
    proficiencias: "Armas marciais leves, armaduras leves.",
    descricao: "Viajante audaz acostumado a selvas inexploradas, ruínas antigas e navegação pelos mares de Arton.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Pé na Estrada",
        descricao: "Seu deslocamento aumenta em +3 metros e recebe +2 em testes de Acrobacia e Atletismo."
      },
      {
        nivel: 5,
        nome: "Sorte do Viajante",
        descricao: "Pode rolar novamente um teste de resistência que falhou (1/dia)."
      },
      {
        nivel: 10,
        nome: "Salto Acrobático Livre",
        descricao: "Ignora terreno difícil e não sofre dano por quedas de até 9 metros."
      }
    ]
  },

  // --- CLASSES DE PRESTÍGIO CLÁSSICAS OFICIAIS (LIVRO BÁSICO / TSRD) ---
  {
    id: 'algoz',
    nome: 'Algoz',
    tipo: 'Prestigio',
    pvInicial: 20,
    pvPorNivel: 5,
    pmPorNivel: 2,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, Tendência Maligna, Ataque Poderoso, Foco em Arma (qualquer), Golpe Cruel.",
    proficiencias: "Todas as armas marciais, todas as armaduras e escudos.",
    descricao: "O campeão sombrio do mal, contraparte profana do paladino. Comanda mortos-vivos, desfere golpes terríveis e conjura magias de trevas.",
    livroFonte: "Manual Básico / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Aura do Mal",
        descricao: "Irradia poderosa aura maligna visível por magias de detecção."
      },
      {
        nivel: 1,
        nome: "Golpe Profano (1/dia)",
        descricao: "Soma Carisma na jogada de ataque e causa +1d6 de dano por nível de algoz contra alvos bondosos."
      },
      {
        nivel: 2,
        nome: "Comandar Mortos-Vivos",
        descricao: "Pode subjugar e comandar mortos-vivos através de canalização de energia negativa."
      },
      {
        nivel: 3,
        nome: "Montaria Sinistra",
        descricao: "Convoca uma montaria das trevas (cavalo de guerra esquelético ou corcel do abismo)."
      },
      {
        nivel: 5,
        nome: "Olhar da Morte",
        descricao: "Oponentes atingidos pelo seu golpe profano devem ser bem-sucedidos em Fortitude ou ficam atordoados pelo terror."
      }
    ]
  },
  {
    id: 'arqueiro_arcano',
    nome: 'Arqueiro Arcano',
    tipo: 'Prestigio',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 3,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +6, capacidade de lançar magias arcanas de 1º nível, Foco em Arma (qualquer arco), Tiro Certeiro, Raça Elfo ou Meio-Elfo.",
    proficiencias: "Todos os tipos de arcos, espadas curtas e longas, armaduras leves.",
    descricao: "Mestre elfo que funde a arquearia refinada com magia arcana, transformando flechas disparadas em portadoras de chamas, raios e feitiços concentrados.",
    livroFonte: "Manual Básico / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Flecha Encantada (+1)",
        descricao: "Toda flecha comum disparada ganha bônus mágico de +1 no ataque e dano (aumenta para +2 no 3º nível, +3 no 5º nível, etc.)."
      },
      {
        nivel: 2,
        nome: "Flecha Feitiço",
        descricao: "Pode imbuir uma magia de área conhecida em uma flecha; a magia detona no ponto onde a flecha atingir."
      },
      {
        nivel: 4,
        nome: "Flecha Buscadora",
        descricao: "Uma vez por dia, dispara uma flecha que ignora camuflagem, cobertura e contorna obstáculos buscando o alvo."
      },
      {
        nivel: 6,
        nome: "Flecha de Fase",
        descricao: "Dispara uma flecha etérea capaz de atravessar paredes e barreiras sólidas para atingir o oponente."
      },
      {
        nivel: 10,
        nome: "Flecha da Morte",
        descricao: "Dispara flecha letal: criatura atingida deve ser bem-sucedida em Fortitude (CD 20 + mod. Int/Car) ou morre instantaneamente."
      }
    ]
  },
  {
    id: 'arquimago',
    nome: 'Arquimago',
    tipo: 'Prestigio',
    pvInicial: 10,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (baixo)",
    preRequisitos: "Capacidade de lançar magias arcanas de 7º nível, Conhecimento (arcano) 15 graduações, Identificar Magia 15 graduações, Foco em Perícia (Identificar Magia), três talentos metamágicos.",
    proficiencias: "Nenhuma adicional.",
    descricao: "O ápice do poder místico em Arton. Mestres que reescrevem as leis fundamentais da trama mágica com a Alta Magia.",
    livroFonte: "Manual Básico / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Alta Magia: Alcance Maior",
        descricao: "Altera o alcance de magias arcanas (toque passa a curto 9m, curto passa a médio, etc.)."
      },
      {
        nivel: 2,
        nome: "Alta Magia: Moldar Feitiço",
        descricao: "Altera o formato e exclui aliados de áreas de efeito de suas magias."
      },
      {
        nivel: 3,
        nome: "Alta Magia: Fogo Arcano",
        descricao: "Converte o dano de suas magias em energia arcana pura e irresistível."
      },
      {
        nivel: 4,
        nome: "Alta Magia: Habilidade Similar a Magia",
        descricao: "Pode lançar uma magia arcana favorita duas vezes por dia sem gastar PM."
      },
      {
        nivel: 5,
        nome: "Alta Magia: Poder da Magia",
        descricao: "A CD para resistir a todas as suas magias arcanas aumenta permanentemente em +2."
      }
    ]
  },
  {
    id: 'assassino',
    nome: 'Assassino',
    tipo: 'Prestigio',
    pvInicial: 12,
    pvPorNivel: 3,
    pmPorNivel: 2,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Furtividade 8 graduações, Ladinagem 8 graduações, Tendência não Bondosa, Ataque Furtivo +2d6.",
    proficiencias: "Armas simples, besta leve e de mão, armas leves, armaduras leves.",
    descricao: "Mestre da morte discreta e do assassinato sob encomenda. Especialista em venenos paralisantes e golpes mortais premeditados.",
    livroFonte: "Manual Básico / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Ataque Mortal",
        descricao: "Se estudar a vítima por 3 rodadas sem ser notado e desferir ataque furtivo, o alvo deve ter sucesso em Fortitude ou morre (ou fica paralisado por 1d6 rodadas)."
      },
      {
        nivel: 1,
        nome: "Uso de Venenos",
        descricao: "Nunca se envenena acidentalmente ao aplicar venenos em armas."
      },
      {
        nivel: 2,
        nome: "Ataque Furtivo (+1d6)",
        descricao: "Dano do ataque furtivo aumenta em +1d6 a cada 2 níveis."
      },
      {
        nivel: 3,
        nome: "Esconder-se à Vista",
        descricao: "Pode usar Furtividade mesmo sendo observado caso haja qualquer sombra por perto."
      },
      {
        nivel: 5,
        nome: "Mente Inescrutável",
        descricao: "Ganha bônus de +4 em testes de Vontade contra adivinhações e leituras mentais."
      }
    ]
  },
  {
    id: 'cavaleiro_do_corvo',
    nome: 'Cavaleiro do Corvo',
    tipo: 'Prestigio',
    pvInicial: 20,
    pvPorNivel: 5,
    pmPorNivel: 0,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, Tendência Leal e Neutra ou Leal e Maligna, Conhecimento (estratégia ou nobreza) 4 graduações, Usar Armaduras Pesadas, Foco em Arma (qualquer lança ou espada longa).",
    proficiencias: "Todas as armas marciais, todas as armaduras e escudos.",
    descricao: "Membro da temida Ordem do Corvo de Yuden. Guerreiro disciplinado, leal apenas à vitória militar e mestre em intimidar oponentes.",
    livroFonte: "Manual Básico / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Disciplina de Ferro",
        descricao: "Recebe +2 em testes de Vontade e não pode ser desarmado em combate."
      },
      {
        nivel: 2,
        nome: "Olhar do Corvo",
        descricao: "Soma seu bônus de Força em testes de Intimidação e inimigos intimidados sofrem –2 na CA."
      },
      {
        nivel: 3,
        nome: "Montaria de Guerra de Yuden",
        descricao: "Recebe um corcel blindado com bônus na CA e velocidade superior."
      },
      {
        nivel: 5,
        nome: "Golpe Implacável",
        descricao: "Ao acertar um oponente desprevenido ou com a guarda baixa, o dano é multiplicado por 1,5."
      }
    ]
  },
  {
    id: 'dancarino_das_sombras',
    nome: 'Dançarino das Sombras',
    tipo: 'Prestigio',
    pvInicial: 14,
    pvPorNivel: 3,
    pmPorNivel: 2,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Acrobacia 8 graduações, Atuação (dança) 8 graduações, Furtividade 8 graduações, Esquiva, Mobilidade.",
    proficiencias: "Armas simples, armaduras leves.",
    descricao: "Artista misterioso que se funde com as sombras da realidade, saltando através de fendas escuras e comandando espectros leais.",
    livroFonte: "Manual Básico / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Esconder-se à Vista",
        descricao: "Pode se esconder a até 3m de qualquer sombra sem necessidade de cobertura sólida."
      },
      {
        nivel: 2,
        nome: "Salto das Sombras (6m)",
        descricao: "Pode se teletransportar instantaneamente de uma sombra para outra visível (até 6m por dia)."
      },
      {
        nivel: 3,
        nome: "Ilusão Sombria",
        descricao: "Gasta 2 PM para projetar cópias ilusórias como a magia Imagem Espelhada."
      },
      {
        nivel: 4,
        nome: "Invocar Sombra",
        descricao: "Pode convocar um espectro de sombra leal sob seu controle por até 1 hora por dia."
      },
      {
        nivel: 5,
        nome: "Manto da Noite",
        descricao: "Garante camuflagem permanente de 20% mesmo em plena iluminação."
      }
    ]
  },
  {
    id: 'discipulo_do_dragao',
    nome: 'Discípulo do Dragão',
    tipo: 'Prestigio',
    pvInicial: 20,
    pvPorNivel: 5,
    pmPorNivel: 2,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Conhecimento (arcano) 8 graduações, capacidade de lançar magias arcanas espontâneas de 1º nível (feiticeiro ou bardo).",
    proficiencias: "Nenhuma adicional.",
    descricao: "Conjurador que cultiva seu sangue dracônico latente, manifestando escamas duras, garras, asas e o devastador sopro de dragão.",
    livroFonte: "Manual Básico / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Herança Dracônica (+1 CA)",
        descricao: "Recebe armadura natural de +1 na CA e garras retráteis que causam 1d6 de dano."
      },
      {
        nivel: 2,
        nome: "Força Dracônica (+2 Força)",
        descricao: "Recebe bônus inerente permanente de +2 em Força."
      },
      {
        nivel: 3,
        nome: "Sopro Dracônico (2d8)",
        descricao: "Desfere sopro elemental em cone de 9m ou linha de 18m causando 2d8 de dano elemental (Reflexos metade)."
      },
      {
        nivel: 5,
        nome: "Asas de Dragão",
        descricao: "Desenvolve grandes asas de couro que concedem deslocamento de voo de 12 metros."
      },
      {
        nivel: 10,
        nome: "Apoteose Dracônica",
        descricao: "Seu tipo passa a ser Dragão; recebe imunidade total ao seu elemento, sono e paralisia, e percepção às cegas 18m."
      }
    ]
  },
  {
    id: 'mago_de_combate',
    nome: 'Mago de Combate',
    tipo: 'Prestigio',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 3,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +4, capacidade de lançar magias arcanas de 2º nível, Usar Armas Marciais, Foco em Arma (qualquer).",
    proficiencias: "Todas as armas marciais, todas as armaduras leves e médias.",
    descricao: "Arcanista marcial treinado para lutar nas linhas de frente vestindo armaduras e disparando feitiços através de sua lâmina afiada.",
    livroFonte: "Manual Básico / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Conjuração em Combate Aprimorada",
        descricao: "Recebe bônus de +4 em testes de Concentração para lançar magias corpo a corpo."
      },
      {
        nivel: 2,
        nome: "Armadura Arcana Tática",
        descricao: "Reduz a chance de falha de magia arcana de armaduras em 15%."
      },
      {
        nivel: 3,
        nome: "Canalizar Magia na Arma",
        descricao: "Como ação padrão, ataca com a arma e descarrega uma magia de toque através do golpe."
      },
      {
        nivel: 5,
        nome: "Escudo Mágico Reativo",
        descricao: "Gasta 2 PM para receber bônus de escudo de +4 na CA como reação a um ataque."
      }
    ]
  },
  {
    id: 'teurgista_mistico',
    nome: 'Teurgista Místico',
    tipo: 'Prestigio',
    pvInicial: 10,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (baixo)",
    preRequisitos: "Capacidade de lançar magias arcanas de 2º nível e magias divinas de 2º nível, Conhecimento (arcano) 6 graduações, Conhecimento (religião) 6 graduações.",
    proficiencias: "Nenhuma adicional.",
    descricao: "Sábio extraordinário que desvendou a síntese perfeita entre os feitiços arcanos e os milagres divinos.",
    livroFonte: "Manual Básico / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Conexão Teúrgica",
        descricao: "A cada nível nesta classe, ganha novos círculos e PM como se tivesse subido um nível tanto na sua classe arcana quanto divina."
      },
      {
        nivel: 3,
        nome: "Transfusão de Mana",
        descricao: "Pode usar Pontos de Mana de sua reserva para lançar tanto feitiços arcanos quanto divinos indistintamente."
      },
      {
        nivel: 5,
        nome: "Fusão de Feitiço e Milagre",
        descricao: "Uma vez por dia, pode lançar uma magia arcana e uma magia divina na mesma rodada gastando uma única ação padrão."
      }
    ]
  },
  {
    id: 'hierofante',
    nome: 'Hierofante',
    tipo: 'Prestigio',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 4,
    bba: "1/2 por nível (baixo)",
    preRequisitos: "Capacidade de lançar magias divinas de 7º nível, Conhecimento (religião) 15 graduações.",
    proficiencias: "Nenhuma adicional.",
    descricao: "O sumo-sacerdote e oráculo vivo dos deuses maiores de Arton. Portador da graça divina suprema.",
    livroFonte: "Manual Básico / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Poder Divino: Canalização Aprimorada",
        descricao: "Sua cura ou dano sagrado por canalização de energia divina é maximizado automaticamente."
      },
      {
        nivel: 2,
        nome: "Poder Divino: Santuário Permanente",
        descricao: "Inimigos devem ser bem-sucedidos em Vontade para atacá-lo em qualquer combate."
      },
      {
        nivel: 3,
        nome: "Poder Divino: Cura Milagrosa",
        descricao: "Suas magias de cura concedem bônus de +4 na CA do alvo curado por 1 rodada."
      },
      {
        nivel: 5,
        nome: "Avatar do Sagrado",
        descricao: "Ganha imunidade a efeitos de morte, dreno de energia e redução de dano 10/sagrado."
      }
    ]
  },
  {
    id: 'aeronauta_goblin',
    nome: 'Aeronauta Goblin',
    tipo: 'Prestigio',
    pvInicial: 14,
    pvPorNivel: 3,
    pmPorNivel: 1,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Raça Goblin, Pilotagem 8 graduações, Ofício (engenhoqueiro) 8 graduações, Foco em Perícia (Pilotagem).",
    proficiencias: "Armas de fogo, armas simples, nenhuma armadura.",
    descricao: "Engenhoqueiro goblin louco e destemido que pilota balões zepelins, asas-deltas e foguetes improvisados bombardeando inimigos dos céus.",
    livroFonte: "Manual do Malandro / TSRD",
    habilidades: [
      {
        nivel: 1,
        nome: "Piloto Audaz",
        descricao: "Soma modificador de Inteligência em testes de Pilotagem e acrobacias aéreas."
      },
      {
        nivel: 2,
        nome: "Bombardeio Aéreo",
        descricao: "Arremessa bombas alquímicas dos céus com dobro do alcance e bônus de +2 nas jogadas de ataque."
      },
      {
        nivel: 3,
        nome: "Gambiarra de Fuga",
        descricao: "Se sua máquina voadora for destruída, ativa paraquedas improvisado ou asa-delta automática sofrendo 0 de dano de queda."
      },
      {
        nivel: 5,
        nome: "Zepelim da Destruição",
        descricao: "Constrói seu próprio balão motorizado equipado com canhões de pólvora e lançadores de granadas."
      }
    ]
  }
];

let inseridos = 0;
for (const nc of novasClasses) {
  const idx = classes.findIndex(c => c.id === nc.id);
  if (idx >= 0) {
    classes[idx] = nc;
    console.log(`Atualizada classe: ${nc.nome}`);
  } else {
    classes.push(nc);
    inseridos++;
    console.log(`Adicionada nova classe: ${nc.nome}`);
  }
}

fs.writeFileSync(classesFilePath, JSON.stringify(classes, null, 2), 'utf8');
console.log(`Sucesso: ${inseridos} novas classes adicionadas. Total agora: ${classes.length}`);

