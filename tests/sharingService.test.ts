import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  aplicarCompartilhamentoFicha,
  aplicarRevogacaoCompartilhamento,
} from '../src/services/sharingService';
import { FichaPersonagem, normalizarFicha } from '../src/models/ficha';

function criarFichaBase(id: string, nome: string): FichaPersonagem {
  return normalizarFicha({
    id,
    nomePersonagem: nome,
    userId: 'user-dono-123',
    pvTotal: 20,
    pvAtual: 20,
    pmTotal: 5,
    pmAtual: 5,
    bba: 1,
    nivel: 1,
    forca: 14,
    destreza: 14,
    constituicao: 14,
    inteligencia: 10,
    sabedoria: 10,
    carisma: 10,
    caBonusTamanho: 0,
    caOutrosBonus: 0,
    fortitudeOutros: 0,
    reflexosOutros: 0,
    vontadeOutros: 0,
    pericias: [],
    habilidadesRaca: [],
    habilidadesClasse: [],
    manobras: [],
    talentos: [],
    magias: [],
    armas: [],
    armaduras: [],
    itensGerais: [],
  });
}

describe('Serviço de Compartilhamento de Fichas (sharingService)', () => {
  const donoMock = {
    uid: 'user-dono-123',
    email: 'mestre@tormenta.com',
    displayName: 'Mestre Arthur',
  };

  it('normalizarFicha deve preservar campos de compartilhamento e leitura', () => {
    const ficha = criarFichaBase('f-1', 'Ladino Sombrio');
    ficha.campanha = 'Fim dos Tempos';
    ficha.isCompartilhadaComigo = true;
    ficha.donoNome = 'Mestre Arthur';
    ficha.donoId = 'user-dono-123';
    ficha.sharedWithUids = ['alvo-456'];
    ficha.compartilhadaCom = [
      { uid: 'alvo-456', email: 'jogador@email.com', username: 'jogador_1', compartilhadoEm: 12345 },
    ];

    const normalizada = normalizarFicha(ficha);
    assert.strictEqual(normalizada.campanha, 'Fim dos Tempos');
    assert.strictEqual(normalizada.isCompartilhadaComigo, true);
    assert.strictEqual(normalizada.donoNome, 'Mestre Arthur');
    assert.strictEqual(normalizada.donoId, 'user-dono-123');
    assert.deepStrictEqual(normalizada.sharedWithUids, ['alvo-456']);
    assert.strictEqual(normalizada.compartilhadaCom?.length, 1);
    assert.strictEqual(normalizada.compartilhadaCom[0].uid, 'alvo-456');
  });

  it('aplicarCompartilhamentoFicha deve adicionar usuário aos compartilhados e definir dados do dono', () => {
    const ficha = criarFichaBase('f-2', 'Paladino da Luz');
    const alvo = {
      uid: 'jogador-789',
      email: 'jogador@email.com',
      username: 'paladino_fan',
      displayName: 'Fã de Paladino',
    };

    const fichaCompartilhada = aplicarCompartilhamentoFicha(donoMock, ficha, alvo);

    assert.ok(fichaCompartilhada.sharedWithUids?.includes('jogador-789'));
    assert.strictEqual(fichaCompartilhada.compartilhadaCom?.length, 1);
    assert.strictEqual(fichaCompartilhada.compartilhadaCom[0].uid, 'jogador-789');
    assert.strictEqual(fichaCompartilhada.donoId, 'user-dono-123');
    assert.strictEqual(fichaCompartilhada.donoNome, 'Mestre Arthur');
  });

  it('não deve permitir compartilhar ficha com a própria conta', () => {
    const ficha = criarFichaBase('f-3', 'Mago Elemental');
    const mesmoUsuario = {
      uid: 'user-dono-123',
      email: 'mestre@tormenta.com',
      username: 'mestre',
    };

    assert.throws(
      () => {
        aplicarCompartilhamentoFicha(donoMock, ficha, mesmoUsuario);
      },
      /Você já é o proprietário desta ficha/
    );
  });

  it('aplicarRevogacaoCompartilhamento deve revogar o acesso do usuário especificado', () => {
    let ficha = criarFichaBase('f-4', 'Bárbaro Furioso');
    const alvo1 = { uid: 'user-1', email: 'u1@test.com', username: 'u1' };
    const alvo2 = { uid: 'user-2', email: 'u2@test.com', username: 'u2' };

    ficha = aplicarCompartilhamentoFicha(donoMock, ficha, alvo1);
    ficha = aplicarCompartilhamentoFicha(donoMock, ficha, alvo2);

    assert.strictEqual(ficha.sharedWithUids?.length, 2);

    // Revoga o user-1
    const atualizada = aplicarRevogacaoCompartilhamento(donoMock, ficha, 'user-1');

    assert.strictEqual(atualizada.sharedWithUids?.length, 1);
    assert.strictEqual(atualizada.sharedWithUids[0], 'user-2');
    assert.strictEqual(atualizada.compartilhadaCom?.length, 1);
    assert.strictEqual(atualizada.compartilhadaCom[0].uid, 'user-2');
  });
});
