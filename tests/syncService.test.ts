import { describe, it } from 'node:test';
import assert from 'node:assert';
import { mesclarFichasLocalENuvem } from '../src/services/syncService';
import { FichaPersonagem, normalizarFicha } from '../src/models/ficha';

function criarFichaExemplo(id: string, nome: string, timestamp: number): FichaPersonagem {
  return normalizarFicha({
    id,
    nomePersonagem: nome,
    atualizadoEm: timestamp,
    updatedAt: timestamp,
    jogador: 'Jogador Teste',
    raca: 'Humano',
    classe: 'Guerreiro 1',
    nivel: 1,
    tendencia: 'Neutro',
    sexo: 'M',
    idade: '25',
    divindade: 'Valkaria',
    tamanho: 'Médio',
    deslocamento: '9m',
    forca: 16,
    destreza: 14,
    constituicao: 14,
    inteligencia: 10,
    sabedoria: 10,
    carisma: 10,
    pvTotal: 20,
    pvAtual: 20,
    pmTotal: 0,
    pmAtual: 0,
    bba: 1,
    caBonusTamanho: 0,
    caOutrosBonus: 0,
    fortitudeOutros: 0,
    reflexosOutros: 0,
    vontadeOutros: 0,
    pericias: [],
    habilidadesRaca: [],
    habilidadesClasse: [],
    talentos: [],
    magias: [],
    armas: [],
    armaduras: [],
    itensGerais: [],
    tibares: '100 TO',
  });
}

describe('Serviço de Sincronização e Merge Offline-First (syncService)', () => {
  it('NUNCA deve apagar fichas locais se a nuvem estiver vazia e deve enviá-las para a nuvem', () => {
    const local1 = criarFichaExemplo('f1', 'Guerreiro Local', 1000);
    const local2 = criarFichaExemplo('f2', 'Mago Local', 1500);

    const { mescladas, enviarParaNuvem } = mesclarFichasLocalENuvem([local1, local2], []);

    assert.strictEqual(mescladas.length, 2);
    assert.strictEqual(enviarParaNuvem.length, 2);
    assert.ok(mescladas.some((f) => f.id === 'f1'));
    assert.ok(mescladas.some((f) => f.id === 'f2'));
  });

  it('deve baixar e preservar fichas da nuvem quando o aparelho local não possuir fichas', () => {
    const cloud1 = criarFichaExemplo('c1', 'Clérigo Nuvem', 2000);

    const { mescladas, enviarParaNuvem } = mesclarFichasLocalENuvem([], [cloud1]);

    assert.strictEqual(mescladas.length, 1);
    assert.strictEqual(enviarParaNuvem.length, 0);
    assert.strictEqual(mescladas[0].id, 'c1');
    assert.strictEqual(mescladas[0].nomePersonagem, 'Clérigo Nuvem');
  });

  it('se uma ficha existe nos dois lugares, deve manter a versão com updatedAt mais recente', () => {
    // Ficha 1: Local é mais recente (timestamp 3000 vs 2000 na nuvem)
    const f1Local = criarFichaExemplo('f1', 'Guerreiro Editado no Celular', 3000);
    const f1Nuvem = criarFichaExemplo('f1', 'Guerreiro Antigo da Nuvem', 2000);

    // Ficha 2: Nuvem é mais recente (timestamp 4000 na nuvem vs 2500 local)
    const f2Local = criarFichaExemplo('f2', 'Ladino Desatualizado Local', 2500);
    const f2Nuvem = criarFichaExemplo('f2', 'Ladino Atualizado no PC', 4000);

    const { mescladas, enviarParaNuvem } = mesclarFichasLocalENuvem(
      [f1Local, f2Local],
      [f1Nuvem, f2Nuvem]
    );

    assert.strictEqual(mescladas.length, 2);

    const f1Resolvida = mescladas.find((f) => f.id === 'f1');
    assert.ok(f1Resolvida);
    assert.strictEqual(f1Resolvida.nomePersonagem, 'Guerreiro Editado no Celular');
    assert.strictEqual(f1Resolvida.updatedAt, 3000);

    const f2Resolvida = mescladas.find((f) => f.id === 'f2');
    assert.ok(f2Resolvida);
    assert.strictEqual(f2Resolvida.nomePersonagem, 'Ladino Atualizado no PC');
    assert.strictEqual(f2Resolvida.updatedAt, 4000);

    // Apenas a f1 deve ser enviada para a nuvem (pois a versão local era mais recente)
    assert.strictEqual(enviarParaNuvem.length, 1);
    assert.strictEqual(enviarParaNuvem[0].id, 'f1');
  });

  it('deve garantir que o campo updatedAt e atualizadoEm existem em fichas normalizadas', () => {
    const ficha = criarFichaExemplo('f-teste', 'Bardo Teste', 5000);
    assert.ok(Number.isFinite(ficha.updatedAt));
    assert.ok(Number.isFinite(ficha.atualizadoEm));
    assert.strictEqual(ficha.updatedAt, 5000);
    assert.strictEqual(ficha.atualizadoEm, 5000);
  });
});
