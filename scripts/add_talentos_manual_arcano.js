const fs = require('fs');
const path = require('path');

const talentosFilePath = path.join(__dirname, '..', 'src', 'data', 'talentos', 'talentos.json');
const talentos = JSON.parse(fs.readFileSync(talentosFilePath, 'utf8'));

const novosTalentos = [
  // --- TALENTOS DE CRIAÇÃO DE ITENS MÁGICOS ---
  {
    id: 'criar_armas_armaduras_magicas',
    nome: 'Criar Armas e Armaduras Mágicas',
    categoria: 'Criação de Item',
    preRequisitos: 'Capacidade de lançar magias arcanas ou divinas, nível de conjurador 5º.',
    beneficio: 'Você pode fabricar qualquer arma, escudo ou armadura mágica cujo bônus numérico ou poderes você conheça ou tenha acesso. A criação consome metade do preço de mercado em matérias-primas e 1/25 do preço em XP.',
    descricao: 'Você aprendeu os segredos para forjar o metal e a madeira com essências mágicas permanentes de proteção e destruição.',
    livroFonte: 'Manual do Arcano / Manual Básico'
  },
  {
    id: 'preparar_pocoes',
    nome: 'Preparar Poções',
    categoria: 'Criação de Item',
    preRequisitos: 'Capacidade de lançar magias arcanas ou divinas, nível de conjurador 1º.',
    beneficio: 'Você pode criar poções de qualquer magia de até 3º círculo que você conheça e que tenha como alvo uma ou mais criaturas ou objetos. A poção custa metade do preço de mercado em ingredientes e 1/25 do preço em XP.',
    descricao: 'Você domina a arte da destilação mística, engarrafando encantamentos em elixires líquidos prontos para serem ingeridos.',
    livroFonte: 'Manual do Arcano / Manual Básico'
  },
  {
    id: 'criar_varinhas',
    nome: 'Criar Varinhas',
    categoria: 'Criação de Item',
    preRequisitos: 'Capacidade de lançar magias arcanas ou divinas, nível de conjurador 5º.',
    beneficio: 'Você pode fabricar varinhas contendo qualquer magia de até 4º círculo que conheça. A varinha é criada com 50 cargas completas, custando metade do preço de mercado em ouro e 1/25 em XP.',
    descricao: 'Você canaliza energias arcanas em pequenas varinhas de madeiras nobres, ossos ou cristais para descarregar feitiços rápidos.',
    livroFonte: 'Manual do Arcano / Manual Básico'
  },
  {
    id: 'criar_itens_maravilhosos',
    nome: 'Criar Itens Maravilhosos',
    categoria: 'Criação de Item',
    preRequisitos: 'Capacidade de lançar magias arcanas ou divinas, nível de conjurador 3º.',
    beneficio: 'Você pode criar qualquer item maravilhoso místico (amuletos, anéis, mantos, botas, elmos, bolsas mágicas, etc.). A confecção consome metade do preço de mercado em materiais e 1/25 em XP.',
    descricao: 'Você é um artífice consumado dos grandes artefatos utilitários e vestimentas encantadas que moldam a vida dos aventureiros.',
    livroFonte: 'Manual do Arcano / Manual Básico'
  },
  {
    id: 'criar_bastoes',
    nome: 'Criar Bastões',
    categoria: 'Criação de Item',
    preRequisitos: 'Capacidade de lançar magias arcanas ou divinas, nível de conjurador 9º.',
    beneficio: 'Você pode fabricar bastões mágicos com poderes metamágicos ou utilitários contínuos ao custo de metade do valor de mercado e 1/25 em XP.',
    descricao: 'Você infunde bastões nobres com capacidades metamágicas e auras de controle sustentado.',
    livroFonte: 'Manual do Arcano / Manual Básico'
  },
  {
    id: 'criar_cajados',
    nome: 'Criar Cajados',
    categoria: 'Criação de Item',
    preRequisitos: 'Capacidade de lançar magias arcanas ou divinas, nível de conjurador 12º.',
    beneficio: 'Você pode forjar cajados arcanos poderosos que contêm múltiplas magias com cargas partilhadas. O custo é metade do preço em matérias-primas e 1/25 em XP.',
    descricao: 'O ápice da criação mágica: canalizar feitiços de alto poder em um cajado mestre que ressoa com a alma do conjurador.',
    livroFonte: 'Manual do Arcano / Manual Básico'
  },

  // --- NOVOS TALENTOS ARCANOS DO MANUAL DO ARCANO ---
  {
    id: 'alquimista_avarento',
    nome: 'Alquimista Avarento',
    categoria: 'Perícia',
    preRequisitos: 'Ofício (alquimia) 4 graduações, Preparar Poções.',
    beneficio: 'Você gasta 25% menos matérias-primas (em TO) para preparar qualquer item alquímico ou poção mágica sem perder a eficácia do preparado.',
    descricao: 'Sua habilidade em dosar ingredientes raros até a última gota permite esticar seus recursos financeiros ao máximo.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'adaptabilidade_arcana',
    nome: 'Adaptabilidade Arcana',
    categoria: 'Magia',
    preRequisitos: 'Inteligência 15 ou Carisma 15, nível de conjurador 3º.',
    beneficio: 'Uma vez por dia durante seu descanso longo, você pode trocar uma de suas magias conhecidas por outra magia do mesmo círculo da sua lista de classe.',
    descricao: 'Sua mente flexível permite reconfigurar seus padrões e conceitos mágicos com facilidade surpreendente.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'conjurador_da_torre',
    nome: 'Conjurador da Torre',
    categoria: 'Magia',
    preRequisitos: 'Conhecimento (arcano) 6 graduações, capacidade de lançar magias arcanas de 2º nível.',
    beneficio: 'Você recebe +2 em todos os testes de Identificar Magia e Conhecimento (arcano), e +1 na CD de magias que você lança a partir de pergaminhos ou varinhas.',
    descricao: 'Você estudou as fórmulas padronizadas da Grande Academia Arcana, maximizando o rendimento de itens de conjuração.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'canalizador_de_mana',
    nome: 'Canalizador de Mana',
    categoria: 'Magia',
    preRequisitos: 'Nível de conjurador 5º, Vontade de Ferro.',
    beneficio: 'Uma vez por dia como ação completa, você pode meditar para recuperar um número de Pontos de Mana igual a 1d4 + modificador do atributo-chave de conjuração.',
    descricao: 'Você consegue abrir seus canais sutis de energia interior no meio de uma expedição para absorver as correntes místicas do ambiente.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'magia_estendida_avancada',
    nome: 'Magia Estendida Avançada [metamágico]',
    categoria: 'Magia',
    preRequisitos: 'Magia Estendida, capacidade de lançar magias de 3º nível.',
    beneficio: 'Aumenta a duração de uma magia em quatro vezes (4x) gastando +2 PM adicionais.',
    descricao: 'Seus encantamentos perduram pelo campo de batalha com tenacidade incomparável.',
    livroFonte: 'Manual do Arcano'
  },
  {
    id: 'contrafeitiço_aprimorado',
    nome: 'Contrafeitiço Aprimorado',
    categoria: 'Magia',
    preRequisitos: 'Identificar Magia 6 graduações.',
    beneficio: 'Ao tentar anular uma magia com contramágica, você não precisa usar a mesma magia: pode usar qualquer magia da mesma escola que seja de mesmo círculo ou superior.',
    descricao: 'Você domina as correntes de cada escola arcana, quebrando o fluxo místico do rival com qualquer fórmula correspondente.',
    livroFonte: 'Manual do Arcano'
  }
];

let talAdicionados = 0;
for (const t of novosTalentos) {
  const idx = talentos.findIndex(x => x.id === t.id);
  if (idx >= 0) {
    talentos[idx] = t;
  } else {
    talentos.push(t);
    talAdicionados++;
  }
}

fs.writeFileSync(talentosFilePath, JSON.stringify(talentos, null, 2), 'utf8');
console.log(`Talentos: ${talAdicionados} novos talentos inseridos. Total: ${talentos.length}`);

