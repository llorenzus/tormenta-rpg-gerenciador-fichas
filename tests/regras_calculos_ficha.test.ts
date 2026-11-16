import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  obterModAtributo,
  formatarModificador,
  calcularCaTotal,
  calcularGraduacaoPericia,
  calcularTotalPericia,
  calcularAtaqueArma,
  calcularNivelTotal,
  obterClassesFicha,
  calcularResistencia,
  obterBuffsTemporarios,
  temBuffsAtivos,
  contarBuffsAtivos,
  zerarBuffsTemporarios,
  FichaPersonagem,
  ArmaduraEquipamento,
  ArmaItem,
  PericiaItem,
} from '../src/models/ficha';

const criarFichaBase = (): FichaPersonagem => ({
  id: 'test-1',
  nomePersonagem: 'Guerreiro de Teste',
  jogador: 'Tester',
  raca: 'Humano',
  classe: 'Guerreiro',
  classes: [{ id: 'c1', nome: 'Guerreiro', nivel: 4 }],
  nivel: 4,
  forca: 16,
  destreza: 14,
  constituicao: 14,
  inteligencia: 10,
  sabedoria: 12,
  carisma: 8,
  pvAtual: 40,
  pvTotal: 40,
  pmAtual: 0,
  pmTotal: 0,
  bba: 4,
  armas: [],
  armaduras: [],
  pericias: [],
  habilidadesRaca: [],
  habilidadesClasse: [],
  talentos: [],
  magias: [],
  itensGerais: [],
  tibares: '100 TO',
  caBonusTamanho: 0,
  caOutrosBonus: 0,
  fortitudeOutros: 0,
  reflexosOutros: 0,
  vontadeOutros: 0,
});

