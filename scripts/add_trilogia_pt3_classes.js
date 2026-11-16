const fs = require('fs');
const path = require('path');

const classesFilePath = path.join(__dirname, '..', 'src', 'data', 'classes', 'classes.json');
const classes = JSON.parse(fs.readFileSync(classesFilePath, 'utf8'));

const novasClassesTrilogiaPt3 = [
  {
    id: 'sedutor',
    nome: 'Sedutor',
    tipo: 'Prestigio',
    pvInicial: 12,
    pvPorNivel: 3,
    pmPorNivel: 0,
    bba: "3/4 por nível (médio)",
    preRequisitos: "Tendência qualquer não Leal, treinado em Conhecimento (qualquer) e Enganação, 4 graduações em Diplomacia e Intuição.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Especialista nas artes da dinâmica social e técnicas de conquista que supera a timidez ou falta de beleza através de padrões comportamentais estudados conhecidos como 'o Método'.",
    livroFonte: "Guia da Trilogia",
    habilidades: [
      {
        nivel: 1,
        nome: "Abertura",
        descricao: "Com algumas palavras e uma ação livre, melhora em um passo a atitude de uma pessoa (por exemplo, de Indiferente para Amistoso) sem teste de Diplomacia. Não pode ser usada em combate; funciona apenas com criaturas inteligentes (Int 3+) capazes de entendê-lo."
      },
      {
        nivel: 1,
        nome: "Demonstração de Valor",
        descricao: "Sempre que faz um teste de Diplomacia ou Enganação, pode fazer um teste de Conhecimento (qualquer, CD 20) como ação livre. Se for bem-sucedido, recebe +4 no teste de Diplomacia ou Enganação."
      },
      {
        nivel: 2,
        nome: "O Método",
        descricao: "Passa a fazer testes de Adestrar Animais, Diplomacia, Enganação, Intimidação e Obter Informação substituindo Carisma por outra habilidade à sua escolha."
      },
      {
        nivel: 2,
        nome: "Neg",
        descricao: "Uma vez por dia, pode transformar em sucesso uma falha em qualquer teste de Diplomacia ou Enganação ao usar comentários negativos calculados como iscas de atração."
      },
      {
        nivel: 3,
        nome: "Mestre do Método",
        descricao: "Pode substituir Carisma pela habilidade básica escolhida para O Método no 2º nível para qualquer efeito baseado em Carisma (ex.: classe de armadura de swashbuckler ou conjuração de feiticeiro)."
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
    preRequisitos: "BBA +6, Tendência qualquer não Caótica e não Bondosa, treinado em Conhecimento (estratégia), Iniciativa e Furtividade, talentos Tolerância, Usar Armaduras Pesadas e Vontade de Ferro.",
    proficiencias: "Nenhuma proficiência adicional.",
    descricao: "Força de operações especiais de elite forjada por treinamento militar rigoroso para atuar em missões letais, invasão de áreas de Tormenta e infiltração silenciosa nas sombras sob o lema: 'Das trevas, trazemos a luz'.",
    livroFonte: "Guia da Trilogia",
    habilidades: [
      {
        nivel: 1,
        nome: "Ataque Furtivo (+1d6)",
        descricao: "Quando atinge um oponente desprevenido ou flanqueado com um ataque corpo a corpo ou à distância a até 9m, causa +1d6 pontos de dano (+2d6 no 3º nível, +3d6 no 5º, +4d6 no 7º e +5d6 no 9º nível). Criaturas imunes a acertos críticos são imunes a ataque furtivo."
      },
      {
        nivel: 1,
        nome: "Língua dos Corvos",
        descricao: "Aprende um jargão composto de expressões e gestos que permite comunicar-se livremente com outros membros desta classe que possam vê-lo, como sob efeito de ligação telepática. Impossível de ser compreendido por não-membros."
      },
      {
        nivel: 1,
        nome: "Reconhecimento e Infiltração",
        descricao: "Não sofre penalidades em perícias ou deslocamento por utilizar qualquer tipo de armadura."
      },
      {
        nivel: 1,
        nome: "Especial: Transição da Ordem da Luz",
        descricao: "Níveis de cavaleiro da Luz podem ser trocados por níveis de Cavaleiro do Corvo imediatamente, assim que o personagem adquire o primeiro nível nesta classe de prestígio."
      },
      {
        nivel: 2,
        nome: "Estômago de Otyugh",
        descricao: "Pode usar a perícia Sobrevivência para se sustentar mesmo em terrenos onde isso normalmente seria impossível, como Planos infernais, áreas de Tormenta e tumbas de liches."
      },
      {
        nivel: 2,
        nome: "Não Tenho Nome (Medo)",
        descricao: "Desprovido de vaidade ou hesitação, atende apenas por codinome militar. Torna-se imune a efeitos de medo."
      },
      {
        nivel: 3,
        nome: "Ataque Furtivo (+2d6)",
        descricao: "O dano adicional de ataque furtivo aumenta para +2d6."
      },
      {
        nivel: 3,
        nome: "Missão Dada É Missão Cumprida (Inteligência)",
        descricao: "Pode declarar um objetivo como sua missão (exige 1 dia de preparo se não for ordem de superior). Recebe a habilidade de classe conhecimento de bardo para informações a respeito de sua missão."
      },
      {
        nivel: 4,
        nome: "Atrás das Linhas Inimigas (Camuflagem)",
        descricao: "Pode usar Furtividade mesmo sem cobertura ou camuflagem, e a penalidade por usar a perícia na rodada em que atacou diminui para –5 (em vez de –20)."
      },
      {
        nivel: 4,
        nome: "Ferramenta de Morte (Ação Padrão)",
        descricao: "Pode coordenar um ataque com até 1 + mod. Int aliados gastando ação padrão e vencendo teste oposto de Conhecimento (estratégia) contra Intuição do alvo (sem teste se todos forem Corvos). Cada aliado abre mão da ação padrão e concede +4 cumulativo no ataque e o dano de sua arma somado ao dano do Corvo."
      },
      {
        nivel: 5,
        nome: "Ataque Furtivo (+3d6)",
        descricao: "O dano adicional de ataque furtivo aumenta para +3d6."
      },
      {
        nivel: 5,
        nome: "Das Trevas",
        descricao: "Quando agarra criatura desprevenida (até uma categoria maior que você), ela não pode emitir som até se soltar. Ataques desarmados ou com armas leves contra ela até o fim do seu próximo turno causam dano triplicado."
      },
      {
        nivel: 6,
        nome: "Missão Dada É Missão Cumprida (Guerra Não Convencional)",
        descricao: "Quando em missão, pode escolher uma perícia adicional, na qual passa a ser treinado enquanto a missão durar."
      },
      {
        nivel: 7,
        nome: "Ataque Furtivo (+4d6)",
        descricao: "O dano adicional de ataque furtivo aumenta para +4d6."
      },
      {
        nivel: 7,
        nome: "Atrás das Linhas Inimigas (Indetectável)",
        descricao: "Torna-se imune a habilidades que possam detectá-lo automaticamente, como faro, percepção às cegas, sentido sísmico e magias de adivinhação (ainda pode ser detectado por teste oposto de Percepção contra Furtividade)."
      },
      {
        nivel: 8,
        nome: "Não Tenho Nome (Imunidades de Construto)",
        descricao: "Torna-se imune a atordoamento, dano de habilidade, dano não-letal, doença, encantamento, fadiga, paralisia, necromancia, sono e veneno (as mesmas imunidades de um construto)."
      },
      {
        nivel: 8,
        nome: "Ferramenta de Morte (Ação de Movimento)",
        descricao: "Aliados do Cavaleiro precisam abrir mão apenas de sua ação de movimento (e não mais da ação padrão) para participar do ataque coordenado."
      },
      {
        nivel: 9,
        nome: "Ataque Furtivo (+5d6)",
        descricao: "O dano adicional de ataque furtivo aumenta para +5d6."
      },
      {
        nivel: 9,
        nome: "Missão Dada É Missão Cumprida (Busca e Destruição)",
        descricao: "Todas as armas do Cavaleiro são consideradas anticriatura contra quaisquer criaturas que enfrente durante o cumprimento da missão."
      },
      {
        nivel: 10,
        nome: "Trazemos a Luz",
        descricao: "Uma vez por combate, como ação livre, faz teste de Conhecimento (estratégia). Concede bônus cumulativos nos ataques até o fim do combate: 20 (+1 margem de crítico), 25 (+1 multiplicador de crítico), 30 (crítico e ataque furtivo afetam criaturas imunes), 35 (+2 margem de crítico), 40 (+2 multiplicador de crítico), 45 (ataque furtivo sem precisar flanquear ou alvo desprevenido), 50 (alvo atingido faz teste de Fortitude CD igual ao dano ou morre instantaneamente)."
      }
    ]
  }
];

let inseridos = 0;
let atualizados = 0;

for (const nc of novasClassesTrilogiaPt3) {
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
console.log(`Sucesso: ${inseridos} classes novas adicionadas, ${atualizados} atualizadas. Total de classes: ${classes.length}`);
