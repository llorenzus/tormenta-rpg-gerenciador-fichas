const fs = require('fs');
const path = './src/data/equipamentos/equipamentos.json';

const equipamentos = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Atualizar itens existentes com descrição/estatísticas ricas do Guia da Trilogia
const atualizacoes = {
  machado_taurico: {
    empunhadura: 'Duas mãos',
    descricao: 'Uma haste de 2m de comprimento com uma lâmina extremamente grossa na ponta, o machado táurico é muito pesado, e impõe uma penalidade de -1 na CA de seu usuário. Além do talento Usar Arma Exótica, exige Força 15 ou mais para ser manuseado.',
    livroFonte: 'Guia da Trilogia'
  },
  barril_de_polvora: {
    tipo: 'Arma',
    categoria: 'Exótica',
    dano: '12d6',
    critico: '—',
    alcance: 'Área de 6m',
    tipoDano: 'Fogo e Esmagamento',
    empunhadura: 'Duas mãos',
    descricao: 'Um barril de pólvora causa 12d6 pontos de dano (6d6 por fogo e 6d6 por esmagamento) em um raio de 6m ao redor do centro da explosão. Um teste de Reflexos (CD 20) reduz o dano à metade. O tamanho do pavio determina o número de rodadas até que exploda (acender o pavio é ação padrão; estimar o tempo exige teste de Inteligência CD 10, falha causa detonação 1d4 rodadas antes ou depois).',
    livroFonte: 'Guia da Trilogia'
  },
  traje_de_frio: {
    peso: '5kg',
    descricao: 'Botas grossas, calças, casaco e gorro de lã e uma capa pesada — tudo para que um personagem se sinta quentinho mesmo nas regiões mais geladas de Arton. Um personagem usando um traje de frio recebe um bônus de +5 em testes de Fortitude para evitar dano por clima frio.',
    livroFonte: 'Guia da Trilogia'
  }
};

for (const [id, updates] of Object.entries(atualizacoes)) {
  const item = equipamentos.find(e => e.id === id);
  if (item) {
    Object.assign(item, updates);
  }
}

