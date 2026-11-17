import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import { verificarPreRequisitosCumpridos } from '../src/data/talentos/verificadorPreRequisitos';
import { FichaPersonagem } from '../src/models/ficha';
import { TalentoData } from '../src/data';

const criarFichaTeste = (): FichaPersonagem => ({
  id: 'ficha-teste-req',
  nomePersonagem: 'Herói dos Testes',
  jogador: 'Jogador',
  raca: 'Humano',
  classe: 'Guerreiro',
  classes: [{ id: 'c1', nome: 'Guerreiro', nivel: 4 }],
  nivel: 4,
  forca: 14,
  destreza: 14,
  constituicao: 12,
  inteligencia: 10,
  sabedoria: 10,
  carisma: 10,
  pvAtual: 30,
  pvTotal: 30,
  pmAtual: 0,
  pmTotal: 0,
  bba: 4,
  armas: [],
  armaduras: [],
  pericias: [
    {
      id: 'p1',
      nome: 'Atletismo',
      atributoChave: 'FOR',
      treinada: true,
      outrosBonus: 0,
    },
    {
      id: 'p2',
      nome: 'Iniciativa',
      atributoChave: 'DES',
      treinada: true,
      outrosBonus: 0,
    },
    {
      id: 'p3',
      nome: 'Acrobacia',
      atributoChave: 'DES',
      treinada: false,
      outrosBonus: 0,
    },
  ],
  habilidadesRaca: [],
  habilidadesClasse: [{ id: 'h1', nome: 'Ataque Furtivo +1d6', descricao: '' }],
  talentos: [{ id: 't1', nome: 'Ataque Poderoso', descricao: '' }],
  magias: [],
  itensGerais: [],
  tibares: '50 TO',
  caBonusTamanho: 0,
  caOutrosBonus: 0,
  fortitudeOutros: 0,
  reflexosOutros: 0,
  vontadeOutros: 0,
});

