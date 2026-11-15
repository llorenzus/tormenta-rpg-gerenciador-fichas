const fs = require('fs');
const path = require('path');

const racasFilePath = path.join(__dirname, '..', 'src', 'data', 'racas', 'racas.json');
const racas = JSON.parse(fs.readFileSync(racasFilePath, 'utf8'));

const novasRacas = [
  {
    id: 'aggelus',
    nome: 'Aggelus',
    modificadoresAtributos: '+4 Sabedoria, +2 Carisma',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Sabedoria, +2 Carisma. Aggelus herdam a serenidade, prudência e magnetismo gracioso dos anjos planares.'
      },
      {
        nome: 'Espírito',
        descricao: 'Aggelus não são considerados humanoides; são imunes a efeitos que afetam apenas humanoides, mas afetados normalmente por magias direcionadas a espíritos. Podem ser revividos normalmente por magias de ressurreição.'
      },
      {
        nome: 'Visão no Escuro',
        descricao: 'Aggelus enxergam no escuro a até 18 metros apenas em preto e branco e ignoram camuflagem (incluindo camuflagem total) gerada por escuridão.'
      },
      {
        nome: 'Luz do Dia',
        descricao: 'Aggelus podem lançar a magia Luz do Dia uma vez por dia como uma habilidade similar a magia.'
      },
      {
        nome: 'Resistência a Energias',
        descricao: 'Aggelus possuem resistência a ácido 5, frio 5 e eletricidade 5.'
      }
    ],
    descricao: 'Descendentes de humanos e seres celestiais dos reinos de luz e justiça. Dotados de olhos dourados ou prateados, halos sutis ou plumas discretas, os aggelus são vistos como arautos do bem e da proteção.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'bugbear',
    nome: 'Bugbear',
    modificadoresAtributos: '+4 Força, +2 Destreza, –2 Carisma',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Força, +2 Destreza, –2 Carisma. Bugbears combinam força bruta avassaladora com agilidade surpreendente, mas sua natureza brutal dificulta o trato social.'
      },
      {
        nome: 'Grandão',
        descricao: 'Bugbears recebem o talento Grandão como talento adicional, mesmo sem cumprir seus pré-requisitos, podendo empunhar armas de uma categoria de tamanho maior.'
      },
      {
        nome: 'Visão no Escuro',
        descricao: 'Enxergam no escuro a até 18 metros em preto e branco, ignorando camuflagem por escuridão.'
      },
      {
        nome: 'Faro',
        descricao: 'Detectam automaticamente criaturas a até 9 metros e recebem +4 em testes de Sobrevivência para rastrear com faro.'
      },
      {
        nome: 'Furtivo e Aterrorizante',
        descricao: 'Recebem bônus racial de +4 em testes de Furtividade e de Intimidação.'
      }
    ],
    descricao: 'Os maiores e mais perigosos entre os goblinoides. Fortes como ursos e silenciosos como sombras, os bugbears são predadores implacáveis e brutais soldados de infantaria de elite.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'centauro',
    nome: 'Centauro',
    modificadoresAtributos: '+4 Força, +2 Sabedoria, –2 Inteligência',
    tamanho: 'Grande',
    deslocamento: '12m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Força, +2 Sabedoria, –2 Inteligência. Centauros possuem a potência física e sintonia natural da vida selvagem, embora desprezem a erudição acadêmica.'
      },
      {
        nome: 'Criatura Grande',
        descricao: 'Tamanho Grande (espaço 3m, alcance 1,5m). Sofrem –1 na Classe de Armadura e jogadas de ataque, –4 em Furtividade e recebem +4 em testes de manobras contra criaturas Médias.'
      },
      {
        nome: 'Cascos Poderosos',
        descricao: 'Possuem ataque natural de cascos (1d6 esmagamento). Podem atacar com armas e cascos na mesma rodada com penalidade de –4 em todas as jogadas de ataque.'
      },
      {
        nome: 'Filho dos Ermos',
        descricao: 'Recebem bônus racial de +4 em testes de Sobrevivência.'
      },
      {
        nome: 'Medo de Altura',
        descricao: 'Se estiverem a mais de 3m de altura ou perto de precipícios sem proteção, sofrem penalidade de –4 em jogadas e testes e não conseguem se concentrar para lançar magias.'
      }
    ],
    descricao: 'Criaturas nobres e orgulhosas com torso de humano e corpo de cavalo. Vivem em bandos nômades pelas planícies verdejantes de Arton, prezando a liberdade, a arquearia e a honra guerreira.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'elfo_do_ceu',
    nome: 'Elfo-do-Céu',
    modificadoresAtributos: '+4 Destreza, +2 Carisma, –2 Constituição',
    tamanho: 'Médio',
    deslocamento: '9m (Voo 18m)',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Destreza, +2 Carisma, –2 Constituição. Extremamente graciosos, ágeis e de beleza celestial, porém com estrutura física leve e delicada.'
      },
      {
        nome: 'Asas Emplumadas e Voo',
        descricao: 'Possuem grandes asas com penas que concedem deslocamento de voo de 18 metros.'
      },
      {
        nome: 'Visão na Penumbra',
        descricao: 'Ignoram camuflagem (exceto camuflagem total) causada por escuridão ou pouca luz.'
      },
      {
        nome: 'Tradição Élfica em Armas',
        descricao: 'Sabem usar espadas curtas, espadas longas, floretes e todos os tipos de arco (curtos, longos e compostos).'
      },
      {
        nome: 'Sentidos Aguçados',
        descricao: 'Recebem +4 em testes de Percepção.'
      },
      {
        nome: 'Mente Livre',
        descricao: 'Recebem +4 em testes de Vontade contra efeitos de Encantamento e são imunes à magia Sono.'
      }
    ],
    descricao: 'Elfos alados com belas asas plumadas que habitam montanhas inalcançáveis, torres altíssimas e cidades voadoras. Alegres, amantes do vento e do céu aberto, prezam a independência acima de tudo.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'gnoll',
    nome: 'Gnoll',
    modificadoresAtributos: '+4 Constituição, +2 Sabedoria, –2 Inteligência',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Constituição, +2 Sabedoria, –2 Inteligência. Carniceiros incansáveis, rústicos e astutos nos ermos, mas limitados em raciocínio abstrato.'
      },
      {
        nome: 'Pelo Grosso',
        descricao: 'Sua pelagem densa e couro resistente concedem +1 na Classe de Armadura.'
      },
      {
        nome: 'Faro Voraz',
        descricao: 'Detectam criaturas a até 9m e recebem +4 em testes de Sobrevivência para rastrear pelo cheiro.'
      },
      {
        nome: 'Mordida Voraz',
        descricao: 'Possuem ataque natural de mordida (1d6 de dano de corte). Pode atacar com arma e mordida sofrendo –4 em todas as jogadas.'
      },
      {
        nome: 'Visão na Penumbra',
        descricao: 'Ignoram camuflagem provocada por penumbra e pouca luminosidade.'
      }
    ],
    descricao: 'Humanoides hienas implacáveis das savanas e ermos quentes. Conhecidos pelo riso histérico e táticas de cerco, caçam em matilhas cruéis e veneram deuses selvagens da matança.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'hobgoblin',
    nome: 'Hobgoblin',
    modificadoresAtributos: '+4 Constituição, +2 Destreza, –2 Carisma',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Constituição, +2 Destreza, –2 Carisma. Resistentes e rápidos, mas com postura marcial austera e inflexível.'
      },
      {
        nome: 'Visão no Escuro',
        descricao: 'Enxergam no escuro a até 18 metros apenas em preto e branco.'
      },
      {
        nome: 'Doutrina Militar',
        descricao: 'Sabem usar duas armas marciais à sua escolha e recebem bônus de +2 em testes de Iniciativa e Percepção.'
      },
      {
        nome: 'Disciplina de Ferro',
        descricao: 'Recebem bônus de +2 em testes de resistência contra medo e efeitos mentais quando estiverem adjacentes a pelo menos um aliado.'
      }
    ],
    descricao: 'Os mais disciplinados e militaristas entre os goblinoides. A espinha dorsal da infame Aliança Negra, vivem sob rígida hierarquia guerreira onde a fraqueza é punida com a morte e a eficiência marcial é a maior virtude.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'medusa',
    nome: 'Medusa',
    modificadoresAtributos: '+4 Carisma, +2 Destreza, –2 Força',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Carisma, +2 Destreza, –2 Força. Dotadas de beleza hipnótica, postura sedutora e reflexos rápidos, embora possuam força física mediana.'
      },
      {
        nome: 'Monstro',
        descricao: 'Medusas são do tipo Monstro, sendo imunes a efeitos que afetam exclusivamente humanoides.'
      },
      {
        nome: 'Visão no Escuro',
        descricao: 'Enxergam no escuro a até 18 metros em preto e branco.'
      },
      {
        nome: 'Serpentes Venenosas',
        descricao: 'Sua cabeleira de víboras vivas desfere um ataque natural secundário (1d4 perfurante + veneno: Fortitude CD 10 + 1/2 nível + mod. Con ou sofre 1d4 de dano de Força).'
      },
      {
        nome: 'Olhar Aterrador',
        descricao: 'A partir do 5º nível, pode focar seu olhar como ação padrão para forçar um oponente a até 9m a realizar teste de Fortitude (CD 10 + metade do nível + mod. Car) ou ficar atordoado por 1 rodada. A partir do 10º nível, falha por 5 ou mais petrifica permanentemente o alvo.'
      }
    ],
    descricao: 'Mulheres fatais de traços voluptuosos e serpentes sibilantes no lugar dos cabelos. Mestras da intriga e do arco, habitam ruínas e palacetes luxuosos ocultando a verdadeira natureza sob véus encantados.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'meio_driade',
    nome: 'Meio-Dríade',
    modificadoresAtributos: '+4 Sabedoria, +2 Destreza, –2 Inteligência',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Sabedoria, +2 Destreza, –2 Inteligência. Ligadas intrinsecamente aos espíritos vegetais e à floresta viva, com sentidos aguçados mas pouca afinidade acadêmica.'
      },
      {
        nome: 'Empatia Selvagem',
        descricao: 'Recebem a habilidade Empatia Selvagem. Se a classe já fornecer, recebem +4 em testes de Diplomacia com animais.'
      },
      {
        nome: 'Magias Naturais Inatas',
        descricao: 'Podem lançar Constrição, Torcer Madeira, Moldar Madeira, Forma de Árvore e Pele de Árvore (apenas em si mesmas) livremente sem gastar PM. Em ambientes estéreis ou malditos precisam ser bem-sucedidas em teste de Vontade CD 15 para conjurá-las.'
      },
      {
        nome: 'Sentidos da Natureza',
        descricao: 'Recebem bônus racial de +4 em testes de Percepção e de Sobrevivência.'
      }
    ],
    descricao: 'Filhas de humanos e dríades ou ninfas da floresta. Carregam traços vegetais sutis como folhas nos cabelos, pele com textura de seiva e perfume de flores silvestres.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'minauro',
    nome: 'Minauro',
    modificadoresAtributos: '+2 Força, +2 em outro atributo (exceto Carisma)',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+2 Força e +2 em outro atributo à escolha do jogador (exceto Carisma).'
      },
      {
        nome: 'Chifres Táuricos',
        descricao: 'Possuem chifres menores que concedem ataque natural de chifres (1d6 perfurante).'
      },
      {
        nome: 'Couro Rígido',
        descricao: 'Recebem bônus de armadura natural de +1 na Classe de Armadura.'
      },
      {
        nome: 'Faro',
        descricao: 'Detectam criaturas a até 9 metros e recebem +4 em testes de Sobrevivência para rastrear.'
      },
      {
        nome: 'Livre de Fobias',
        descricao: 'Diferente dos minotauros puros, os minauros não possuem medo patológico de altura.'
      }
    ],
    descricao: 'Descendentes de minotauros e humanos. Tanto machos quanto fêmeas existem na espécie, reunindo a força e firmeza táurica com a adaptabilidade e mente aberta da humanidade.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'nagah',
    nome: 'Nagah',
    modificadoresAtributos: 'Fêmeas: +4 Sabedoria, +2 Inteligência, –2 Con | Machos: +4 Força, +2 Destreza, –2 Int',
    tamanho: 'Médio',
    deslocamento: '9m (Natação 9m)',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos por Sexo',
        descricao: 'Fêmeas: +4 Sabedoria, +2 Inteligência, –2 Constituição (governantes e sacerdotisas místicas). Machos: +4 Força, +2 Destreza, –2 Inteligência (guerreiros e caçadores velozes).'
      },
      {
        nome: 'Cauda Serpentina',
        descricao: 'Possuem uma cauda no lugar das pernas, conferindo deslocamento terrestre 9m, deslocamento de natação 9m e ataque natural de cauda (1d6 esmagamento).'
      },
      {
        nome: 'Escamas Protetoras',
        descricao: 'Recebem +4 nos testes de Fortitude contra venenos e +1 na CA.'
      },
      {
        nome: 'Dissimulada',
        descricao: 'Recebem bônus racial de +4 em testes de Enganação.'
      },
      {
        nome: 'Audição Deficiente',
        descricao: 'Sofrem penalidade de –2 em testes de Percepção para ouvir.'
      },
      {
        nome: 'Sensibilidade a Bardos e Frio',
        descricao: 'Sofrem –4 em testes de resistência contra magias e música de bardos, e –4 em testes contra frio e gelo.'
      },
      {
        nome: 'Visão na Penumbra',
        descricao: 'Ignoram camuflagem por escuridão parcial.'
      }
    ],
    descricao: 'Povo serpentino ancestral com torso humanoide e longa cauda de serpente. Veneram a Grande Serpente e possuem sociedade matriarcal dividida entre sacerdotisas intelectuais e machos combatentes ferozes.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'orc',
    nome: 'Orc',
    modificadoresAtributos: '+4 Força, +2 Constituição, –2 Inteligência',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Força, +2 Constituição, –2 Inteligência. Combatentes brutais e de musculatura densa, com mentalidade voltada para a dominação física.'
      },
      {
        nome: 'Brutalidade',
        descricao: 'Orcs recebem um bônus de +1 nas jogadas de dano corpo a corpo.'
      },
      {
        nome: 'Visão no Escuro',
        descricao: 'Enxergam no escuro a até 18 metros apenas em preto e branco.'
      },
      {
        nome: 'Intimidação e Mineração',
        descricao: 'Recebem bônus racial de +4 em testes de Intimidação e de Ofício (minerador).'
      },
      {
        nome: 'Sensibilidade à Luz',
        descricao: 'Ficam ofuscados (–1 em jogadas de ataque) sob luz solar direta ou sob a magia Luz do Dia.'
      }
    ],
    descricao: 'Guerreiros rústicos das montanhas e subterrâneos. Fortes, belicosos e acostumados às intempéries mais severas, os orcs prezam a liderança pela força e a honra em combate sangrento.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'sulfure',
    nome: 'Sulfure',
    modificadoresAtributos: '+4 Destreza, +2 Inteligência, –2 Carisma',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Destreza, +2 Inteligência, –2 Carisma. Herdam a agilidade traiçoeira e a astúcia cruel dos demônios e diabos, mas sua aura sombria repele as pessoas.'
      },
      {
        nome: 'Espírito',
        descricao: 'Sulfure são do tipo Espírito. São imunes a magias que afetam exclusivamente humanoides, e podem ser ressuscitados normalmente.'
      },
      {
        nome: 'Visão no Escuro',
        descricao: 'Enxergam no escuro a até 18 metros em preto e branco, ignorando camuflagem total por escuridão.'
      },
      {
        nome: 'Magia de Escuridão',
        descricao: 'Podem lançar a magia Escuridão uma vez por dia como habilidade similar a magia.'
      },
      {
        nome: 'Resistência Infernal',
        descricao: 'Possuem resistência a fogo 5, frio 5 e eletricidade 5.'
      },
      {
        nome: 'Astúcia Sinistra',
        descricao: 'Recebem bônus racial de +2 em testes de Enganação e de Furtividade.'
      }
    ],
    descricao: 'Humanoides tocados pelo sangue das profundezas infernais ou abissais. Com olhos brilhantes sem pupilas, chifres discretos, dentes afiados ou cauda fina, os sulfure lidam com o estigma da mácula maligna.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'finntroll',
    nome: 'Finntroll',
    modificadoresAtributos: '+4 Inteligência, +2 Constituição, –2 Força',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Inteligência, +2 Constituição, –2 Força. Mestres da magia arcana e da tirania subterrânea, inteligentes e robustos, mas fisicamente mais frágeis que os trolls brutos.'
      },
      {
        nome: 'Monstro',
        descricao: 'Finntrolls são monstros e não são considerados humanoides para efeitos de magias.'
      },
      {
        nome: 'Visão no Escuro',
        descricao: 'Enxergam perfeitamente na escuridão até 18 metros.'
      },
      {
        nome: 'Corpo Fúngico',
        descricao: 'Compostos de fibras fúngicas e matéria viva bizarra, são imunes a atordoamento, metamorfose, paralisia e veneno, mas suscetíveis a magias que afetam plantas.'
      },
      {
        nome: 'Regeneração Trolls',
        descricao: 'Recuperam pontos de vida por hora em vez de por dia, mas essa regeneração é anulada enquanto expostos à luz do sol direta.'
      },
      {
        nome: 'Resistência a Feitiços',
        descricao: 'Recebem bônus de +2 em testes de resistência contra magias.'
      },
      {
        nome: 'Sensibilidade à Luz',
        descricao: 'Sofrem penalidade de –1 em jogadas de ataque sob luz solar direta ou a magia Luz do Dia.'
      }
    ],
    descricao: 'Os nobres trolls de cabelos negros e elegância gélida dos subterrâneos de Trollkyrkja. Escravagistas sádicos e conjuradores temíveis, combinam aristocracia refinada com crueldade inumana.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'trog',
    nome: 'Trog',
    modificadoresAtributos: '+4 Constituição, +2 Força, –2 Inteligência',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Constituição, +2 Força, –2 Inteligência. Trogloditas répteis extremamente resistentes e fortes, moldados pela sobrevivência implacável nas cavernas.'
      },
      {
        nome: 'Visão no Escuro',
        descricao: 'Enxergam no escuro a até 27 metros apenas em preto e branco.'
      },
      {
        nome: 'Mau-Cheiro',
        descricao: 'Como ação de movimento, libera secreção nauseante: criaturas adjacentes devem ser bem-sucedidas em teste de Fortitude (CD 14) ou ficam enjoadas por 1d6 rodadas.'
      },
      {
        nome: 'Pele Camaleônica',
        descricao: 'Recebem bônus racial de +8 em testes de Furtividade quando não estiverem usando armaduras.'
      },
      {
        nome: 'Mordida Voraz',
        descricao: 'Possuem ataque natural de mordida (1d4 perfurante).'
      },
      {
        nome: 'Sangue Frio',
        descricao: 'Sofrem 1 ponto de dano adicional por dado de dano recebido de ataques de frio ou gelo.'
      }
    ],
    descricao: 'Povo réptil primitivo das entranhas da terra. Furtivos, brutais e com um ódio profundo pelos anões, os trogs são caçadores de emboscada implacáveis nos túneis escuros de Arton.',
    livroFonte: 'Manual das Raças'
  },

  // --- OS 4 POVOS-TROVÃO (SAUROIDES DE GALRASIA) ---
  {
    id: 'cacadoras',
    nome: 'Caçadoras (Povo-Trovão)',
    modificadoresAtributos: '+4 Destreza, +2 Constituição, –2 Inteligência',
    tamanho: 'Médio',
    deslocamento: '9m (Escalada 6m)',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Destreza, +2 Constituição, –2 Inteligência. Ágeis, vigorosas e velozes, com instintos predatórios apurados.'
      },
      {
        nome: 'Garras e Mordida',
        descricao: 'Possuem garras (1d4 corte cada) e mordida (1d6 perfuração) como armas naturais.'
      },
      {
        nome: 'Faro Voraz',
        descricao: 'Detectam presenças a até 9m e recebem +4 em testes de Sobrevivência para rastrear pelo cheiro.'
      },
      {
        nome: 'Recuperação Rápida',
        descricao: 'Recuperam 1 ponto de vida por nível de personagem a cada 1 hora de descanso, em vez de 1 por dia.'
      },
      {
        nome: 'Aptidão Selvagem',
        descricao: 'Recebem bônus racial de +4 em testes de Atletismo e de Sobrevivência, e +4 em testes para usar cordas.'
      },
      {
        nome: 'Visão na Penumbra',
        descricao: 'Ignoram camuflagem provocada por penumbra.'
      }
    ],
    descricao: 'As dragoas-caçadoras da lendária Ilha de Galrasia. Ágeis velocirraptoras humanoides que caçam em bandos matriarcais perfeitamente coordenados e dominam a floresta pré-histórica.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'ceratops',
    nome: 'Ceratops (Povo-Trovão)',
    modificadoresAtributos: '+4 Constituição, +2 Força, –2 Inteligência',
    tamanho: 'Médio',
    deslocamento: '9m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Constituição, +2 Força, –2 Inteligência. Corpulentos, maciços e inabaláveis, com couraças espessas e mente simples.'
      },
      {
        nome: 'Grandão',
        descricao: 'Recebem o talento Grandão como talento adicional, podendo empunhar armas de tamanho Grande.'
      },
      {
        nome: 'Chifres Mortais',
        descricao: 'Possuem arma natural de chifres (1d6 esmagamento/perfuração). Podem atacar com armas e chifres com –4 no ataque.'
      },
      {
        nome: 'Investida Poderosa',
        descricao: 'Quando realizam uma manobra ou ataque de investida, causam 2d6 pontos de dano adicionais.'
      },
      {
        nome: 'Visão na Penumbra',
        descricao: 'Ignoram camuflagem parcial por penumbra.'
      }
    ],
    descricao: 'Sauroides maciços com cristas ósseas e chifres como os grandes tricerátopos de Galrasia. São guerreiros firmes e defensores territoriais pacíficos, a menos que provocados.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'pteros',
    nome: 'Pteros (Povo-Trovão)',
    modificadoresAtributos: '+4 Destreza, +2 Sabedoria, –2 Constituição',
    tamanho: 'Médio',
    deslocamento: '9m (Voo 12m)',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Destreza, +2 Sabedoria, –2 Constituição. Voadores rápidos e atentos com cristas aerodinâmicas, mas de constituição física mais esguia.'
      },
      {
        nome: 'Asas de Pterodáctilo',
        descricao: 'Possuem asas membranosas ligadas aos braços concedendo deslocamento de voo de 12 metros.'
      },
      {
        nome: 'Garras de Rapina',
        descricao: 'Possuem garras nos pés (1d4 corte) que podem ser desferidas como ataque natural enquanto estiverem em voo.'
      },
      {
        nome: 'Visão Aguçada',
        descricao: 'Recebem bônus racial de +4 em testes de Percepção.'
      },
      {
        nome: 'Visão na Penumbra e Faro',
        descricao: 'Ignoram camuflagem parcial e detectam criaturas pelo faro a até 9m.'
      }
    ],
    descricao: 'Antropossauros alados semelhantes a pteranodontes inteligentes que dominam as copas das árvores titânicas e os vulcões de Galrasia, mergulhando dos céus com precisão mortal.',
    livroFonte: 'Manual das Raças'
  },
  {
    id: 'velocis',
    nome: 'Velocis (Povo-Trovão)',
    modificadoresAtributos: '+4 Destreza, +2 Sabedoria, –2 Inteligência',
    tamanho: 'Médio',
    deslocamento: '12m',
    tracosRaciais: [
      {
        nome: 'Ajuste de Atributos',
        descricao: '+4 Destreza, +2 Sabedoria, –2 Inteligência. Notavelmente velozes e atentos ao ambiente, com reflexos afiados e instinto de sobrevivência puro.'
      },
      {
        nome: 'Velocidade Sobrenatural',
        descricao: 'Deslocamento base elevado de 12 metros.'
      },
      {
        nome: 'Garras Foices',
        descricao: 'Possuem garras curvas afiadíssimas nas patas traseiras que causam 1d6 de dano de corte com margem de crítico 19-20.'
      },
      {
        nome: 'Faro e Sentidos',
        descricao: 'Recebem +4 em testes de Sobrevivência para rastrear pelo faro e +2 em testes de Iniciativa e Reflexos.'
      },
      {
        nome: 'Visão na Penumbra',
        descricao: 'Ignoram camuflagem causada por penumbra e pouca luz.'
      }
    ],
    descricao: 'Os corredores mais velozes de Galrasia, semelhantes a ornitomimos e pequenos carnívoros bípedes ágeis. Deslocam-se em disparadas vertiginosas pelas savanas primitivas cortando presas em passagens rasantes.',
    livroFonte: 'Manual das Raças'
  }
];

let inseridos = 0;
for (const nr of novasRacas) {
  const idx = racas.findIndex(r => r.id === nr.id);
  if (idx >= 0) {
    racas[idx] = nr;
    console.log(`Atualizada raça: ${nr.nome}`);
  } else {
    racas.push(nr);
    inseridos++;
    console.log(`Adicionada nova raça: ${nr.nome}`);
  }
}

fs.writeFileSync(racasFilePath, JSON.stringify(racas, null, 2), 'utf8');
console.log(`Sucesso: ${inseridos} novas raças adicionadas. Total agora: ${racas.length}`);

