import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  AbaKey,
  TODAS_AS_ABAS,
  ORDEM_ABAS_PADRAO,
} from '../src/models/abas';
import { COLORS } from '../src/theme/colors';
import { magias, talentos } from '../src/data';

describe('Consistência de Layout, Temas e Plataformas (Android / Windows)', () => {
  it('deve possuir todas as 9 abas cadastradas com título e ícone válidos', () => {
    const chavesEsperadas: AbaKey[] = [
      'dados_cadastrais',
      'atributos',
      'pericias',
      'habilidades_raca',
      'habilidades_classe',
      'manobras',
      'talentos',
      'magias',
      'equipamentos',
    ];

    assert.strictEqual(Object.keys(TODAS_AS_ABAS).length, 9);

    for (const key of chavesEsperadas) {
      const aba = TODAS_AS_ABAS[key];
      assert.ok(aba, `Aba ${key} deve estar registrada`);
      assert.strictEqual(aba.key, key);
      assert.strictEqual(typeof aba.titulo, 'string');
      assert.strictEqual(aba.titulo.length > 0, true);
      assert.strictEqual(typeof aba.icone, 'string');
      assert.strictEqual(aba.icone.length > 0, true);
    }
  });

  it('deve garantir que a ordem padrão de abas contém todas as abas sem duplicatas', () => {
    assert.strictEqual(ORDEM_ABAS_PADRAO.length, 9);

    const setAbas = new Set(ORDEM_ABAS_PADRAO);
    assert.strictEqual(setAbas.size, 9, 'Não deve haver chaves duplicadas na ordem padrão');

    for (const key of ORDEM_ABAS_PADRAO) {
      assert.ok(TODAS_AS_ABAS[key], `Chave ${key} em ORDEM_ABAS_PADRAO deve existir em TODAS_AS_ABAS`);
    }

    assert.strictEqual(ORDEM_ABAS_PADRAO[0], 'dados_cadastrais');
  });

  it('deve simular movimentação e ordenação de abas sem perda de integridade', () => {
    let ordem: AbaKey[] = [...ORDEM_ABAS_PADRAO];

    // Mover 'magias' (índice 7) para o índice 0
    const itemAMover = 'magias';
    const indexOrigem = ordem.indexOf(itemAMover);
    ordem.splice(indexOrigem, 1);
    ordem.unshift(itemAMover);

    assert.strictEqual(ordem[0], 'magias');
    assert.strictEqual(ordem.length, 9);
    assert.strictEqual(new Set(ordem).size, 9);

    // Mover para baixo
    const idx = ordem.indexOf('magias');
    const proximoIdx = idx + 1;
    const temp = ordem[proximoIdx];
    ordem[proximoIdx] = ordem[idx];
    ordem[idx] = temp;

    assert.strictEqual(ordem[1], 'magias');
  });

  it('deve validar paleta de cores consistente para ambas as plataformas', () => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    const coresObrigatorias: (keyof typeof COLORS)[] = [
      'primary',
      'primaryDark',
      'gold',
      'background',
      'surface',
      'surfaceVariant',
      'border',
      'text',
      'textSecondary',
      'white',
      'danger',
      'success',
    ];

    for (const corKey of coresObrigatorias) {
      const valor = COLORS[corKey];
      assert.ok(valor, `Cor ${corKey} deve estar definida no tema`);
      assert.match(
        valor,
        hexColorRegex,
        `Cor ${corKey} (${valor}) deve ser um código hexadecimal válido`
      );
    }

    // Sucesso usado para "✓ Adicionado"
    assert.strictEqual(COLORS.success, '#2E6B3E');
  });

  it('deve verificar conformidade com a nomenclatura de Tormenta RPG (sem vícios de DnD)', () => {
    // Verificar que todas as magias possuem nível numérico (0 a 9)
    for (const m of magias) {
      assert.strictEqual(typeof m.nivel, 'number', `Magia ${m.nome} deve ter nível numérico`);
      assert.ok(m.nivel >= 0 && m.nivel <= 9, `Magia ${m.nome} nível ${m.nivel} fora da faixa 0-9`);
      assert.strictEqual(
        (m as any).circulo,
        undefined,
        `Magia ${m.nome} não deve usar a propriedade 'circulo'`
      );
    }

    // Verificar que não há termos proibidos de DnD 5e nos nomes de talentos
    const termosProibidos = [
      'círculo de magia',
      'espaços de magia',
      'descanso longo',
      'descanso curto',
      'pontos de feitiçaria',
    ];

    for (const t of talentos) {
      const nomeLower = t.nome.toLowerCase();
      for (const termo of termosProibidos) {
        assert.strictEqual(
          nomeLower.includes(termo),
          false,
          `Talento '${t.nome}' contém termo proibido '${termo}'`
        );
      }
    }
  });
});
