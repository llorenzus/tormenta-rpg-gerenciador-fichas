const fs = require('fs');
const path = require('path');

const talentosFilePath = path.join(__dirname, '..', 'src', 'data', 'talentos', 'talentos.json');
const talentos = JSON.parse(fs.readFileSync(talentosFilePath, 'utf8'));

const novosTalentosTrilogia = [
  {
    id: 'ataque_piedoso',
    nome: 'Ataque Piedoso [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Devoto de Lena ou Marah.',
    beneficio: 'Você pode usar armas de corpo a corpo para causar dano não-letal sem sofrer a penalidade usual de –4 na jogada de ataque.',
    descricao: 'Você aprendeu a desferir golpes sem ferir letalmente, usando partes cegas da arma ou controlando o impacto.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'cura_gentil_talento',
    nome: 'Cura Gentil [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Carisma 13, tendência Bondosa, devoto de Lena ou Marah.',
    beneficio: 'Você adiciona seu modificador de Carisma aos pontos de vida restaurados por suas magias de cura (ex.: Carisma +2 cura 1d8+3 com curar ferimentos leves).',
    descricao: 'Sua compaixão e bondade genuína reforçam o efeito curativo de suas orações.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'discurso_conciliador',
    nome: 'Discurso Conciliador [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Treinado em Diplomacia, tendência Bondosa, devoto de Lena ou Marah.',
    beneficio: 'Você pode usar Diplomacia para mudar a atitude de uma criatura como uma ação completa sem sofrer penalidades no teste (em vez do habitual –10).',
    descricao: 'Sua fala mansa e convicta na paz desestabiliza agressões e evita derramamentos de sangue.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'maximizar_cura',
    nome: 'Maximizar Cura [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Cura 12 graduações, devoto de Lena.',
    beneficio: 'Suas magias de cura recuperam o número máximo possível de pontos de vida sem necessidade de rolagem de dados.',
    descricao: 'Suas preces restauram o vigor de maneira plena e perfeita.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'potencializar_cura',
    nome: 'Potencializar Cura [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Cura 6 graduações, devoto de Lena.',
    beneficio: 'Suas magias de cura recuperam 50% a mais de pontos de vida.',
    descricao: 'O fluxo curativo canalizado por suas mãos é mais volumoso e restaurador.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'olhos_agucados',
    nome: 'Olhos Aguçados [Regional]',
    categoria: 'Regional',
    preRequisitos: 'Nativo de Collen.',
    beneficio: 'Você recebe visão na penumbra. Além disso, pode repetir qualquer teste de Percepção visual recém-realizado (devendo aceitar o segundo resultado).',
    descricao: 'A marca exótica dos nativos de Collen garante uma visão aguçada e atenta.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'olhos_especiais',
    nome: 'Olhos Especiais [Regional]',
    categoria: 'Regional',
    preRequisitos: 'Nativo de Collen, Olhos Aguçados.',
    beneficio: 'Você pode escolher entre Visão no Escuro, Ver o Invisível ou Detectar Magia. O efeito escolhido permanece ativo constantemente.',
    descricao: 'Seus olhos heterocromáticos manifestam magia sensorial perene.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'olhos_do_destino',
    nome: 'Olhos do Destino [Regional]',
    categoria: 'Regional',
    preRequisitos: 'Nativo de Collen, Olhos Especiais.',
    beneficio: 'Pode lançar a magia Adivinhação à vontade sem componentes materiais. A cada uso deve realizar teste de Vontade CD 20; falhas acumulam fadiga, exaustão e inconsciência.',
    descricao: 'Suas pupilas revelam os desígnios ocultos do destino com um simples olhar para o vazio.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'paciente',
    nome: 'Paciente [Regional]',
    categoria: 'Regional',
    preRequisitos: 'Nativo de Callistia, Collen ou Hongari.',
    beneficio: 'Sofre penalidade de –2 em testes de Iniciativa, mas recebe bônus de +2 em testes de Vontade e em todas as perícias baseadas em Sabedoria.',
    descricao: 'A serenidade e calma de sua terra natal tornam sua mente imperturbável.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'prosperidade',
    nome: 'Prosperidade [Regional]',
    categoria: 'Regional',
    preRequisitos: 'Nativo de Deheon, Hershey, Sambúrdia ou Tyrondir.',
    beneficio: 'Você recebe 300 TO extras no dinheiro inicial e, no início de cada mês, recebe (100 × nível de personagem) TO enviados por sua família, patrono ou guilda.',
    descricao: 'Nascido em reinos ricos de Arton, seus recursos materiais e contatos comerciais são fartos.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'forca_da_fe',
    nome: 'Força da Fé [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'BBA +3, devoto de Kallyadranoch, Keenn, Megalokk, Ragnar ou Tauron.',
    beneficio: 'Pode converter uma magia divina preparada em energia muscular bruta, aumentando sua Força em +2 por nível da magia convertida durante 1 rodada.',
    descricao: 'Você canaliza a devoção guerreira em uma explosão muscular esmagadora.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'furia_guerreira',
    nome: 'Fúria Guerreira [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'BBA +3, devoto de Keenn, Khalmyr, Ragnar, Tauron ou Valkaria.',
    beneficio: 'Uma vez por dia, pode entrar em Fúria idêntica à de um bárbaro (+2 no ataque/dano, RD 1, –2 CA). Se já for bárbaro, recebe um uso diário adicional.',
    descricao: 'O fervor do deus da batalha desperta uma fúria primal e devastadora em seu peito.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'imunidade_contra_veneno',
    nome: 'Imunidade Contra Veneno [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Devoto de Sszzaas ou Tauron.',
    beneficio: 'Você recebe bônus de +4 em testes de Fortitude contra todos os tipos de venenos.',
    descricao: 'Seu organismo purga toxinas com facilidade mística e vigor taurino.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'pacto_com_a_serpente',
    nome: 'Pacto com a Serpente [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Capacidade de lançar magias divinas de 3º nível, devoto de Tauron.',
    beneficio: 'Uma vez por dia, pode lançar Invocar Monstro IV para convocar 1d3 dragoas-caçadoras de Galrasia leais ao seu comando.',
    descricao: 'Ligado à face primordial da Divina Serpente de Tauron, você conjura sauroides selvagens das profundezas.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'sangue_de_ferro',
    nome: 'Sangue de Ferro [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Capacidade de lançar magias divinas de 3º nível, devoto de Keenn ou Tauron.',
    beneficio: 'Uma vez por dia, transforma seu sangue em ferro líquido por 1 minuto por nível: recebe Força +4, Redução de Dano 10/adamante e seus golpes desarmados causam dano de clava.',
    descricao: 'Seu sangue se transmuta em metal resistente, tornando sua carne impenetrável.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'ginga_das_ondas',
    nome: 'Ginga das Ondas [Perícia]',
    categoria: 'Perícia',
    preRequisitos: 'Acrobacia 4 graduações.',
    beneficio: 'Recebe +1 em testes de Reflexos. Além disso, em embarcações nunca precisa fazer testes de Acrobacia para ficar de pé e não sofre penalidades em testes ao navegar.',
    descricao: 'Você se move pelo convés de navios e superfícies oscilantes com perfeito equilíbrio marítimo.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'falange',
    nome: 'Falange [Combate]',
    categoria: 'Combate',
    preRequisitos: 'Usar Escudo.',
    beneficio: 'Ao usar escudo, recebe +1 na CA. Se estiver adjacente a pelo menos um aliado com este talento, podem gastar ação de movimento para formar uma falange impenetrável concedendo cobertura a todos os participantes.',
    descricao: 'Você treinou para travar escudos lado a lado com seus companheiros como as antigas legiões.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'parede_de_escudos',
    nome: 'Parede de Escudos [Combate]',
    categoria: 'Combate',
    preRequisitos: 'Falange.',
    beneficio: 'Enquanto participar de uma falange, pode realizar um ataque corpo a corpo imediato como ataque de oportunidade contra qualquer criatura que se mova para ficar adjacente a você ou a um aliado da formação (1x/rodada).',
    descricao: 'Sua formação de escudos pune impiedosamente qualquer inimigo que tente se aproximar da linha.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'inspiracao_anilatir',
    nome: 'Inspiração [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Devoto de Anilatir.',
    beneficio: 'Você recebe 1 ponto de ação adicional a cada sessão de jogo.',
    descricao: 'A deusa menor da inspiração agracia seus protegidos com lampejos súbitos de heroísmo e genialidade.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'alma_livre',
    nome: 'Alma Livre [Destino]',
    categoria: 'Destino',
    preRequisitos: 'Nenhum.',
    beneficio: 'Você pode ignorar qualquer pré-requisito de tendência de classes básicas e classes de prestígio (por exemplo, pode ser um bárbaro Leal ou um monge Caótico).',
    descricao: 'Sua mente e espírito não se prendem a dogmas morais rígidos, trilhando seu próprio caminho.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'homem_dos_sete_instrumentos',
    nome: 'Homem dos Sete Instrumentos [Perícia]',
    categoria: 'Perícia',
    preRequisitos: 'Inteligência 13.',
    beneficio: 'Pode realizar testes de perícias que exigem treinamento mesmo sem ser treinado nelas. Além disso, recebe bônus de +1 em testes de perícias em que não é treinado.',
    descricao: 'Um polímata autodidata capaz de improvisar em qualquer ofício, mecanismo ou conhecimento.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'meditacao_autoafirmativa',
    nome: 'Meditação Autoafirmativa [Destino]',
    categoria: 'Destino',
    preRequisitos: 'Sabedoria 13, Carisma 17, Vontade de Ferro.',
    beneficio: 'Pode meditar por um dia inteiro e fazer teste de Carisma para receber um bônus por 1 dia: CD 15 (+1 ataques), CD 20 (+2 ataques), CD 25 (+3 ataques), CD 17 (+1 perícia), CD 20 (+2 CA ou +3 resistências) ou CD 22 (um talento cujos pré-requisitos cumpra).',
    descricao: 'Ao convencer a si mesmo de sua própria grandeza mística em transe hipnótico, você materializa esse poder.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'sete_escorpioes',
    nome: 'Sete Escorpiões [Combate]',
    categoria: 'Combate',
    preRequisitos: 'Destreza 19, Combater com Duas Armas, Saque Rápido, BBA +8.',
    beneficio: 'Se gastar uma ação padrão para atacar, pode fazer um ataque extra imediato utilizando uma arma diferente das que já usou nesta mesma rodada.',
    descricao: 'O estilo marcial de Tex Mako: alternar freneticamente entre adagas, bestas e katanas em um turbilhão de golpes letais.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'ataque_com_escudo',
    nome: 'Ataque com Escudo [Combate]',
    categoria: 'Combate',
    preRequisitos: 'Usar Escudo.',
    beneficio: 'Usando um escudo, pode fazer um ataque adicional com ele com penalidade de –2 nas jogadas de ataque da rodada; você perde o bônus de CA do escudo até o início de seu próximo turno.',
    descricao: 'Você golpeia com a borda de seu escudo como uma arma secundária contundente.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'amigo_dos_animais',
    nome: 'Amigo dos Animais [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Devoto de Allihanna.',
    beneficio: 'Recebe a habilidade Empatia Selvagem como um druida de nível igual ao seu nível de personagem (ou +4 no teste caso já a possua).',
    descricao: 'Os animais dos ermos compreendem que você não representa perigo e respondem com docilidade.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'forma_selvagem_adicional',
    nome: 'Forma Selvagem Adicional [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Devoto de Allihanna, Megalokk ou Oceano, habilidade de Forma Selvagem.',
    beneficio: 'Você pode utilizar a habilidade de classe Forma Selvagem duas vezes adicionais por dia. Pode ser escolhido várias vezes.',
    descricao: 'A bênção das feras permite alternar de forma natural mais vezes durante a jornada.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'garras_de_fera',
    nome: 'Garras de Fera [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Devoto de Allihanna, Megalokk ou Oceano, capacidade de lançar magias divinas.',
    beneficio: 'Suas mãos podem se transformar em garras afiadas (dano de espada curta para seu tamanho) como ação livre por até 1 hora por dia (pode atacar com ambas com –4 no ataque).',
    descricao: 'Garras predatórias brotam das pontas dos seus dedos prontas para lacerar oponentes.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'memoria_racial',
    nome: 'Memória Racial [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Devoto de Allihanna ou Megalokk.',
    beneficio: 'Você recebe bônus de +4 em testes de Sobrevivência e +1 na Classe de Armadura enquanto estiver em terreno natural.',
    descricao: 'Instintos ancestrais de sobrevivência ecoam no seu sangue diante da terra virgem.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'voz_de_allihanna',
    nome: 'Voz de Allihanna [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Domínio dos Animais, devoto de Allihanna.',
    beneficio: 'Você pode lançar Dominar Animal uma vez por dia como uma habilidade similar a magia.',
    descricao: 'Sua voz ecoa a autoridade amorosa da Mãe Natureza pacificando feras.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'arma_secundaria_grande',
    nome: 'Arma Secundária Grande [Combate]',
    categoria: 'Combate',
    preRequisitos: 'Combater com Duas Armas, Força 15.',
    beneficio: 'Você pode empunhar duas armas de uma mão normais (como duas espadas longas ou machados) com o talento Combater com Duas Armas sem penalidades extras além das usuais.',
    descricao: 'Sua musculatura e coordenação permitem manejar armas de tamanho pleno em ambas as mãos.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'chuva_de_golpes',
    nome: 'Chuva de Golpes [Combate]',
    categoria: 'Combate',
    preRequisitos: 'Ataque Desarmado Aprimorado, Combater com Duas Armas Aprimorado.',
    beneficio: 'Quando usa o talento Combater com Duas Armas, você recebe um ataque desarmado adicional na rodada (como uma cabeçada, joelhada ou chute).',
    descricao: 'Em combate cerrado, cada centímetro de seu corpo atua como uma arma mortal.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'dom_da_fenix',
    nome: 'Dom da Fênix [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Devoto de Thyatis.',
    beneficio: 'Você recebe resistência a fogo 5 permanente.',
    descricao: 'O fogo sagrado da ave da ressurreição acolhe e protege suas carnes.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'dom_da_imortalidade',
    nome: 'Dom da Imortalidade [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Detectar o Mal como habilidade de classe, devoto de Thyatis.',
    beneficio: 'Você é imortal. Sempre que morrer (exceto por sua "Morte Final" predestinada), seu corpo ressurge intacto após 3d6 dias sem perda de níveis ou Constituição.',
    descricao: 'A promessa solene do Deus da Ressurreição garante seu retorno à vida em nome da segunda chance.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'dom_da_profecia',
    nome: 'Dom da Profecia [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Devoto de Thyatis ou Allihanna.',
    beneficio: 'Pode lançar Augúrio uma vez por dia sem gastar PM. Além disso, 1 vez/dia recebe +2 de bônus em qualquer teste após rolar o dado mas antes do resultado ser declarado.',
    descricao: 'Visões fugazes do futuro revelam os caminhos do sucesso em momentos cruciais.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'dom_da_ressurreicao',
    nome: 'Dom da Ressurreição [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Capacidade de lançar magias divinas, devoto de Thyatis.',
    beneficio: 'Pode lançar Ressurreição uma vez por mês sem custo de componentes materiais (o conjurador deve passar em teste de Sabedoria CD 10 ou a pessoa ressuscitada recebe uma missão divina).',
    descricao: 'Você pode conceder uma segunda chance de vida aos mortos em nome de Thyatis.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'arma_sagrada',
    nome: 'Arma Sagrada [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'BBA +8, tendência Bondosa, devoto de Azgher, Khalmyr, Lena, Lin-Wu, Thyatis ou Valkaria.',
    beneficio: 'Escolha uma arma específica (como espada longa). Enquanto empunhar uma arma desse tipo, ela recebe bônus divino de +1 em jogadas de ataque e dano (acumula com bônus mágicos; pode ser escolhido até 5 vezes, para até +5).',
    descricao: 'O poder sagrado de sua divindade abençoa diretamente sua lâmina em combate.',
    livroFonte: 'Guia da Trilogia'
  },
  {
    id: 'destruir_o_mal_adicional',
    nome: 'Destruir o Mal Adicional [Poder Concedido]',
    categoria: 'Poderes Concedidos',
    preRequisitos: 'Destruir o mal como habilidade de classe, devoto de Azgher, Khalmyr ou Thyatis.',
    beneficio: 'Você pode usar a habilidade Destruir o Mal duas vezes adicionais por dia.',
    descricao: 'Sua cruzada contra as trevas queima com combustível sagrado abundante.',
    livroFonte: 'Guia da Trilogia'
  }
];

let inseridos = 0;
for (const nt of novosTalentosTrilogia) {
  const idx = talentos.findIndex(t => t.id === nt.id);
  if (idx >= 0) {
    talentos[idx] = nt;
    console.log(`Atualizado talento: ${nt.nome}`);
  } else {
    talentos.push(nt);
    inseridos++;
    console.log(`Adicionado talento: ${nt.nome}`);
  }
}

fs.writeFileSync(talentosFilePath, JSON.stringify(talentos, null, 2), 'utf8');
console.log(`Sucesso: ${inseridos} talentos do Guia da Trilogia adicionados. Total: ${talentos.length}`);
