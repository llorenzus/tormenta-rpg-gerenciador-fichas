const fs = require('fs');
const path = require('path');

const classesFilePath = path.join(__dirname, '..', 'src', 'data', 'classes', 'classes.json');
const classes = JSON.parse(fs.readFileSync(classesFilePath, 'utf8'));

const novasClasses = [
  // ==========================================
  // MANUAL DO MALANDRO - CLASSES DE PRESTÍGIO
  // ==========================================
  {
    id: 'bufao_de_hyninn',
    nome: 'Bufão de Hyninn',
    tipo: 'Prestigio',
    pvInicial: 12,
    pvPorNivel: 3,
    pmPorNivel: 3,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Tendência qualquer não Leal, Acrobacia 8 graduações, treinado em Atuação (dramaturgia); Especial: música de bardo (canção apavorante) e ser devoto de Hyninn.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Bobo da corte divino e servo caótico de Hyninn e Nimb, capaz de rir da própria morte e transformar perigos mortais em espetáculos hilariantes de sátira, confusão e troça.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Cabriolas de Bobo",
        descricao: "Usa cambalhotas, sátiras e comédia para gerar efeitos mágicos gastando usos diários de música de bardo (alcance 9m, duração 1 min, exige Atuação: dramaturgia). Começa com dois efeitos e aprende novos nos níveis 3, 5, 7 e 9 (Cabriola Desajeitada, Cabriola Hilariante, etc.)."
      },
      {
        nivel: 1,
        nome: "Magias",
        descricao: "Níveis de bufão de Hyninn acumulam-se com níveis de uma classe conjuradora prévia para propósitos de magias conhecidas e PMs."
      },
      {
        nivel: 1,
        nome: "Música de Bardo",
        descricao: "Níveis de bufão de Hyninn acumulam-se com níveis de bardo para determinar os usos diários de música de bardo."
      },
      {
        nivel: 3,
        nome: "Cabriolas de Bobo (Novo Efeito)",
        descricao: "Aprende um novo efeito de cabriola ou uma nova música de bardo da lista de músicas permitidas."
      },
      {
        nivel: 4,
        nome: "Arremedar",
        descricao: "Quando um inimigo a até 9m realizar ataque ou teste, você pode imitá-lo de forma ridícula fazendo teste idêntico; se o resultado do seu teste for maior, a ação do oponente falha automaticamente."
      },
      {
        nivel: 5,
        nome: "Cabriolas de Bobo (Novo Efeito)",
        descricao: "Aprende mais uma cabriola de bobo ou música de bardo."
      },
      {
        nivel: 7,
        nome: "Cabriolas de Bobo (Novo Efeito)",
        descricao: "Aprende mais uma cabriola de bobo ou música de bardo."
      },
      {
        nivel: 8,
        nome: "Rir de Tudo",
        descricao: "A realidade é uma piada absoluta para o bufão. Torna-se completamente imune a efeitos de medo, encantamento e ilusão."
      },
      {
        nivel: 9,
        nome: "Cabriolas de Bobo (Novo Efeito)",
        descricao: "Aprende mais uma cabriola de bobo ou música de bardo."
      },
      {
        nivel: 10,
        nome: "Piada Mortal",
        descricao: "Como ação completa e gastando dois usos de música de bardo, conta a piada definitiva: uma criatura inteligente a até 9m faz teste de Vontade (CD 20 + mod. Carisma) ou morre imediatamente de tanto rir."
      }
    ]
  },
  {
    id: 'carteador',
    nome: 'Carteador',
    tipo: 'Prestigio',
    pvInicial: 12,
    pvPorNivel: 3,
    pmPorNivel: 0,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Carisma 13, Tendência qualquer Caótica, Jogatina 10 graduações, treinado em Enganação, Ladinagem e Intuição, talento Foco em Perícia (Jogatina).",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Artista dos jogos de azar e trapaceiro profissional querido por Nimb, que aposta o próprio destino com blefes, cartas na manga e sorte descarada.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Sorte de Principiante",
        descricao: "Como ação de movimento, pode rolar novamente qualquer teste de d20 recém-realizado um número de vezes por dia igual a 1 + mod. Carisma, ficando com o melhor resultado."
      },
      {
        nivel: 1,
        nome: "Tudo ou Nada",
        descricao: "Ao rolar 1 natural em qualquer d20, pode jogar uma moeda: cara transforma o resultado em 20 natural imediato; coroa confirma falha crítica com –10 em todos os testes por 1 hora."
      },
      {
        nivel: 2,
        nome: "Segunda Chance",
        descricao: "Ao sofrer um ataque ou falhar em teste de resistência, pode gastar 1 ponto de ação como reação para forçar o atacante a rerrolar o ataque ou conceder a si mesmo uma nova jogada de resistência."
      },
      {
        nivel: 3,
        nome: "Seduzir a Sorte",
        descricao: "Soma seu modificador de Carisma na classe de armadura e em todos os testes de resistência contra armadilhas, magias e ataques de criaturas de tendência Caótica."
      },
      {
        nivel: 4,
        nome: "Trapacear",
        descricao: "Pode substituir qualquer teste de resistência exigido por outro tipo (Fortitude por Reflexos ou Vontade, e vice-versa) um número de vezes por dia igual ao seu mod. Carisma."
      },
      {
        nivel: 5,
        nome: "Ás na Manga",
        descricao: "Uma vez por dia, pode trapacear o próprio destino: lança uma magia ou manifesta uma habilidade de classe de qualquer outra classe como se pertencesse a ela com nível igual ao seu nível total de personagem."
      }
    ]
  },
  {
    id: 'chapeu_preto',
    nome: 'Chapéu-Preto',
    tipo: 'Prestigio',
    pvInicial: 20,
    pvPorNivel: 5,
    pmPorNivel: 0,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, Tendência qualquer não Leal e não Bondosa, treinado em Intimidação, talentos Foco em Perícia (Intimidação) e Iniciativa Aprimorada.",
    proficiencias: "Armas de fogo (pistola e mosquete).",
    descricao: "Pistoleiro vil, assassino e saqueador dos ermos sem lei que dispara primeiro, faz as vítimas dançarem sob tiros no chão e não deixa testemunhas vivas para contar a história.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "“Dance!”",
        descricao: "Com uma ação padrão, faz ataque que não causa dano mas assusta o alvo, permitindo teste de Intimidação com +4 como ação livre; se bem-sucedido, o alvo fica abalado por 1 minuto."
      },
      {
        nivel: 1,
        nome: "Tiro à Traição (+1d6)",
        descricao: "Ao atacar oponentes desprevenidos, causa +1d6 de dano extra (+2d6 no 3º, +3d6 no 5º, +4d6 no 7º e +5d6 no 9º nível). Acumula com ataque furtivo."
      },
      {
        nivel: 2,
        nome: "Rápido ou Morto",
        descricao: "Soma modificador de Carisma na Iniciativa (além de Destreza) e sempre pode agir normalmente durante a rodada surpresa."
      },
      {
        nivel: 3,
        nome: "Tiro à Traição (+2d6)",
        descricao: "O dano de tiro à traição aumenta para +2d6."
      },
      {
        nivel: 4,
        nome: "Coração Duro",
        descricao: "Torna-se completamente imune a efeitos de medo e recebe +4 em testes de resistência contra magias de encantamento e ilusão."
      },
      {
        nivel: 5,
        nome: "Fazer de Exemplo",
        descricao: "Ao derrubar um oponente a 0 PV com tiro à traição, todos os inimigos a até 9m devem vencer teste de Vontade contra sua Intimidação ou ficam apavorados por 1 minuto."
      },
      {
        nivel: 5,
        nome: "Tiro à Traição (+3d6)",
        descricao: "O dano de tiro à traição aumenta para +3d6."
      },
      {
        nivel: 6,
        nome: "Reputação Temível",
        descricao: "Soma seu BBA em todos os testes de Intimidação e anula quaisquer penalidades por tentar intimidar criaturas de tamanho superior ao seu."
      },
      {
        nivel: 7,
        nome: "Tiro à Traição (+4d6)",
        descricao: "O dano de tiro à traição aumenta para +4d6."
      },
      {
        nivel: 8,
        nome: "Congelar o Inferno",
        descricao: "Quando qualquer inimigo tenta atacá-lo na rodada surpresa, o chapéu-preto pode sacar e atirar com uma arma de fogo como reação imediata antes do golpe inimigo."
      },
      {
        nivel: 9,
        nome: "Tiro à Traição (+5d6)",
        descricao: "O dano de tiro à traição aumenta para +5d6."
      },
      {
        nivel: 10,
        nome: "Bala nas Costas",
        descricao: "Ao confirmar um acerto crítico com tiro à traição, o oponente deve ser bem-sucedido em um teste de Fortitude (CD igual ao dano sofrido) ou morre instantaneamente."
      }
    ]
  },
  {
    id: 'doutor_de_thyatis',
    nome: 'Doutor de Thyatis',
    tipo: 'Prestigio',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 0,
    bba: "1/2 por nível (baixo)",
    preRequisitos: "Inteligência 13, Carisma 13, Tendência Bondosa, treinado em Conhecimento (história), Cura, Diplomacia e Iniciativa, talento Tolerância, ser devoto de Thyatis.",
    proficiencias: "Nenhuma proficiência adicional. Proibido de usar armas cortantes ou perfurantes contra seres vivos.",
    descricao: "Andarilho temporal e curador do destino de Arton convocado por Thyatis para corrigir desvios na história do mundo através de inteligência, diplomacia, tecnologia improvisada e bom humor excêntrico.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Simpatia pelos Mortais",
        descricao: "Ama os povos artonianos e nunca causa dano letal em seres vivos. Violar esse preceito anula suas habilidades de classe por uma semana inteira."
      },
      {
        nivel: 1,
        nome: "Tempo Maleável",
        descricao: "Enxerga linhas temporais alternativas. Possui reserva de d6s diários igual a mod. Int + Car; pode gastar como ação livre para adicionar +1d6 em jogadas de ataque, perícia ou resistência próprias ou de aliados a até 9m."
      },
      {
        nivel: 2,
        nome: "Renovação",
        descricao: "Ao morrer, ressurge em 1d4 rodadas com o corpo completamente regenerado, nova aparência e oportunidade de reorganizar perícias e valores de atributos."
      },
      {
        nivel: 2,
        nome: "Solução Engenhosa",
        descricao: "Utilizando uma ferramenta improvisada e teste de perícia CD 15/20/25, simula magias utilitárias (arrombar, idiomas, invisibilidade, velocidade, restauração maior, etc.) sem gastar PM."
      },
      {
        nivel: 3,
        nome: "Solução Pacífica",
        descricao: "Como ação padrão, faz teste de Diplomacia oposto à Vontade de um inimigo para convencê-lo pacificamente a cessar hostilidades na cena."
      },
      {
        nivel: 5,
        nome: "Companheiro",
        descricao: "Atrai um companheiro leal para viajar ao seu lado pelo tempo e espaço, recebendo bônus mútuos de suporte em aventuras."
      },
      {
        nivel: 7,
        nome: "Planejamento Passado",
        descricao: "Uma vez por dia, pode declarar que já viajou ao passado para se preparar para este momento exato, sacando dos bolsos a chave, documento ou item mundano perfeito para a situação."
      },
      {
        nivel: 9,
        nome: "Amigo Confiável",
        descricao: "O companheiro do doutor recebe bônus defensivos ampliados e pode absorver dano pelo doutor como reação."
      },
      {
        nivel: 10,
        nome: "Senhor do Tempo",
        descricao: "Sua reserva de dados de Tempo Maleável é duplicada e ele pode paralisar o fluxo temporal local como a magia Parar o Tempo 1/dia."
      }
    ]
  },
  {
    id: 'espiao_de_elite',
    nome: 'Espião de Elite',
    tipo: 'Prestigio',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 0,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, treinado em Conhecimento (local), Diplomacia, Enganação e Furtividade, talentos Atraente e Foco em Perícia (Enganação).",
    proficiencias: "Armas de fogo (pistola e mosquete) e todas as armas marciais.",
    descricao: "Agente secreto refinado de governos e guildas de inteligência, mestre de infiltração na nobreza, sedução calculada, alta tecnologia mundana e licença para matar.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Bem Vestido (+4)",
        descricao: "Quando veste trajes de gala e roupas de alta classe, recebe +4 na CA e em todos os testes baseados em Carisma (+7 no 5º nível, +10 no 9º nível)."
      },
      {
        nivel: 1,
        nome: "Equipamento de Espionagem",
        descricao: "Recebe dispositivos secretos disfarçados em itens cotidianos (abotoaduras explosivas, caneta maçarico, relógio de arpéu) que simulam efeitos mágicos."
      },
      {
        nivel: 2,
        nome: "Sedução de Espião (Sugestão)",
        descricao: "Ao usar sedução em alguém atraído por você, gera efeito idêntico à magia Sugestão sem componentes ou suspeitas."
      },
      {
        nivel: 3,
        nome: "Arma Elegante (1 Categoria)",
        descricao: "Uma arma leve ou de uma mão à sua escolha passa a causar dano como se pertencesse a uma categoria de tamanho maior."
      },
      {
        nivel: 4,
        nome: "Cara de Pau",
        descricao: "Sua compostura é inabalável. Suas mentiras tornam-se indetectáveis mesmo perante magias como discernir mentiras e soma o nível nesta classe em Enganação."
      },
      {
        nivel: 5,
        nome: "Charme Invencível",
        descricao: "Soma seu modificador de Carisma na classe de armadura e em todos os testes de Reflexos."
      },
      {
        nivel: 6,
        nome: "Sedução de Espião (Dominar Pessoa)",
        descricao: "A sedução torna-se tão irresistível que funciona com o poder da magia Dominar Pessoa em vítimas encantadas."
      },
      {
        nivel: 7,
        nome: "Arma Elegante (2 Categorias)",
        descricao: "O dano de sua arma elegante passa a causar dano equivalente a duas categorias de tamanho acima do padrão."
      },
      {
        nivel: 10,
        nome: "Arsenal de Espião & Licença para Matar",
        descricao: "Acesso supremo a inventos e suporte secreto. No primeiro ataque contra um alvo que não o tenha identificado como inimigo, o golpe é um crítico automático."
      }
    ]
  },
  {
    id: 'lobo_do_mar',
    nome: 'Lobo do Mar',
    tipo: 'Prestigio',
    pvInicial: 20,
    pvPorNivel: 5,
    pmPorNivel: 0,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, treinado em Atletismo, Natação ou Ofício (marinheiro) e Percepção, talentos Acuidade com Arma e Combater com Duas Armas.",
    proficiencias: "Todas as armas marciais, armaduras leves e escudos.",
    descricao: "Capitão corsário e pirata dos oceanos de Arton que comanda tripulações temíveis e luta com agilidade feroz entre o convés e os cordames de naus de guerra.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Combater com Duas Armas",
        descricao: "Recebe o talento Combater com Duas Armas. Se já o possuir, as penalidades por lutar com duas armas são reduzidas a 0."
      },
      {
        nivel: 1,
        nome: "Defesa Sagaz",
        descricao: "Quando usa armadura leve ou nenhuma e empunha duas armas ou arma de uma mão e mão livre, soma Inteligência na CA."
      },
      {
        nivel: 2,
        nome: "Pernas do Mar",
        descricao: "Ignora terreno difícil em convés e embarcações e recebe +4 em testes de Acrobacia e Atletismo a bordo de navios."
      },
      {
        nivel: 2,
        nome: "Tripulação Fiel (+1)",
        descricao: "Recebe uma tripulação de marujos leais dispostos a navegar e lutar sob sua bandeira (bônus sobe para +2 no 4º, +3 no 6º, +4 no 8º e +5 no 10º)."
      },
      {
        nivel: 3,
        nome: "Balançar com Corda",
        descricao: "Pode se balançar em cordames ou lustres para desferir investidas aéreas devastadoras com bônus de +4 nas jogadas de ataque e dano."
      },
      {
        nivel: 4,
        nome: "Ataque Furtivo (+1d6)",
        descricao: "Causa +1d6 de dano contra oponentes flanqueados ou desprevenidos (+2d6 no 7º nível)."
      },
      {
        nivel: 5,
        nome: "Olho de Vidro, Perna de Pau & Reputação Temível",
        descricao: "Ganha próteses e cicatrizes marinhas com imunidade a ofuscação e soma nível nesta classe em Intimidação perante marujos e inimigos."
      },
      {
        nivel: 6,
        nome: "Navegador Experiente",
        descricao: "Recebe +2 em testes de Ofício (marinheiro) e a embarcação sob seu comando ganha +50% de deslocamento em viagens."
      },
      {
        nivel: 7,
        nome: "Ataque Furtivo (+2d6)",
        descricao: "O dano de seu ataque furtivo aumenta para +2d6."
      },
      {
        nivel: 8,
        nome: "Ataque Acrobático",
        descricao: "Ao saltar ou manobrar com Acrobacia durante um golpe corpo a corpo, soma seu modificador de Acrobacia no dano do ataque."
      },
      {
        nivel: 9,
        nome: "Flagelo dos Mares & Golpe Sanguinolento",
        descricao: "Seus ataques com lâminas causam ferimentos cruéis que sangram 1d6 de dano contínuo a cada rodada até receberem cura."
      },
      {
        nivel: 10,
        nome: "Navegador Mestre",
        descricao: "O navio que você comanda viaja com velocidade dobrada, ignora tempestades ordinárias e seus marujos operam armas de cerco e canhões com letalidade militar."
      }
    ]
  },
  {
    id: 'mestre_dos_disfarces',
    nome: 'Mestre dos Disfarces',
    tipo: 'Prestigio',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 0,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Treinado em Atuação, Diplomacia, Enganação, Furtividade e Obter Informação, talentos Cosmopolita e Foco em Perícia (Enganação).",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Camaleão social supremo capaz de reproduzir qualquer sotaque, fisionomia, trejeito e histórico social a ponto de enganar até os parentes e aliados mais próximos da pessoa copiada.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Ferramentas Perfeitas",
        descricao: "Nunca sofre penalidades por falta de kit de disfarces e recebe +4 permanente em testes de Enganação voltados para disfarce."
      },
      {
        nivel: 2,
        nome: "Mil Faces (1 Identidade, 1 Hora)",
        descricao: "Pode construir uma identidade falsa detalhada (com papéis, documentos e trejeitos) em 1 hora de preparação sem falhar perante escrutínio casual."
      },
      {
        nivel: 3,
        nome: "Ilusionista",
        descricao: "Pode alterar sua aparência física como a magia Disfarce Ilusório à vontade, sem custo em PM."
      },
      {
        nivel: 4,
        nome: "Mil Faces (2 Identidades)",
        descricao: "Consegue manter duas identidades ativas simultaneamente com conexões em diferentes reinos."
      },
      {
        nivel: 5,
        nome: "Golpe de Confiança (Acerto Crítico)",
        descricao: "Qualquer ataque desferido contra uma criatura que o considere amigo ou aliado leal é automaticamente um acerto crítico confirmado."
      },
      {
        nivel: 6,
        nome: "Mil Faces (10 Minutos)",
        descricao: "O tempo necessário para assumir uma nova identidade complexa cai para apenas 10 minutos."
      },
      {
        nivel: 8,
        nome: "Mil Faces (3 Identidades)",
        descricao: "Pode manter três identidades completas e permanentes sem confusão mental ou risco de exposição."
      },
      {
        nivel: 10,
        nome: "Dupla Verdade & Golpe de Misericórdia",
        descricao: "Troca de identidade e disfarce como ação completa em pleno combate. O primeiro ataque contra alguém iludido por você funciona como um Golpe de Misericórdia instantâneo."
      }
    ]
  },
  {
    id: 'mosqueteiro_imperial',
    nome: 'Mosqueteiro Imperial',
    tipo: 'Prestigio',
    pvInicial: 20,
    pvPorNivel: 5,
    pmPorNivel: 0,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, treinado em Acrobacia, Cavalgar e Diplomacia, talentos Acuidade com Arma, Usar Armas de Fogo e Especialização em Combate, seguir juramento de honra à Rainha-Imperatriz Shivara Sharpblade.",
    proficiencias: "Armas de fogo (pistola e mosquete), todas as armas marciais.",
    descricao: "Guarda de elite de Deheon, duelista e espadachim romântico armado com rapieira e pistola de pederneira, jurado até a morte na defesa da Rainha-Imperatriz e da justiça.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Duelo (+1)",
        descricao: "Recebe +1 no ataque e CA ao empunhar arma leve ou de perfuração em uma mão e arma de fogo na outra (+2 no 4º, +3 no 7º e +4 no 10º nível)."
      },
      {
        nivel: 1,
        nome: "Galanteria",
        descricao: "Soma modificador de Carisma na classe de armadura e em testes de Diplomacia com a nobreza e personalidades artonianas."
      },
      {
        nivel: 2,
        nome: "Valentia (1/dia)",
        descricao: "Pode rerrolar um ataque ou teste com +4 uma vez por dia (2/dia no nível 5 e 3/dia no nível 9)."
      },
      {
        nivel: 3,
        nome: "Ataque Acrobático",
        descricao: "Ao usar Acrobacia para se aproximar de um adversário em investida, adiciona seu modificador de Acrobacia no dano do golpe."
      },
      {
        nivel: 4,
        nome: "Duelo (+2)",
        descricao: "O bônus de duelo aumenta para +2 no ataque e na CA."
      },
      {
        nivel: 5,
        nome: "Valentia (2/dia)",
        descricao: "Ganha um uso adicional por dia da habilidade Valentia."
      },
      {
        nivel: 6,
        nome: "Memento",
        descricao: "Carrega uma lembrança ou broche da rainha que concede imunidade a efeitos de encantamento e +2 em testes de Vontade."
      },
      {
        nivel: 7,
        nome: "Duelo (+3)",
        descricao: "O bônus de duelo aumenta para +3 no ataque e na CA."
      },
      {
        nivel: 8,
        nome: "Audácia",
        descricao: "Recarrega armas de fogo como ação de movimento e pode sacar e disparar sem provocar ataques de oportunidade."
      },
      {
        nivel: 9,
        nome: "Heroísmo & Valentia (3/dia)",
        descricao: "Quando seus PVs caem abaixo da metade, recebe +2 no ataque, dano e CA até o fim da cena."
      },
      {
        nivel: 10,
        nome: "Até a Morte & Duelo (+4)",
        descricao: "Continua consciente e lutando mesmo com PVs negativos até atingir –10 – mod. Con. Duelo aumenta para +4 e margem de crítico de suas armas aumenta em +1."
      }
    ]
  },
  {
    id: 'ninja_infiltrado',
    nome: 'Ninja Infiltrado',
    tipo: 'Prestigio',
    pvInicial: 12,
    pvPorNivel: 3,
    pmPorNivel: 0,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Treinado em Atuação, Enganação, Furtividade e Ladinagem, habilidades truque ninja e passo das sombras (classe Ninja), tendência qualquer não Leal.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Agente tamuraniano invisível aos olhos do Reinado, mestre em assumir a vida de guerreiro, monge, ranger ou ladino comum para cumprir missões de clã a longo prazo.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Círculo de Confiança",
        descricao: "Recebe +4 em testes de Enganação e Diplomacia para convencer outros de sua identidade pública."
      },
      {
        nivel: 1,
        nome: "Classe Simulada",
        descricao: "Escolhe uma classe básica padrão (Bárbaro, Guerreiro, Ladino, Monge ou Ranger); recebe características e habilidades marcantes dela para tornar seu disfarce 100% autêntico."
      },
      {
        nivel: 1,
        nome: "Sempre um Ninja",
        descricao: "Níveis de ninja infiltrado acumulam-se com níveis de ninja para truques ninjas, passos das sombras e dano do golpe desarmado."
      },
      {
        nivel: 3,
        nome: "Classe Simulada Aprimorada",
        descricao: "Adquire novas habilidades e poderes adicionais pertencentes à classe simulada escolhida."
      },
      {
        nivel: 5,
        nome: "Mimetismo Espiritual",
        descricao: "Sua aura, tendência e ressonância mágica passam a ser lidas como sendo exatamente as da identidade falsa perante quaisquer magias de adivinhação."
      }
    ]
  },
  {
    id: 'vigarista',
    nome: 'Vigarista',
    tipo: 'Prestigio',
    pvInicial: 12,
    pvPorNivel: 3,
    pmPorNivel: 0,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Treinado em Diplomacia, Enganação, Intuição e Obter Informação, talentos Atraente e Foco em Perícia (Enganação).",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Vendedor de elixires milagrosos falsos, charlatão de aldeias e negociador charmoso que faz qualquer comprador implorar para comprar relíquias fajutas por fortunas.",
    livroFonte: "Manual do Malandro",
    habilidades: [
      {
        nivel: 1,
        nome: "Impostor Adicional",
        descricao: "Pode substituir testes de Cura, Identificar Magia e Ofício por testes de Enganação com impressionante lábia e terminologia pomposa."
      },
      {
        nivel: 1,
        nome: "Tirar Leite de Pedra",
        descricao: "Consegue vender itens comuns, bugigangas e falsificações por até dez vezes o preço tabelado com teste de Enganação bem-sucedido."
      },
      {
        nivel: 2,
        nome: "Conhecimento de Vigarista",
        descricao: "Possui vasto repertório de boatos e crendices populares, funcionando como a habilidade Conhecimento de Bardo."
      },
      {
        nivel: 2,
        nome: "“Não Responda Ainda!”",
        descricao: "Durante negociação, faz teste de Enganação oposto à Intuição do cliente como ação livre; se vencer, a vítima fecha o acordo no ato sem pechinchar."
      },
      {
        nivel: 3,
        nome: "Efeito Placebo",
        descricao: "Fabrica poções falsas e pós coloridos que, pela fé do alvo, realmente curam 3d8+5 PVs ou anulam temporariamente fadiga e enjoo."
      },
      {
        nivel: 4,
        nome: "“Não Me Mate Ainda!”",
        descricao: "Se for encurralado por quem descobriu o golpe, faz teste de Enganação para convencê-lo de que assassiná-lo trará maldição ou perda do ouro, impedindo o ataque."
      },
      {
        nivel: 5,
        nome: "Relíquias Sagradas",
        descricao: "Vende quinquilharias dizendo serem relíquias abençoadas; quem a empunha recebe efeito de Bênção e Oração por 24 horas, e o vigarista ganha riqueza extrema."
      }
    ]
  },

  // ==========================================
  // MANUAL DO DEVOTO - VARIANTES DE CLASSE
  // ==========================================
  {
    id: 'clerigo_enclausurado',
    nome: 'Clérigo Enclausurado',
    tipo: 'Basica',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 3,
    bba: "3/4 por nível",
    preRequisitos: "Tendência Leal, treinado em Conhecimento (religião).",
    proficiencias: "Armas simples. Não recebe proficiência com armaduras.",
    descricao: "Sacerdote contemplativo e acadêmico devotado aos mosteiros e bibliotecas divinas. Troca o vigor marcial pelo maior acervo de magias, erudição enciclopédica e liderança espiritual.",
    livroFonte: "Manual do Devoto",
    habilidades: [
      {
        nivel: 1,
        nome: "Devoto, Canalizar Energia & Poder Divino",
        descricao: "Possui as obrigações e poderes da divindade, canalização de energia divina (1d6 a 10d6) e poderes divinos concedidos."
      },
      {
        nivel: 1,
        nome: "Poço de Sabedoria",
        descricao: "Pode fazer testes de qualquer perícia de Conhecimento como se fosse treinado, somando seu nível de clérigo + mod. Inteligência."
      },
      {
        nivel: 1,
        nome: "Estudos Teológicos (3 Magias por Nível)",
        descricao: "Ao avançar de nível, aprende três magias divinas novas em vez de apenas duas."
      },
      {
        nivel: 4,
        nome: "Em Casa (Magia Gratuita)",
        descricao: "Quando está dentro de um templo ou santuário dedicado ao seu deus, pode lançar uma magia preparada por dia sem consumi-la."
      },
      {
        nivel: 6,
        nome: "Gestor do Templo (+4 em uma Perícia)",
        descricao: "Responsável por um setor do templo (biblioteca, relicário, enfermaria), recebe abrigo e comida gratuitos e +4 em uma perícia à sua escolha."
      },
      {
        nivel: 11,
        nome: "Em Casa (CD +2)",
        descricao: "No templo ou solo sagrado da divindade, a CD para resistir a todas as suas magias divinas aumenta em +2."
      },
      {
        nivel: 12,
        nome: "Gestor do Templo (+4 em Perícias de Classe)",
        descricao: "Comanda uma pequena congregação com subalternos dedicados, recebendo bônus de +4 em todas as suas perícias de classe."
      },
      {
        nivel: 18,
        nome: "Gestor do Templo (Escolher 20)",
        descricao: "Administrador de um grande templo catedral; uma vez por dia pode escolher 20 em qualquer teste de perícia."
      },
      {
        nivel: 20,
        nome: "Em Casa (Magias Gratuitas)",
        descricao: "No santuário de seu deus, pode lançar quaisquer magias preparadas sem perdê-las ou consumir recursos diários."
      }
    ]
  },
  {
    id: 'druida_senhor_das_feras',
    nome: 'Druida: Senhor das Feras',
    tipo: 'Basica',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 3,
    bba: "3/4 por nível",
    preRequisitos: "Carisma 13.",
    proficiencias: "Armas simples, clava, bordão, foice, dardo, lança; armaduras de couro e acolchoadas (sem metal).",
    descricao: "Guardião carismático da fauna e mestre amado pelos animais selvagens. Abre mão da forma selvagem para liderar uma matilha leal e permanente de múltiplos companheiros animais e familiares.",
    livroFonte: "Manual do Devoto",
    habilidades: [
      {
        nivel: 1,
        nome: "Código de Conduta, Devoto & Empatia Selvagem",
        descricao: "Segue as diretrizes da natureza e canaliza empatia natural com animais e feras dos ermos."
      },
      {
        nivel: 1,
        nome: "Senhor das Feras (1º Companheiro Animal)",
        descricao: "Inicia sua jornada acompanhado por um animal guardião leal que evolui conforme seu nível."
      },
      {
        nivel: 2,
        nome: "Caminho da Floresta",
        descricao: "Move-se através de vegetação densa sem sofrer penalidades de movimento."
      },
      {
        nivel: 3,
        nome: "Rastro Invisível",
        descricao: "Não pode ser rastreado em terrenos naturais, a menos que deseje deixar rastros."
      },
      {
        nivel: 5,
        nome: "Senhor das Feras (2º Companheiro Animal)",
        descricao: "Atrai um segundo companheiro animal leal que passa a lutar e viajar ao seu lado."
      },
      {
        nivel: 7,
        nome: "Senhor das Feras (1º Familiar)",
        descricao: "Recebe uma criatura mágica protetora como familiar de mago, concedendo bônus de vínculo e sentidos compartilhados."
      },
      {
        nivel: 9,
        nome: "Imunidade a Venenos",
        descricao: "Torna-se completamente imune a todos os venenos naturais e químicos."
      },
      {
        nivel: 13,
        nome: "Senhor das Feras (3º Companheiro Animal)",
        descricao: "Sua matilha expande-se com um terceiro companheiro animal sob seu comando."
      },
      {
        nivel: 15,
        nome: "Corpo Atemporal",
        descricao: "Não sofre mais penalidades por envelhecimento e não pode ser envelhecido magicamente."
      },
      {
        nivel: 20,
        nome: "Senhor das Feras (2º Familiar)",
        descricao: "Atrai um segundo familiar protetor, completando um bando magnífico de feras e criaturas mágicas guardiãs."
      }
    ]
  }
];

let inseridos = 0;
let atualizados = 0;

for (const nc of novasClasses) {
  const idx = classes.findIndex(c => c.id === nc.id);
  if (idx >= 0) {
    classes[idx] = nc;
    atualizados++;
    console.log(`Atualizada classe: ${nc.nome} (${nc.id})`);
  } else {
    classes.push(nc);
    inseridos++;
    console.log(`Adicionada nova classe: ${nc.nome} (${nc.id})`);
  }
}

fs.writeFileSync(classesFilePath, JSON.stringify(classes, null, 2), 'utf8');
console.log(`Sucesso: ${inseridos} classes novas adicionadas, ${atualizados} atualizadas. Total de classes no compêndio: ${classes.length}`);
