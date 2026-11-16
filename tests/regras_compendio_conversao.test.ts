import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  converterMagiaParaItem,
  converterTalentoParaItem,
  converterArmaParaItem,
  converterArmaduraParaItem,
  converterItemGeralParaItem,
  converterManobraParaItem,
  filtrarMagias,
  filtrarTalentos,
  filtrarClasses,
  filtrarRacas,
  filtrarEquipamentos,
  filtrarManobras,
  filtrarRegras,
  normalizarTexto,
  MagiaData,
  TalentoData,
  EquipamentoData,
  PosturaData,
  GolpeMarcialData,
} from '../src/data';
import { obterHabilidadesMagicasArma } from '../src/models/ficha';

describe('Conversões e Consultas do Compêndio (TRPG)', () => {
  it('deve converter Magia para item da ficha respeitando custo de PM e descrição', () => {
    const truque: MagiaData = {
      id: 'luz',
      nome: 'Luz',
      nivel: 0,
      escola: 'Evocação',
      tipo: 'Arcana',
      tempoExecucao: 'Padrão',
      alcance: 'Toque',
      alvoAreaEfeito: '1 objeto',
      duracao: '1 hora',
      resistencia: 'Nenhuma',
      descricao: 'O objeto tocado brilha como uma tocha.',
    };

    const itemTruque = converterMagiaParaItem(truque);
    assert.strictEqual(itemTruque.nome, 'Luz');
    assert.strictEqual(itemTruque.nivelCirculo, 0);
    assert.strictEqual(itemTruque.custoPm, '0', 'Magias de nível 0 (truques) devem custar 0 PM');
    assert.strictEqual(itemTruque.descricao.includes('[Evocação • Arcana]'), true);
    assert.strictEqual(itemTruque.descricao.includes('Execução: Padrão'), true);

    const bolaDeFogo: MagiaData = {
      id: 'bola-de-fogo',
      nome: 'Bola de Fogo',
      nivel: 3,
      escola: 'Evocação',
      tipo: 'Arcana',
      tempoExecucao: 'Padrão',
      alcance: 'Médio',
      duracao: 'Instantânea',
      resistencia: 'Reflexos reduz à metade',
      descricao: 'Explosão de chamas causando dano de fogo.',
    };

    const itemBolaDeFogo = converterMagiaParaItem(bolaDeFogo);
    assert.strictEqual(itemBolaDeFogo.nome, 'Bola de Fogo');
    assert.strictEqual(itemBolaDeFogo.nivelCirculo, 3);
    assert.strictEqual(itemBolaDeFogo.custoPm, '3', 'No TRPG, magias de nível N custam N PMs');
    assert.strictEqual(itemBolaDeFogo.descricao.includes('Alcance: Médio'), true);
  });

  it('deve converter Talento para item da ficha com pré-requisitos e categoria', () => {
    const talento: TalentoData = {
      id: 'foco-arma',
      nome: 'Foco em Arma',
      categoria: 'Combate',
      preRequisitos: 'BBA +1, proficiência com a arma.',
      beneficio: '+1 nas jogadas de ataque com a arma escolhida.',
      descricao: 'Você é treinado no uso de um tipo específico de arma.',
    };

    const item = converterTalentoParaItem(talento);
    assert.strictEqual(item.nome, 'Foco em Arma');
    assert.strictEqual(item.descricao.includes('[Combate]'), true);
    assert.strictEqual(item.descricao.includes('Pré-requisitos: BBA +1'), true);
    assert.strictEqual(item.descricao.includes('Benefício: +1 nas jogadas'), true);
  });

  it('deve converter Armas para itens da ficha com propriedades de combate', () => {
    const espadaLonga: EquipamentoData = {
      id: 'espada-longa',
      nome: 'Espada Longa',
      tipo: 'Arma',
      dano: '1d8',
      critico: '19-20/x2',
      alcance: '—',
      tipoDano: 'Corte',
      preco: '15 TO',
      peso: '2 kg',
    };

    const itemArma = converterArmaParaItem(espadaLonga);
    assert.strictEqual(itemArma.nome, 'Espada Longa');
    assert.strictEqual(itemArma.dano, '1d8');
    assert.strictEqual(itemArma.critico, '19-20/x2');
    assert.strictEqual(itemArma.tipoDano, 'Corte');
    assert.strictEqual(itemArma.distancia, '', 'Alcance traço deve se tornar string vazia para armas corpo a corpo');
    assert.strictEqual(itemArma.bonusAtaque, '+0');
    assert.strictEqual(itemArma.usaDestreza, false);

    const arcoCurto: EquipamentoData = {
      id: 'arco-curto',
      nome: 'Arco Curto',
      tipo: 'Arma',
      dano: '1d6',
      critico: 'x3',
      alcance: '15m',
      tipoDano: 'Perfuração',
    };

    const itemArco = converterArmaParaItem(arcoCurto);
    assert.strictEqual(itemArco.distancia, '15m');
    assert.strictEqual(itemArco.critico, 'x3');

    // Habilidades mágicas em armas
    itemArma.habilidadesMagicas = [
      { id: 'h1', nome: 'Flamejante', descricao: '+1d6 de dano de fogo', bonusEquivalente: '+1' },
      { id: 'h2', nome: 'Afiada', descricao: 'Dobra margem de crítico', bonusEquivalente: '+1' },
    ];
    const habs = obterHabilidadesMagicasArma(itemArma);
    assert.strictEqual(habs.length, 2);
    assert.strictEqual(habs[0].nome, 'Flamejante');
    assert.strictEqual(habs[0].bonusEquivalente, '+1');
    assert.strictEqual(habs[1].nome, 'Afiada');
  });

  it('deve converter Armaduras e Escudos para itens defensivos equipados', () => {
    const cotaDeMalha: EquipamentoData = {
      id: 'cota-de-malha',
      nome: 'Cota de Malha',
      tipo: 'Armadura',
      bonusCa: 5,
      penalidadeArmadura: -5,
    };

    const itemArmadura = converterArmaduraParaItem(cotaDeMalha);
    assert.strictEqual(itemArmadura.nome, 'Cota de Malha');
    assert.strictEqual(itemArmadura.tipo, 'ARMADURA');
    assert.strictEqual(itemArmadura.bonusCa, 5);
    assert.strictEqual(itemArmadura.equipada, true);

    const escudoPesado: EquipamentoData = {
      id: 'escudo-pesado',
      nome: 'Escudo Pesado',
      tipo: 'Escudo',
      bonusCa: 2,
      penalidadeArmadura: -2,
    };

    const itemEscudo = converterArmaduraParaItem(escudoPesado);
    assert.strictEqual(itemEscudo.nome, 'Escudo Pesado');
    assert.strictEqual(itemEscudo.tipo, 'ESCUDO');
    assert.strictEqual(itemEscudo.bonusCa, 2);
    assert.strictEqual(itemEscudo.equipada, true);
  });

  it('deve converter itens gerais e manobras marciais', () => {
    const corda: EquipamentoData = {
      id: 'corda-15m',
      nome: 'Corda (15m)',
      tipo: 'Item Geral',
      peso: '5 kg',
    };

    const itemGeral = converterItemGeralParaItem(corda);
    assert.strictEqual(itemGeral.nome, 'Corda (15m)');
    assert.strictEqual(itemGeral.quantidade, '1');

    const postura: PosturaData = {
      id: 'postura-equilibrio',
      nome: 'Equilíbrio de Khalmyr',
      tipo: 'Postura',
      efeito: 'Você pode escolher 10 em testes de perícia.',
      descricao: 'Postura focada em estabilidade e disciplina.',
    };

    const itemManobra = converterManobraParaItem(postura);
    assert.strictEqual(itemManobra.nome, 'Equilíbrio de Khalmyr [Postura]');
    assert.strictEqual(itemManobra.descricao.includes('Efeito: Você pode escolher 10'), true);
  });

  it('deve filtrar magias por nível, tipo (arcana/divina) e escola', () => {
    const magiasNivel1 = filtrarMagias({ nivel: 1 });
    assert.strictEqual(magiasNivel1.length > 0, true);
    assert.strictEqual(magiasNivel1.every((m) => m.nivel === 1), true);

    const magiasDivinas = filtrarMagias({ tipo: 'Divina' });
    assert.strictEqual(magiasDivinas.length > 0, true);
    assert.strictEqual(magiasDivinas.every((m) => m.tipo.toLowerCase().includes('divina')), true);

    const magiasEvocacao = filtrarMagias({ escola: 'Evocação' });
    assert.strictEqual(magiasEvocacao.length > 0, true);
    assert.strictEqual(magiasEvocacao.every((m) => m.escola.toLowerCase().includes('evocação')), true);

    const buscaPorNome = filtrarMagias({ termo: 'cura' });
    assert.strictEqual(buscaPorNome.length > 0, true);
    assert.strictEqual(
      buscaPorNome.some((m) => normalizarTexto(m.nome).includes('cura')),
      true
    );
  });

  it('deve filtrar talentos por categoria e termo de busca', () => {
    const talentosCombate = filtrarTalentos({ categoria: 'Combate' });
    assert.strictEqual(talentosCombate.length > 0, true);
    assert.strictEqual(talentosCombate.every((t) => t.categoria === 'Combate'), true);

    const buscaPoderoso = filtrarTalentos({ termo: 'poderoso' });
    assert.strictEqual(buscaPoderoso.length > 0, true);
    assert.strictEqual(
      buscaPoderoso.some((t) => normalizarTexto(t.nome).includes('ataque poderoso')),
      true
    );
  });

  it('deve filtrar equipamentos por tipo e buscar manobras', () => {
    const armas = filtrarEquipamentos('', 'Arma');
    assert.strictEqual(armas.length > 0, true);
    assert.strictEqual(armas.every((e) => e.tipo === 'Arma'), true);

    const posturasFiltradas = filtrarManobras('', 'Postura');
    assert.strictEqual(posturasFiltradas.length > 0, true);
    assert.strictEqual(posturasFiltradas.every((p) => p.tipo === 'Postura'), true);
  });

  it('deve conter e filtrar todas as 11 classes e variantes oficiais do Manual do Devoto', () => {
    const classesDevoto = [
      'Abençoado',
      'Samaritano',
      'Clérigo Cruzado',
      'Clérigo Enclausurado',
      'Clérigo Usurpador',
      'Druida Ermitão',
      'Druida Metamorfo',
      'Druida Senhor das Feras',
      'Paladino Caçador de Horrores',
      'Paladino Santo',
      'Paladino Vassalo',
    ];

    for (const nomeClasse of classesDevoto) {
      const encontradas = filtrarClasses(nomeClasse);
      assert.strictEqual(
        encontradas.length > 0,
        true,
        `Classe do Manual do Devoto "${nomeClasse}" não foi encontrada no compêndio`
      );
      const exata = encontradas.find(
        (c) => normalizarTexto(c.nome) === normalizarTexto(nomeClasse)
      );
      assert.ok(exata, `Classe exata "${nomeClasse}" deve existir`);
      assert.strictEqual(exata.livroFonte, 'Manual do Devoto');
      assert.strictEqual(exata.tipo, 'Basica');
      assert.ok(exata.habilidades.length > 0, `Classe "${nomeClasse}" deve conter habilidades`);
    }
  });

  it('deve conter a classe Artífice de Reinos de Moreania com todas as habilidades', () => {
    const encontradas = filtrarClasses('Artífice');
    const artifice = encontradas.find((c) => normalizarTexto(c.nome) === 'artifice');
    assert.ok(artifice, 'Classe Artífice deve existir no compêndio');
    assert.strictEqual(artifice.livroFonte, 'Reinos de Moreania');
    assert.strictEqual(artifice.tipo, 'Basica');
    assert.strictEqual(artifice.pvInicial, 12);
    assert.strictEqual(artifice.pvPorNivel, 3);
    assert.strictEqual(artifice.pmPorNivel, 3);
    assert.strictEqual(artifice.bba, '3/4 por nível');

    const nomesHabs = artifice.habilidades.map((h) => h.nome);
    assert.ok(nomesHabs.some((n) => n.includes('Chave Sônica')));
    assert.ok(nomesHabs.some((n) => n.includes('Infundir Magias')));
    assert.ok(nomesHabs.some((n) => n.includes('Árvore de Natal')));
    assert.ok(nomesHabs.some((n) => n.includes('Companheiro Autômato')));
    assert.ok(nomesHabs.some((n) => n.includes('Artesão Lendário')));
  });

  it('deve filtrar classes e raças por manual de origem (livroFonte)', () => {
    // Classes por manual
    const classesDevoto = filtrarClasses('', 'Todas', 'Manual do Devoto');
    assert.strictEqual(classesDevoto.length >= 11, true);
    assert.strictEqual(classesDevoto.every((c) => c.livroFonte.includes('Manual do Devoto')), true);

    const classesMoreania = filtrarClasses('', 'Todas', 'Reinos de Moreania');
    assert.strictEqual(classesMoreania.length >= 1, true);
    assert.ok(classesMoreania.some((c) => c.nome === 'Artífice'));

    // Raças por manual
    const racasBasico = filtrarRacas('', 'Manual Básico');
    assert.strictEqual(racasBasico.length > 0, true);
    assert.strictEqual(racasBasico.every((r) => r.livroFonte.includes('Manual Básico')), true);
  });

  it('deve manter listagens ordenadas em ordem alfabética', () => {
    const classesTodas = filtrarClasses('', 'Todas', 'Todos');
    for (let i = 0; i < classesTodas.length - 1; i++) {
      const cmp = classesTodas[i].nome.localeCompare(classesTodas[i + 1].nome, 'pt-BR');
      assert.strictEqual(
        cmp <= 0,
        true,
        `Classes fora de ordem: "${classesTodas[i].nome}" antes de "${classesTodas[i + 1].nome}"`
      );
    }

    const racasTodas = filtrarRacas('', 'Todos');
    for (let i = 0; i < racasTodas.length - 1; i++) {
      const cmp = racasTodas[i].nome.localeCompare(racasTodas[i + 1].nome, 'pt-BR');
      assert.strictEqual(
        cmp <= 0,
        true,
        `Raças fora de ordem: "${racasTodas[i].nome}" antes de "${racasTodas[i + 1].nome}"`
      );
    }
  });

  it('deve filtrar armas mágicas por nível de bônus equivalente', () => {
    const armasBonus1 = filtrarRegras('', 'Armas Mágicas', '+1');
    assert.strictEqual(armasBonus1.length > 0, true);
    assert.strictEqual(armasBonus1.every((r) => (r.bonusEquivalente || '').includes('+1')), true);

    const armasBonus2 = filtrarRegras('', 'Armas Mágicas', '+2');
    assert.strictEqual(armasBonus2.length > 0, true);
    assert.strictEqual(armasBonus2.every((r) => (r.bonusEquivalente || '').includes('+2')), true);
  });
});