describe('Verificador de Pré-Requisitos de Talentos (TRPG)', () => {
  it('deve validar cumprimento e pendência de atributos mínimos', () => {
    const ficha = criarFichaTeste();
    ficha.forca = 14;

    const talentoFor13: TalentoData = {
      id: 'tal-for-13',
      nome: 'Golpe Firme',
      preRequisitos: 'Força 13.',
      beneficio: '',
      descricao: '',
      categoria: 'Combate',
    };

    const resSucesso = verificarPreRequisitosCumpridos(ficha, talentoFor13);
    assert.strictEqual(resSucesso.cumpre, true);
    assert.strictEqual(resSucesso.pendencias.length, 0);

    const talentoFor18: TalentoData = {
      id: 'tal-for-18',
      nome: 'Golpe Devastador',
      preRequisitos: 'Força 18.',
      beneficio: '',
      descricao: '',
      categoria: 'Combate',
    };

    const resFalha = verificarPreRequisitosCumpridos(ficha, talentoFor18);
    assert.strictEqual(resFalha.cumpre, false);
    assert.strictEqual(resFalha.pendencias.includes('Força 18 (possui 14)'), true);
  });

  it('deve validar cumprimento e pendência de BBA mínimo', () => {
    const ficha = criarFichaTeste();
    ficha.bba = 4;

    const talentoBba1: TalentoData = {
      id: 'tal-bba-1',
      nome: 'Ataque em Movimento',
      preRequisitos: 'BBA +1.',
      beneficio: '',
      descricao: '',
      categoria: 'Combate',
    };

    assert.strictEqual(verificarPreRequisitosCumpridos(ficha, talentoBba1).cumpre, true);

    const talentoBba6: TalentoData = {
      id: 'tal-bba-6',
      nome: 'Ataque Duplo',
      preRequisitos: 'BBA +6.',
      beneficio: '',
      descricao: '',
      categoria: 'Combate',
    };

    const resFalha = verificarPreRequisitosCumpridos(ficha, talentoBba6);
    assert.strictEqual(resFalha.cumpre, false);
    assert.strictEqual(resFalha.pendencias.includes('BBA +6 (possui +4)'), true);
  });

  it('deve validar exigências de perícias treinadas (incluindo "e" e "ou")', () => {
    const ficha = criarFichaTeste();
    // ficha possui: Atletismo (treinada), Iniciativa (treinada), Acrobacia (não treinada)

    // Perícia única treinada
    const talentoTreino1: TalentoData = {
      id: 'tal-treino-1',
      nome: 'Atleta Lendário',
      preRequisitos: 'Treinado em Atletismo.',
      beneficio: '',
      descricao: '',
      categoria: 'Perícia',
    };
    assert.strictEqual(verificarPreRequisitosCumpridos(ficha, talentoTreino1).cumpre, true);

    // Perícia não treinada
    const talentoTreino2: TalentoData = {
      id: 'tal-treino-2',
      nome: 'Salto Acrobático',
      preRequisitos: 'Treinado em Acrobacia.',
      beneficio: '',
      descricao: '',
      categoria: 'Perícia',
    };
    assert.strictEqual(verificarPreRequisitosCumpridos(ficha, talentoTreino2).cumpre, false);

    // Condição "ou" satisfeita
    const talentoTreinoOu: TalentoData = {
      id: 'tal-treino-ou',
      nome: 'Agilidade Prática',
      preRequisitos: 'Treinado em Atletismo ou Acrobacia.',
      beneficio: '',
      descricao: '',
      categoria: 'Perícia',
    };
    assert.strictEqual(verificarPreRequisitosCumpridos(ficha, talentoTreinoOu).cumpre, true);

    // Condição "e" não satisfeita
    const talentoTreinoE: TalentoData = {
      id: 'tal-treino-e',
      nome: 'Ginasta Completo',
      preRequisitos: 'Treinado em Atletismo e Acrobacia.',
      beneficio: '',
      descricao: '',
      categoria: 'Perícia',
    };
    assert.strictEqual(verificarPreRequisitosCumpridos(ficha, talentoTreinoE).cumpre, false);
  });

  it('deve validar graduações mínimas em perícias', () => {
    const ficha = criarFichaTeste();
    ficha.nivel = 4;
    // Atletismo treinada => 4 + 3 = 7 graduações

    const talentoGrad4: TalentoData = {
      id: 'tal-grad-4',
      nome: 'Escalador Rápido',
      preRequisitos: 'Atletismo 4 graduações.',
      beneficio: '',
      descricao: '',
      categoria: 'Perícia',
    };
    assert.strictEqual(verificarPreRequisitosCumpridos(ficha, talentoGrad4).cumpre, true);

    const talentoGrad10: TalentoData = {
      id: 'tal-grad-10',
      nome: 'Salto Épico',
      preRequisitos: 'Atletismo 10 graduações.',
      beneficio: '',
      descricao: '',
      categoria: 'Perícia',
    };
    const resFalha = verificarPreRequisitosCumpridos(ficha, talentoGrad10);
    assert.strictEqual(resFalha.cumpre, false);
  });

  it('deve validar classes e níveis mínimos de classe', () => {
    const ficha = criarFichaTeste();
    // ficha possui Guerreiro 4

    const talentoGuerreiro4: TalentoData = {
      id: 'tal-guer-4',
      nome: 'Especialização em Arma',
      preRequisitos: 'Guerreiro 4º nível, Foco em Arma.',
      beneficio: '',
      descricao: '',
      categoria: 'Combate',
    };
    // Guerreiro 4º nível atendido (falta apenas Foco em Arma)
    const res = verificarPreRequisitosCumpridos(ficha, talentoGuerreiro4);
    assert.strictEqual(res.pendencias.includes('Guerreiro 4º nível'), false);

    const talentoMago: TalentoData = {
      id: 'tal-mago',
      nome: 'Mestre Arcano',
      preRequisitos: 'Classe mago.',
      beneficio: '',
      descricao: '',
      categoria: 'Magia',
    };
    const resMago = verificarPreRequisitosCumpridos(ficha, talentoMago);
    assert.strictEqual(resMago.cumpre, false);
    assert.strictEqual(resMago.pendencias.includes('Classe mago'), true);
  });

  it('deve validar habilidades de classe exigidas', () => {
    const ficha = criarFichaTeste();
    // ficha possui 'Ataque Furtivo +1d6' em habilidadesClasse

    const talentoFurtivo: TalentoData = {
      id: 'tal-furtivo',
      nome: 'Golpe Sorrateiro',
      preRequisitos: 'Ataque furtivo como habilidade de classe.',
      beneficio: '',
      descricao: '',
      categoria: 'Combate',
    };
    assert.strictEqual(verificarPreRequisitosCumpridos(ficha, talentoFurtivo).cumpre, true);

    const talentoMusica: TalentoData = {
      id: 'tal-musica',
      nome: 'Acorde Mágico',
      preRequisitos: 'Habilidade de classe música de bardo.',
      beneficio: '',
      descricao: '',
      categoria: 'Magia',
    };
    assert.strictEqual(verificarPreRequisitosCumpridos(ficha, talentoMusica).cumpre, false);
  });

  it('deve validar dependência de talentos anteriores na ficha', () => {
    const ficha = criarFichaTeste();
    // ficha possui: Ataque Poderoso

    const talentoGolpePoderoso: TalentoData = {
      id: 'golpe_poderoso',
      nome: 'Golpe Poderoso',
      preRequisitos: 'Força 13, Ataque Poderoso.',
      beneficio: '',
      descricao: '',
      categoria: 'Combate',
    };
    // Possui Força 14 e Ataque Poderoso
    assert.strictEqual(verificarPreRequisitosCumpridos(ficha, talentoGolpePoderoso).cumpre, true);

    const talentoTresPassar: TalentoData = {
      id: 'trespassar_aprimorado',
      nome: 'Trespassar Aprimorado',
      preRequisitos: 'Ataque Poderoso, Trespassar, BBA +4.',
      beneficio: '',
      descricao: '',
      categoria: 'Combate',
    };
    // Possui Ataque Poderoso e BBA 4, mas falta Trespassar
    const resTrespassar = verificarPreRequisitosCumpridos(ficha, talentoTresPassar);
    assert.strictEqual(resTrespassar.cumpre, false);
    assert.strictEqual(resTrespassar.pendencias.some((p) => p.includes('Trespassar')), true);
  });

  it('deve validar o talento Mago Nato e capacidade de lançar magias arcanas', () => {
    const { getTalentoPorId } = require('../src/data/talentos');
    const magoNato = getTalentoPorId('mago_nato');
    assert.ok(magoNato, 'Talento Mago Nato deve existir no banco de talentos');
    assert.strictEqual(magoNato.categoria, 'Regional');
    assert.strictEqual(magoNato.nome, 'Mago Nato');
    assert.ok(magoNato.beneficio.includes('-1 PM') || magoNato.beneficio.includes('-1'));

    // Personagem sem classe arcana nem magias arcanas
    const guerreiroPuro = criarFichaTeste();
    guerreiroPuro.classes = [{ id: 'c1', nome: 'Guerreiro', nivel: 4 }];
    guerreiroPuro.classe = 'Guerreiro';
    guerreiroPuro.magias = [];

    const resGuerreiro = verificarPreRequisitosCumpridos(guerreiroPuro, magoNato);
    assert.strictEqual(resGuerreiro.cumpre, false);
    assert.ok(
      resGuerreiro.pendencias.some((p) => p.includes('magias arcanas')),
      'Deve acusar pendência de capacidade de lançar magias arcanas'
    );

    // Personagem Mago
    const mago = criarFichaTeste();
    mago.classes = [{ id: 'c1', nome: 'Mago', nivel: 3 }];
    mago.classe = 'Mago';

    const resMago = verificarPreRequisitosCumpridos(mago, magoNato);
    assert.strictEqual(resMago.cumpre, true);
    assert.strictEqual(resMago.pendencias.length, 0);
  });

  it('deve validar pré-requisitos raciais (ex: Arcano Completo exige Elfo ou Qareen)', () => {
    const { getTalentoPorId } = require('../src/data/talentos');
    const arcanoCompleto = getTalentoPorId('arcano_completo');
    assert.ok(arcanoCompleto, 'Talento Arcano Completo deve existir');

    // 1. Humano não deve cumprir
    const humano = criarFichaTeste();
    humano.raca = 'Humano';
    const resHumano = verificarPreRequisitosCumpridos(humano, arcanoCompleto);
    assert.strictEqual(resHumano.cumpre, false);
    assert.ok(
      resHumano.pendencias.includes('Raça: Elfo ou Qareen'),
      'Deve acusar pendência da raça Elfo ou Qareen'
    );

    // 2. Elfo deve cumprir
    const elfo = criarFichaTeste();
    elfo.raca = 'Elfo';
    const resElfo = verificarPreRequisitosCumpridos(elfo, arcanoCompleto);
    assert.strictEqual(resElfo.cumpre, true);
    assert.strictEqual(resElfo.pendencias.length, 0);

    // 3. Elfa (variação de gênero) deve cumprir
    const elfa = criarFichaTeste();
    elfa.raca = 'Elfa';
    const resElfa = verificarPreRequisitosCumpridos(elfa, arcanoCompleto);
    assert.strictEqual(resElfa.cumpre, true);

    // 4. Qareen deve cumprir
    const qareen = criarFichaTeste();
    qareen.raca = 'Qareen';
    const resQareen = verificarPreRequisitosCumpridos(qareen, arcanoCompleto);
    assert.strictEqual(resQareen.cumpre, true);

    // 5. Meio-Elfo não deve cumprir talento exclusivo de Elfo puro
    const meioElfo = criarFichaTeste();
    meioElfo.raca = 'Meio-Elfo';
    const resMeioElfo = verificarPreRequisitosCumpridos(meioElfo, arcanoCompleto);
    assert.strictEqual(resMeioElfo.cumpre, false);
    assert.ok(resMeioElfo.pendencias.includes('Raça: Elfo ou Qareen'));

    // 6. Personagem sem raça definida não deve cumprir
    const semRaca = criarFichaTeste();
    semRaca.raca = '';
    const resSemRaca = verificarPreRequisitosCumpridos(semRaca, arcanoCompleto);
    assert.strictEqual(resSemRaca.cumpre, false);
    assert.ok(resSemRaca.pendencias.includes('Raça: Elfo ou Qareen'));
  });

  it('deve validar pré-requisitos com múltiplas raças e variações (Alma de Pedra, Foco em Pólvora)', () => {
    const { getTalentoPorId } = require('../src/data/talentos');
    const almaDePedra = getTalentoPorId('alma_de_pedra');
    assert.ok(almaDePedra, 'Talento Alma de Pedra deve existir');

    const anao = criarFichaTeste();
    anao.raca = 'Anão';
    assert.strictEqual(verificarPreRequisitosCumpridos(anao, almaDePedra).cumpre, true);

    const nagah = criarFichaTeste();
    nagah.raca = 'Nagah';
    assert.strictEqual(verificarPreRequisitosCumpridos(nagah, almaDePedra).cumpre, true);

    const elfo = criarFichaTeste();
    elfo.raca = 'Elfo';
    const resElfo = verificarPreRequisitosCumpridos(elfo, almaDePedra);
    assert.strictEqual(resElfo.cumpre, false);
    assert.ok(resElfo.pendencias.includes('Raça: Anão ou Nagah'));

    const focoPolvora = getTalentoPorId('foco_em_polvora');
    assert.ok(focoPolvora, 'Talento Foco em Pólvora deve existir');

    const goblin = criarFichaTeste();
    goblin.raca = 'Goblin';
    assert.strictEqual(verificarPreRequisitosCumpridos(goblin, focoPolvora).cumpre, true);

    const hobgoblin = criarFichaTeste();
    hobgoblin.raca = 'Hobgoblin';
    assert.strictEqual(verificarPreRequisitosCumpridos(hobgoblin, focoPolvora).cumpre, true);

    const humano = criarFichaTeste();
    humano.raca = 'Humano';
    const resHumano = verificarPreRequisitosCumpridos(humano, focoPolvora);
    assert.strictEqual(resHumano.cumpre, false);
    assert.ok(resHumano.pendencias.includes('Raça: Anão, Goblin ou Hobgoblin'));
  });

  it('deve validar talentos com alternativas de raça ou outros atributos (Arma Amada, Mandíbula de Aço)', () => {
    const { getTalentoPorId } = require('../src/data/talentos');
    const armaAmada = getTalentoPorId('arma_amada');
    assert.ok(armaAmada, 'Talento Arma Amada deve existir');

    // Anão com BBA 1 pode pegar Arma Amada
    const anaoBba1 = criarFichaTeste();
    anaoBba1.raca = 'Anão';
    anaoBba1.bba = 1;
    assert.strictEqual(verificarPreRequisitosCumpridos(anaoBba1, armaAmada).cumpre, true);

    // Humano com BBA 5 pode pegar Arma Amada
    const humanoBba5 = criarFichaTeste();
    humanoBba5.raca = 'Humano';
    humanoBba5.bba = 5;
    assert.strictEqual(verificarPreRequisitosCumpridos(humanoBba5, armaAmada).cumpre, true);

    // Humano com BBA 2 não pode pegar Arma Amada
    const humanoBba2 = criarFichaTeste();
    humanoBba2.raca = 'Humano';
    humanoBba2.bba = 2;
    const resHumanoBba2 = verificarPreRequisitosCumpridos(humanoBba2, armaAmada);
    assert.strictEqual(resHumanoBba2.cumpre, false);
    assert.ok(resHumanoBba2.pendencias.includes('Anão ou BBA +5'));

    // Mandíbula de Aço: Gnoll ou Herança da Hiena, bônus base de ataque +2
    const mandibulaDeAco = getTalentoPorId('mandibula_de_aco');
    assert.ok(mandibulaDeAco, 'Talento Mandíbula de Aço deve existir');

    // Gnoll com BBA 2 cumpre
    const gnoll = criarFichaTeste();
    gnoll.raca = 'Gnoll';
    gnoll.bba = 2;
    assert.strictEqual(verificarPreRequisitosCumpridos(gnoll, mandibulaDeAco).cumpre, true);

    // Humano com Herança da Hiena e BBA 2 cumpre
    const humanoComHeranca = criarFichaTeste();
    humanoComHeranca.raca = 'Humano';
    humanoComHeranca.bba = 2;
    humanoComHeranca.talentos = [{ id: 't-hiena', nome: 'Herança da Hiena', descricao: '' }];
    assert.strictEqual(verificarPreRequisitosCumpridos(humanoComHeranca, mandibulaDeAco).cumpre, true);

    // Humano sem Herança da Hiena e BBA 2 falha
    const humanoSemHeranca = criarFichaTeste();
    humanoSemHeranca.raca = 'Humano';
    humanoSemHeranca.bba = 2;
    humanoSemHeranca.talentos = [];
    const resSemHeranca = verificarPreRequisitosCumpridos(humanoSemHeranca, mandibulaDeAco);
    assert.strictEqual(resSemHeranca.cumpre, false);
    assert.ok(resSemHeranca.pendencias.includes('Raça: Gnoll ou talento Herança da Hiena'));
  });
});