describe('Regras do Tormenta RPG - Cálculos e Modificadores', () => {
  it('deve calcular corretamente os modificadores de atributos oficiais (TRPG)', () => {
    const ficha = criarFichaBase();

    // 10 e 11 => 0
    ficha.forca = 10;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), 0);
    ficha.forca = 11;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), 0);

    // Valores pares e ímpares positivos
    ficha.forca = 12;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), 1);
    ficha.forca = 13;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), 1);
    ficha.forca = 16;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), 3);
    ficha.forca = 18;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), 4);
    ficha.forca = 20;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), 5);

    // Valores negativos
    ficha.forca = 9;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), -1);
    ficha.forca = 8;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), -1);
    ficha.forca = 6;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), -2);
    ficha.forca = 1;
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), -5);
  });

  it('deve formatar modificadores com sinal correto (+ ou -)', () => {
    assert.strictEqual(formatarModificador(3), '+3');
    assert.strictEqual(formatarModificador(0), '+0');
    assert.strictEqual(formatarModificador(-2), '-2');
  });

  it('deve calcular graduação de perícias oficiais (nível + 3 para treinadas, 1/2 nível para não-treinadas)', () => {
    const ficha = criarFichaBase();
    ficha.nivel = 4;

    const periciaTreinada: PericiaItem = {
      id: 'p1',
      nome: 'Atletismo',
      atributoChave: 'FOR',
      treinada: true,
      outrosBonus: 0,
    };

    const periciaNaoTreinada: PericiaItem = {
      id: 'p2',
      nome: 'Acrobacia',
      atributoChave: 'DES',
      treinada: false,
      outrosBonus: 0,
    };

    // Nível 4: treinada = 4 + 3 = 7; não-treinada = floor(4/2) = 2
    assert.strictEqual(calcularGraduacaoPericia(ficha, periciaTreinada), 7);
    assert.strictEqual(calcularGraduacaoPericia(ficha, periciaNaoTreinada), 2);

    // Nível 5: treinada = 5 + 3 = 8; não-treinada = floor(5/2) = 2
    ficha.nivel = 5;
    assert.strictEqual(calcularGraduacaoPericia(ficha, periciaTreinada), 8);
    assert.strictEqual(calcularGraduacaoPericia(ficha, periciaNaoTreinada), 2);
  });

  it('deve calcular o total da perícia somando graduação + mod. atributo + outros bônus', () => {
    const ficha = criarFichaBase();
    ficha.nivel = 4;
    ficha.forca = 16; // mod = +3

    const pericia: PericiaItem = {
      id: 'p1',
      nome: 'Atletismo',
      atributoChave: 'FOR',
      treinada: true, // grad = 4 + 3 = 7
      outrosBonus: 2, // bônus de item/raça
    };

    // Total = 7 (graduação) + 3 (mod FOR) + 2 (outros) = 12
    assert.strictEqual(calcularTotalPericia(ficha, pericia), 12);
  });

  it('deve calcular a Classe de Armadura (CA) considerando base 10 + 1/2 nível + DES + equipamentos equipados', () => {
    const ficha = criarFichaBase();
    ficha.nivel = 4; // 1/2 nível = +2
    ficha.destreza = 14; // mod DES = +2

    // Sem armadura: 10 + 2 (1/2 nív) + 2 (DES) = 14
    assert.strictEqual(calcularCaTotal(ficha), 14);

    // Com Cota de Malha (+5 CA, Des Max +2): 10 + 2 + 2 + 5 = 19
    const armadura: ArmaduraEquipamento = {
      id: 'a1',
      nome: 'Cota de Malha',
      tipo: 'ARMADURA',
      bonusCa: 5,
      destrezaMaxima: 2,
      penalidadeArmadura: -5,
      equipada: true,
    };
    ficha.armaduras = [armadura];
    assert.strictEqual(calcularCaTotal(ficha), 19);

    // Adiciona Escudo Pesado (+2 CA): 19 + 2 = 21
    const escudo: ArmaduraEquipamento = {
      id: 'e1',
      nome: 'Escudo Pesado',
      tipo: 'ESCUDO',
      bonusCa: 2,
      destrezaMaxima: 99,
      penalidadeArmadura: -2,
      equipada: true,
    };
    ficha.armaduras.push(escudo);
    assert.strictEqual(calcularCaTotal(ficha), 21);

    // Se desequipar o escudo, não deve contar
    escudo.equipada = false;
    assert.strictEqual(calcularCaTotal(ficha), 19);
  });

  it('deve calcular o acerto total de arma considerando BBA + mod. atributo + tamanho + outros', () => {
    const ficha = criarFichaBase();
    ficha.bba = 4;
    ficha.forca = 16; // mod = +3
    ficha.caBonusTamanho = 0;

    const espadaLonga: ArmaItem = {
      id: 'arm-1',
      nome: 'Espada Longa',
      bonusAtaque: '+0',
      dano: '1d8',
      critico: '19-20/x2',
      tipo: 'Corpo a corpo',
      outrosBonus: '2', // arma de obra-prima / mágica +2
    };

    // Acerto = BBA (4) + FOR (3) + Tam (0) + Outros (2) = 9
    assert.strictEqual(calcularAtaqueArma(ficha, espadaLonga), 9);

    // Arma de Destreza (à distância / acuidade)
    const arcoLongo: ArmaItem = {
      id: 'arm-2',
      nome: 'Arco Longo',
      bonusAtaque: '+0',
      dano: '1d8',
      critico: 'x3',
      tipo: 'À distância',
      usaDestreza: true,
      outrosBonus: '1',
    };
    // Acerto = BBA (4) + DES (2) + Tam (0) + Outros (1) = 7
    assert.strictEqual(calcularAtaqueArma(ficha, arcoLongo), 7);
  });

  it('deve gerenciar progressão e cálculo de multiclasse corretamente', () => {
    const ficha = criarFichaBase();
    ficha.classes = [
      { id: 'c1', nome: 'Guerreiro', nivel: 3 },
      { id: 'c2', nome: 'Mago', nivel: 2 },
    ];

    // Nível total deve ser a soma das classes: 3 + 2 = 5
    assert.strictEqual(calcularNivelTotal(ficha.classes), 5);

    // Lista de classes deve conter ambas
    const classes = obterClassesFicha(ficha);
    assert.strictEqual(classes.length, 2);
    assert.strictEqual(classes[0].nome, 'Guerreiro');
    assert.strictEqual(classes[1].nome, 'Mago');
  });

  it('deve aplicar buffs temporários de atributos, resistências e PV corretamente e zerar no descanso', () => {
    const ficha = criarFichaBase();
    ficha.forca = 16;       // Mod base: +3
    ficha.destreza = 14;    // Mod base: +2
    ficha.constituicao = 14;// Mod base: +2
    ficha.nivel = 4;        // 1/2 nível = 2

    // Inicialmente sem buffs
    assert.strictEqual(temBuffsAtivos(ficha), false);
    assert.strictEqual(contarBuffsAtivos(ficha), 0);
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), 3);
    assert.strictEqual(obterModAtributo(ficha, 'DES'), 2);
    assert.strictEqual(calcularResistencia(ficha, 'fortitude'), 4); // 2 (meio nív) + 2 (CON) + 0

    // Aplicar buffs temporários: +4 Força (ex: Força do Touro), +2 Destreza, +3 Fortitude, +4 CA e +15 PV temp
    ficha.buffsTemporarios = {
      forca: 4,
      destreza: 2,
      fortitude: 3,
      ca: 4,
      pvTemporario: 15,
    };

    assert.strictEqual(temBuffsAtivos(ficha), true);
    assert.strictEqual(contarBuffsAtivos(ficha), 5);

    // Força agora é 20 => Mod +5
    assert.strictEqual(obterModAtributo(ficha, 'FOR'), 5);
    // Destreza agora é 16 => Mod +3
    assert.strictEqual(obterModAtributo(ficha, 'DES'), 3);

    // CA deve refletir o mod de DES aumentado (+3) e o buff de CA (+4)
    // CA = 10 + 2 (1/2 nív) + 3 (DES buffado) + 4 (CA buff temp) = 19
    assert.strictEqual(calcularCaTotal(ficha), 19);

    // Ataque com arma de Força deve refletir mod FOR (+5)
    const espada: ArmaItem = {
      id: 'a-test',
      nome: 'Espada',
      bonusAtaque: '',
      dano: '1d8',
      critico: '19-20',
      tipo: 'Corpo a corpo',
    };
    // Acerto = 4 (BBA) + 5 (FOR buffada) = 9
    assert.strictEqual(calcularAtaqueArma(ficha, espada), 9);

    // Fortitude = 2 (meio nív) + 2 (CON) + 0 + 3 (buff fortitude) = 7
    assert.strictEqual(calcularResistencia(ficha, 'fortitude'), 7);

    // Ao zerar (equivalente ao Descanso Pleno)
    const fichaDescansada = zerarBuffsTemporarios(ficha);
    assert.strictEqual(temBuffsAtivos(fichaDescansada), false);
    assert.strictEqual(contarBuffsAtivos(fichaDescansada), 0);
    assert.strictEqual(obterModAtributo(fichaDescansada, 'FOR'), 3);
    assert.strictEqual(obterModAtributo(fichaDescansada, 'DES'), 2);
    assert.strictEqual(calcularCaTotal(fichaDescansada), 14);
    assert.strictEqual(calcularResistencia(fichaDescansada, 'fortitude'), 4);
  });
});