// 2. Novos equipamentos e itens mágicos / simbiontes
const novosItens = [
  {
    id: 'o_yoroi',
    nome: 'O-Yoroi',
    tipo: 'Armadura',
    categoria: 'Pesada',
    preco: '1.000 TO',
    bonusCa: 7,
    destrezaMaxima: '+2',
    penalidadeArmadura: -5,
    peso: '22kg',
    descricao: 'Usada pelos samurais de Tamu-ra, esta armadura é formada por pequenas placas metálicas unidas por nós de couro colorido. Inclui o kabuto, um elmo com uma máscara metálica.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'wakizashi_da_morte',
    nome: 'Wakizashi da Morte',
    tipo: 'Arma',
    categoria: 'Exótica',
    preco: 'Artefato Menor',
    dano: '1d8',
    critico: '19-20',
    alcance: '—',
    peso: '1kg',
    tipoDano: 'Corte e Perfuração',
    empunhadura: 'Leve',
    descricao: 'Esta espada curta tradicional de Tamu-ra (+1) costuma ser entregue ao Executor Imperial. Qualquer criatura inteligente que veja seu reflexo na lâmina irá enxergar o momento de sua própria morte. Um personagem que enxergue sua morte tem um bônus de +2 em CA e testes de resistência em qualquer combate antes do momento fatídico; no encontro que levará à sua morte, sofre -4 em CA e testes de resistência, e todos os acertos contra ele são considerados críticos.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'ruina_da_civilizacao',
    nome: 'Ruína da Civilização',
    tipo: 'Arma',
    categoria: 'Exótica',
    preco: 'Artefato',
    dano: '2d6',
    critico: '20/x4',
    alcance: '—',
    peso: '5kg',
    tipoDano: 'Corte',
    empunhadura: 'Duas mãos',
    descricao: 'Uma foice Enorme afiada anárquica de trespassar poderoso +4, com o poder anticriatura contra seres racionais (seu bônus mágico aumenta em +2 e ela causa +2d6 de dano contra criaturas com Inteligência 3 ou maior). Empunhada com fúria pelo centauro Trebane.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'escudo_de_azgher',
    nome: 'Escudo de Azgher',
    tipo: 'Escudo',
    categoria: 'Pesado',
    preco: 'Artefato',
    bonusCa: 3,
    destrezaMaxima: 'Ilimitada',
    penalidadeArmadura: -2,
    peso: '7kg',
    descricao: 'Belíssimo escudo pesado +3 feito de ouro, com a face de Azgher esculpida em sua superfície. Ao comando do usuário, emite um cone de luz de 12 metros que revela quaisquer ilusões ou efeitos de mudança de forma (forma selvagem, metamorfose, disfarces, espíritos e criaturas etéreas). O efeito dura 10 minutos, 1 vez por dia. Aura poderosa.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'armadura_cranio_negro',
    nome: 'Armadura de Crânio Negro',
    tipo: 'Armadura',
    categoria: 'Pesada',
    preco: 'Artefato',
    bonusCa: 9,
    destrezaMaxima: 'Ilimitada',
    penalidadeArmadura: 0,
    peso: '20kg',
    descricao: 'Armadura completa da fortificação moderada +5 (75% de chance de anular acertos críticos e ataques furtivos), esculpida com adornos sinistros e elmo em forma de crânio. Feita a partir das memórias de Ellisa Thorn, suas placas negras deslizam para proteger o portador sem atrapalhar movimentos ou acrobacias (penalidade 0 e destreza máxima ilimitada). Aura poderosa.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'tunica_da_fe',
    nome: 'Túnica da Fé',
    tipo: 'Item Geral',
    categoria: 'Item Mágico',
    preco: '50.000 TO',
    peso: '1kg',
    descricao: 'Esta vestimenta sagrada concede a seu usuário redução de dano 5/Maligna. Aura moderada (Criar Item Maravilhoso, pele rochosa).',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'capa_de_thyatis',
    nome: 'Capa de Thyatis',
    tipo: 'Item Geral',
    categoria: 'Item Mágico',
    preco: '10.000 TO',
    peso: '1kg',
    descricao: 'Esta elegante capa vermelha é abençoada por clérigos de Thyatis e dada a cavaleiros valorosos. Ela concede um bônus de +2 ao Carisma do personagem, além de resistência a fogo 5. Aura moderada.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'manto_do_morcego',
    nome: 'Manto do Morcego',
    tipo: 'Item Geral',
    categoria: 'Item Mágico',
    preco: '26.000 TO',
    peso: '1kg',
    descricao: 'Quando ativado, transforma o usuário em um morcego de tamanho Mínimo (voo 12m, +8 em Furtividade e percepção às cegas, sofrer -2 em testes sob luz solar). Aura moderada (Criar Itens Maravilhosos, metamorfose, voo).',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'manto_cinzento',
    nome: 'Manto Cinzento',
    tipo: 'Item Geral',
    categoria: 'Item Mágico',
    preco: '20.000 TO',
    peso: '1kg',
    descricao: 'Este manto puído e cinzento torna o usuário incrivelmente discreto, concedendo um bônus de +10 em testes de Furtividade e o benefício do talento Aparência Inofensiva (se já possuir o talento, a CD para resistir a ele aumenta em +5). Aura moderada.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'ferraduras_planares',
    nome: 'Ferraduras Planares',
    tipo: 'Item Geral',
    categoria: 'Artefato',
    preco: 'Artefato',
    peso: '4kg',
    descricao: 'Quando dispostas no chão, surge um grande cavalo com aparência fantasmagórica que galopa pelo ar até pousar cada casco sobre uma ferradura. Ele pode transportar um usuário (e apenas um) livremente por quaisquer Reinos Divinos do multiverso artoniano, com voo 24m, sem limite de usos ou distância diária. O cavaleiro não precisa de testes de Cavalgar e nunca é derrubado. Aura poderosa.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'calice_dos_deuses',
    nome: 'Cálice dos Deuses',
    tipo: 'Item Geral',
    categoria: 'Artefato',
    preco: 'Artefato',
    peso: '1kg',
    descricao: 'Cálice de metal trabalhado com motivos divinos de todo o Panteão. Transforma qualquer líquido colocado dentro dele em versão mágica e potável de hidromel. Criaturas inteligentes que bebem recebem 1 ponto de ação imediatamente, +4 em duas habilidades à sua escolha, +2 em todos os testes de resistência e imunidade a efeitos de medo por 24 horas, além de um talento (Duro de Matar) ou +8 em duas perícias. Aura poderosa.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'anel_felicidade_vallen',
    nome: 'Anel da Felicidade de Vallen',
    tipo: 'Item Geral',
    categoria: 'Artefato',
    preco: 'Artefato',
    peso: '0,1kg',
    descricao: 'Forjado pelos diabretes a partir das memórias de felicidade de Vallen Allond. É um anel de regeneração que oferece cura acelerada 2 e funciona mesmo que o usuário esteja morto (ressuscitando-o). O portador é assaltado por visões do guerreiro e sente uma compulsão doentia de protegê-lo e garantir sua felicidade. Aura poderosa.',
    livroFonte: 'Guia da Trilogia'
  },
  // Simbiontes da Tormenta
  {
    id: 'simbionte_bioarmadura',
    nome: 'Simbionte: Bioarmadura',
    tipo: 'Armadura',
    categoria: 'Simbionte',
    preco: '46.500 TO',
    bonusCa: 10,
    destrezaMaxima: 'Ilimitada',
    penalidadeArmadura: 0,
    peso: '0kg',
    descricao: 'Simbionte da Tormenta que se aloja na testa como uma tiara e, com ação livre, reveste todo o corpo com placas orgânicas. Concede CA +10, redução de dano 5/mágica, ferrão natural (1d8, perfuração, crítico x3) e dispensa respiração. Cada ativação consome 1 ponto de dano temporário de Inteligência e dura 3 rodadas + 1 rodada por talento da Tormenta do portador.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'simbionte_braquiolampreia',
    nome: 'Simbionte: Braquiolampreia',
    tipo: 'Item Geral',
    categoria: 'Simbionte',
    preco: '60.000 TO',
    peso: '0kg',
    descricao: 'Simbionte enguia de 50cm que se fixa no torso e atua como um terceiro braço/tentáculo de 1,5m sob o comando do hospedeiro. Permite segurar e usar uma arma extra ou realizar um ataque natural desarmado (1d6 de esmagamento com alcance de 3m). O tentáculo permite realizar um ataque adicional como se tivesse Combater com Duas Armas (ou dois ataques se tiver Combater com Duas Armas Maior).',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'simbionte_escorpiao_da_tempestade',
    nome: 'Simbionte: Escorpião da Tempestade',
    tipo: 'Escudo',
    categoria: 'Simbionte',
    preco: '16.000 TO',
    bonusCa: 1,
    destrezaMaxima: 'Ilimitada',
    penalidadeArmadura: 0,
    peso: '0kg',
    descricao: 'Simbionte preso ao antebraço que atua como escudo leve (+1 CA) e permite disparar rajadas de energia alienígena (ácido, eletricidade, fogo, frio ou sônico) com ação padrão (ataque de toque à distância até 27m). Causa 1d4 pontos de dano por talento da Tormenta (mínimo 2d4). Cada disparo causa 1 ponto de dano temporário de Sabedoria.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'simbionte_forjador',
    nome: 'Simbionte: Forjador',
    tipo: 'Item Geral',
    categoria: 'Simbionte',
    preco: '24.000 TO',
    peso: '0kg',
    descricao: 'Simbionte com aspecto de centopeia preso ao tronco. Com ação de movimento e sofrendo 1 ponto de dano temporário de Constituição, produz armas ósseas espontâneas de dureza igual ao aço (corpo a corpo ou arremesso) que causam 1 ponto de dano adicional por talento da Tormenta do hospedeiro. As armas duram 1 hora.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'simbionte_protese_rubra',
    nome: 'Simbionte: Prótese Rubra',
    tipo: 'Item Geral',
    categoria: 'Simbionte',
    preco: '16.000 TO',
    peso: '0kg',
    descricao: 'Substitui um membro ou órgão amputado, cancelando sequelas de ferimentos permanentes, ou recobre um membro concedendo uma mutação lefeu à escolha: Alcance natural +1,5m; Carapaça (+1 CA); Cérebro Lefeu (+2 Int); Garras (dano equivalente a espada curta); Órgãos reforçados (+4 Fortitude); Músculos lefeu (+2 em For, Des ou Con); Sangue da Tormenta (imune aos efeitos da área de Tormenta); ou Velocidade (+6m). Ativar o poder provoca 1 dano temporário de Sabedoria.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'simbionte_psinideo',
    nome: 'Simbionte: Psinídeo',
    tipo: 'Item Geral',
    categoria: 'Simbionte',
    preco: '24.000 TO',
    peso: '0kg',
    descricao: 'Simbionte em forma de aranha cerebral preso à cabeça do hospedeiro. Concede permanentemente +2 em Inteligência e Sabedoria. Além disso, pode lançar enfeitiçar pessoa, hipnotismo, pasmar e sono (CD 10 + metade do nível + número de talentos da Tormenta), sofrendo 1 ponto de dano temporário de Força por conjuração.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'simbionte_pterodraco',
    nome: 'Simbionte: Pterodraco',
    tipo: 'Item Geral',
    categoria: 'Simbionte',
    preco: '41.600 TO',
    peso: '0kg',
    descricao: 'Simbionte com concha e asas membranosas ancorado na coluna vertebral ("asas-de-dragão"). Concede deslocamento de voo igual ao dobro de seu deslocamento em terra. Graças a olhos extras do simbionte, o hospedeiro recebe +4 de bônus em testes de Percepção e não pode ser flanqueado.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'simbionte_visorg',
    nome: 'Simbionte: Visorg',
    tipo: 'Item Geral',
    categoria: 'Simbionte',
    preco: '57.000 TO',
    peso: '0kg',
    descricao: 'Simbionte semelhante a uma mão com grandes olhos vermelhos que se fixa ao rosto do hospedeiro substituindo seus olhos. Fornece visão no escuro 18m e +4 em Percepção. Permite lançar a magia vidência sem limite de utilizações diárias, causando 1 ponto de dano temporário de Destreza a cada uso.',
    livroFonte: 'Guia da Trilogia'
  }
];

let added = 0;
for (const item of novosItens) {
  if (!equipamentos.some(e => e.id === item.id)) {
    equipamentos.push(item);
    added++;
  }
}

fs.writeFileSync(path, JSON.stringify(equipamentos, null, 2), 'utf8');
console.log(`Itens adicionados aos equipamentos: ${added}. Total: ${equipamentos.length}`);

