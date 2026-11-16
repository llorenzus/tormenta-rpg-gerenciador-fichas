const fs = require('fs');
const path = require('path');

const classesFilePath = path.join(__dirname, '..', 'src', 'data', 'classes', 'classes.json');
const classes = JSON.parse(fs.readFileSync(classesFilePath, 'utf8'));

const novasClassesTrilogia = [
  {
    id: 'samurai_executor',
    nome: 'Samurai Executor',
    tipo: 'Prestigio',
    pvInicial: 20,
    pvPorNivel: 5,
    pmPorNivel: 0,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, Treinado em Diplomacia e Intimidação 8 graduações, talentos Diligente, Foco em Arma (katana) e Trespassar.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Mestre da arte de tirar a vida de condenados à morte com precisão absoluta e golpe único e certeiro em Tamu-ra, sem hesitação na hora crucial.",
    livroFonte: "Guia da Trilogia",
    habilidades: [
      {
        nivel: 1,
        nome: "Espadas Ancestrais",
        descricao: "Níveis de samurai executor acumulam-se com níveis de samurai para a habilidade de classe espadas ancestrais."
      },
      {
        nivel: 1,
        nome: "Golpe de Execução",
        descricao: "Como ação padrão, desfere ataque corpo a corpo com +4 na jogada de ataque e bônus de dano igual ao seu nível nesta classe (não afeta criaturas imunes a acertos críticos)."
      },
      {
        nivel: 2,
        nome: "Sem Mente (Ação de Movimento)",
        descricao: "Como ação de movimento, atinge estado de mente vazia fazendo teste de Vontade: 15-19 (+1d6 dano), 20-24 (+2d6), 25-29 (+3d6), 30-34 (+4d6), 35+ (+5d6) nas jogadas de dano corpo a corpo da rodada."
      },
      {
        nivel: 3,
        nome: "Aura de Morte (-1)",
        descricao: "Oponentes em um raio de 3m sofrem penalidade de -1 em jogadas de ataque."
      },
      {
        nivel: 4,
        nome: "Golpe de Execução Aprimorado (Margem)",
        descricao: "Ao usar Golpe de Execução, sua margem de ameaça de acerto crítico aumenta em +1 (acumula com Acerto Crítico Aprimorado e lâmina afiada)."
      },
      {
        nivel: 6,
        nome: "Aura de Morte (-2)",
        descricao: "A penalidade da aura de morte aumenta para -2 nas jogadas de ataque dos inimigos a até 3m."
      },
      {
        nivel: 7,
        nome: "Golpe de Execução Letal (Multiplicador)",
        descricao: "Ao usar Golpe de Execução, seu multiplicador de acerto crítico aumenta em +1 (ex.: x2 passa a x3, x3 passa a x4)."
      },
      {
        nivel: 8,
        nome: "Sem Mente (Ação Livre)",
        descricao: "Atingir o estado de Sem Mente passa a ser uma ação livre (uma vez por rodada)."
      },
      {
        nivel: 9,
        nome: "Aura de Morte (-3)",
        descricao: "A penalidade da aura de morte aumenta para -3 nas jogadas de ataque dos inimigos a até 3m."
      },
      {
        nivel: 10,
        nome: "Golpe de Execução de Movimento",
        descricao: "Golpe de Execução passa a ser uma ação de movimento, permitindo desferir dois golpes de execução na mesma rodada sem penalidades."
      }
    ]
  },
  {
    id: 'bruxo_da_tormenta',
    nome: 'Bruxo da Tormenta',
    tipo: 'Prestigio',
    pvInicial: 10,
    pvPorNivel: 2,
    pmPorNivel: 4,
    bba: "1/2 por nível (baixo)",
    preRequisitos: "Treinado em Conhecimento (arcano) e Conhecimento (Tormenta), dois talentos da Tormenta, capacidade de lançar magias arcanas de 4º nível, contato direto com a corrupção da Tormenta.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Conjurador que traiu sua própria realidade aliando-se aos invasores lefeu, distorcendo e corrompendo a magia arcana em paródias grotescas da Anticriação.",
    livroFonte: "Guia da Trilogia",
    habilidades: [
      {
        nivel: 1,
        nome: "Conjurador Rubro: Magia Sem Gestos",
        descricao: "Lança Momento de Tormenta à vontade gastando apenas PMs normais. Sempre que lança esta magia, aplica o talento Magia sem Gestos sem custo adicional de PM."
      },
      {
        nivel: 1,
        nome: "Convite à Corrupção",
        descricao: "Pode adquirir talentos da Tormenta perdendo apenas metade dos pontos de Carisma normais (1 ponto de Carisma para cada dois talentos)."
      },
      {
        nivel: 1,
        nome: "Sacrifício",
        descricao: "Marca-se fisicamente com aura corrupta da Anticriação. Falha automaticamente em todos os testes de perícia baseados em Carisma contra criaturas artonianas normais."
      },
      {
        nivel: 2,
        nome: "Involução",
        descricao: "Abandona sua raça de nascimento; perde habilidades raciais originais e ganha traços de lefeu, passando a ser considerado do tipo Monstro."
      },
      {
        nivel: 3,
        nome: "Acostumado ao Horror",
        descricao: "Torna-se imune a todos os efeitos de insanidade da Tormenta e Conjurador Rubro passa a aplicar Magia Silenciosa automaticamente."
      },
      {
        nivel: 4,
        nome: "Presentes Sinistros",
        descricao: "Recebe um talento da Tormenta adicional à sua escolha sem perda de Carisma (recebe outro no 8º nível)."
      },
      {
        nivel: 5,
        nome: "Conjurador Rubro: Estender Magia",
        descricao: "Momento de Tormenta recebe os benefícios do talento Estender Magia sem custo adicional."
      },
      {
        nivel: 6,
        nome: "Autofagia",
        descricao: "Pode infligir a si mesmo penalidade de -1 em um atributo como ação livre para receber imediatamente 10 PM extras (regenera 1 ponto de penalidade por dia)."
      },
      {
        nivel: 7,
        nome: "Conjurador Rubro: Ampliar Magia",
        descricao: "Momento de Tormenta recebe os benefícios do talento Ampliar Magia sem custo adicional."
      },
      {
        nivel: 9,
        nome: "Conjurador Rubro: Maximizar Magia",
        descricao: "Momento de Tormenta recebe os benefícios do talento Maximizar Magia sem custo adicional."
      },
      {
        nivel: 10,
        nome: "Lar Rubro & Acelerar Magia",
        descricao: "Não sofre nenhuma penalidade por estar em área de Tormenta ou na Anticriação, torna-se imune ao dano de matéria vermelha e Momento de Tormenta recebe Acelerar Magia gratuitamente."
      }
    ]
  },
  {
    id: 'cavaleiro_da_luz',
    nome: 'Cavaleiro da Luz',
    tipo: 'Prestigio',
    pvInicial: 20,
    pvPorNivel: 5,
    pmPorNivel: 0,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, Treinado em Cavalgar, Conhecimento (nobreza) e Diplomacia, talentos Combate Montado e Foco em Armadura (pesada), Tendência Leal, seguir obrigações de Khalmyr (proibido usar itens arcanos).",
    proficiencias: "Todas as armas marciais, todas as armaduras e escudos.",
    descricao: "Membro da venerável Ordem da Luz em Bielefeld. Guerreiro nobre e honrado montado em corcel magnífico, dedicado à justiça de Khalmyr e à retidão absoluta.",
    livroFonte: "Guia da Trilogia",
    habilidades: [
      {
        nivel: 1,
        nome: "Ataque Subjugante (1/dia)",
        descricao: "Ao acertar ataque corpo a corpo, alvo faz teste de Vontade (CD 10 + nível na classe + mod. Car) ou fica subjugado (-4 CA, incapaz de realizar ações) por 1 rodada. Ganha novos usos nos níveis 3, 5, 7 e 9."
      },
      {
        nivel: 1,
        nome: "Etiqueta",
        descricao: "Soma nível da classe em Conhecimento (nobreza) e pode rerrolar 1 teste de Diplomacia por dia ficando com o segundo resultado."
      },
      {
        nivel: 1,
        nome: "Montaria Especial",
        descricao: "Recebe montaria de guerra especial com armadura pesada; níveis de cavaleiro da Luz acumulam-se com níveis de paladino para montaria sagrada."
      },
      {
        nivel: 2,
        nome: "Alcunha",
        descricao: "Como ação padrão, apresenta-se com sua alcunha ou título célebre gerando efeito de hipnotismo, medo ou sugestão (CD 10 + nível + Car) 1/dia."
      },
      {
        nivel: 3,
        nome: "Estandarte (Ponto de Ação)",
        descricao: "Ao empunhar estandarte com brasão, você e aliados a até 9m recebem 1 ponto de ação extra no início de cada combate."
      },
      {
        nivel: 4,
        nome: "Força da Honra",
        descricao: "Como ação livre, ganha bônus de +2 nas jogadas de ataque e dano por um número de rodadas igual a 5 + mod. Carisma."
      },
      {
        nivel: 5,
        nome: "Chamado às Armas",
        descricao: "Recebe bônus adicional de +2 nas jogadas de ataque e dano quando realiza uma investida (+4 total na investida)."
      },
      {
        nivel: 6,
        nome: "Estandarte da Liderança",
        descricao: "Recebe o talento Liderança como talento adicional sob a bandeira da Ordem da Luz."
      },
      {
        nivel: 8,
        nome: "Poder da Honra",
        descricao: "O bônus de Força da Honra aumenta para +4 nas jogadas de ataque e dano corpo a corpo."
      },
      {
        nivel: 9,
        nome: "Estandarte do Heroísmo Maior",
        descricao: "Uma vez por dia como ação livre, gera efeito da magia Heroísmo Maior em você e em todos os aliados a até 9m até o fim do combate."
      },
      {
        nivel: 10,
        nome: "Armadura da Integridade",
        descricao: "Vestindo armadura pesada, recebe bônus de +2 na CA e 50% de chance de ignorar completamente acertos críticos."
      }
    ]
  },
  {
    id: 'mestre_armeiro',
    nome: 'Mestre Armeiro',
    tipo: 'Prestigio',
    pvInicial: 16,
    pvPorNivel: 4,
    pmPorNivel: 0,
    bba: "3/4 por nível (médio)",
    preRequisitos: "BBA +4, Ofício (armeiro) 8 graduações, talentos Criar Obra-Prima e Foco em Arma (qualquer).",
    proficiencias: "Armas de fogo (pistola e mosquete) e proficiência com armas fabricadas.",
    descricao: "Artífice bélico e cientista de vanguarda que compreende a física e o metal por trás de cada lâmina e arma de fogo, aplicando inovações mecânicas revolucionárias.",
    livroFonte: "Guia da Trilogia",
    habilidades: [
      {
        nivel: 1,
        nome: "Prata da Casa",
        descricao: "Pode forjar qualquer arma que saiba usar em apenas um dia por 1/3 do preço; armas que você mesmo fabricou recebem +1 de bônus no ataque."
      },
      {
        nivel: 2,
        nome: "É Assim que se Faz",
        descricao: "Ganha um talento de combate adicional que pode ser utilizado exclusivamente com armas que tenha fabricado (ganha novo talento no 6º e 10º)."
      },
      {
        nivel: 3,
        nome: "Inovação Tecnológica (1 Melhoria)",
        descricao: "Pode aplicar melhorias avançadas em armas (Dano adicional, Leve, Precisa, Recarga rápida, Trava de segurança, Mira telescópica, Explosiva, Truque, Giratória ou Acessibilidade). Adiciona novas melhorias nos níveis 5, 7 e 9."
      },
      {
        nivel: 4,
        nome: "Profissional Completo",
        descricao: "Pode usar seu bônus de perícia em Ofício (armeiro) no lugar do bônus de ataque normal para atacar com armas criadas por você (1 + Int vezes/dia)."
      },
      {
        nivel: 5,
        nome: "Arma de Estimação",
        descricao: "Pode conceder 1 nível de uma classe básica a uma de suas armas (ex: ataque furtivo de ladino, inimigo predileto de ranger ou fúria de bárbaro à arma)."
      },
      {
        nivel: 7,
        nome: "Improviso Versátil",
        descricao: "Pode aplicar uma inovação tecnológica como ação completa sem custo em TO com duração de 1 minuto."
      },
      {
        nivel: 8,
        nome: "Cinto de Utilidades",
        descricao: "Uma vez por dia, pode acionar um dispositivo que simula qualquer magia arcana ou divina de até 5º nível."
      },
      {
        nivel: 10,
        nome: "Nada Detém o Progresso",
        descricao: "Recebe +10 em testes de Ofício (armeiro) e o custo de aplicação de inovações tecnológicas permanentes é reduzido pela metade."
      }
    ]
  },
  {
    id: 'algoz_da_tormenta',
    nome: 'Algoz da Tormenta',
    tipo: 'Prestigio',
    pvInicial: 20,
    pvPorNivel: 5,
    pmPorNivel: 0,
    bba: "1 por nível (total)",
    preRequisitos: "BBA +5, Conhecimento (Tormenta) treinado, qualquer talento da Tormenta, Tendência qualquer Maligna, contato pacífico com um Lorde da Tormenta ou lefeu de alta casta.",
    proficiencias: "Todas as armas marciais, todas as armaduras e escudos.",
    descricao: "Guerreiro vil que aceitou a corrupção da Tempestade Rubra, canalizando matéria vermelha e comandando hordas de horrores alienígenas contra o próprio mundo natal.",
    livroFonte: "Guia da Trilogia",
    habilidades: [
      {
        nivel: 1,
        nome: "Anticarisma",
        descricao: "Não perde mais pontos de Carisma por adquirir talentos da Tormenta, e recupera quaisquer pontos perdidos anteriormente por este motivo."
      },
      {
        nivel: 1,
        nome: "Ataque Corrupto (+1d8)",
        descricao: "Seus ataques corpo a corpo ou à distância a até 9m causam +1d8 de dano de matéria vermelha contra criaturas artonianas (aumenta para +2d8 no 4º, +3d8 no 7º e +4d8 no 10º)."
      },
      {
        nivel: 2,
        nome: "Aspecto da Corrupção",
        descricao: "Recebe um talento da Tormenta adicional ou uma característica de criatura lefeu (coordenação perfeita, imortalidade, imunidades). Ganha novo aspecto nos níveis 4, 6, 8 e 10."
      },
      {
        nivel: 2,
        nome: "Bênção da Insanidade",
        descricao: "Pode escolher tornar-se imune à insanidade da Tormenta ou receber bônus de +2 em uma habilidade sempre que sua insanidade aumentar de categoria."
      },
      {
        nivel: 3,
        nome: "Terrorismo (Abalado)",
        descricao: "Criaturas artonianas que vejam o algoz devem fazer teste de Vontade (CD 10 + nível + mod. Car) ou ficam abaladas por 1 minuto."
      },
      {
        nivel: 5,
        nome: "Escravo e Senhor",
        descricao: "Passa a comandar lefeu menores e criaturas com o modelo criatura da Tormenta com ND total somado de até o dobro do seu nível."
      },
      {
        nivel: 7,
        nome: "Terrorismo (Apavorado)",
        descricao: "Sempre que reduzir um inimigo a 0 PV, aliados do derrotado que falharem em Vontade ficam apavorados."
      },
      {
        nivel: 9,
        nome: "Desprezo Profano",
        descricao: "Pode usar dissipar magia divina (nível igual ao do personagem) 3/dia e ganha bônus de +8 em testes de resistência contra magias divinas."
      },
      {
        nivel: 10,
        nome: "General Rubro",
        descricao: "Torna-se líder entre os invasores da Tormenta. Qualquer lefeu ou corrupto de menor nível deve passar em teste de Vontade (CD 20 + Car) para desobedecer suas ordens."
      }
    ]
  }
];

let inseridos = 0;
for (const nc of novasClassesTrilogia) {
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
console.log(`Sucesso: ${inseridos} classes do Guia da Trilogia adicionadas. Total: ${classes.length}`);
