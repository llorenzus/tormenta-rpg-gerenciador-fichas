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
});
