import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  compararVersaoMaisNova,
  selecionarUrlDownload,
  ReleaseAsset,
  VERSAO_ATUAL,
} from '../src/utils/updateChecker';

describe('Verificador de Atualizações Online (Mobile e Windows)', () => {
  describe('compararVersaoMaisNova', () => {
    it('deve identificar versão patch mais recente', () => {
      assert.strictEqual(compararVersaoMaisNova('1.2.1', '1.2.0'), true);
      assert.strictEqual(compararVersaoMaisNova('v1.2.1', '1.2.0'), true);
    });

    it('deve identificar versão minor mais recente', () => {
      assert.strictEqual(compararVersaoMaisNova('1.3.0', '1.2.0'), true);
      assert.strictEqual(compararVersaoMaisNova('v1.3.0', '1.2.0'), true);
    });

    it('deve identificar versão major mais recente', () => {
      assert.strictEqual(compararVersaoMaisNova('2.0.0', '1.2.0'), true);
      assert.strictEqual(compararVersaoMaisNova('v2.0.0', '1.2.0'), true);
    });

    it('deve retornar false se as versões forem idênticas', () => {
      assert.strictEqual(compararVersaoMaisNova('1.2.0', '1.2.0'), false);
      assert.strictEqual(compararVersaoMaisNova('v1.2.0', '1.2.0'), false);
      assert.strictEqual(compararVersaoMaisNova(VERSAO_ATUAL, VERSAO_ATUAL), false);
      assert.strictEqual(compararVersaoMaisNova(`v${VERSAO_ATUAL}`, VERSAO_ATUAL), false);
    });

    it('deve retornar false se a versão remota for mais antiga', () => {
      assert.strictEqual(compararVersaoMaisNova('1.1.9', '1.2.0'), false);
      assert.strictEqual(compararVersaoMaisNova('v1.0.5', '1.2.0'), false);
      assert.strictEqual(compararVersaoMaisNova('0.9.0', '1.2.0'), false);
    });

    it('deve lidar corretamente com sufixos de release e tags', () => {
      assert.strictEqual(compararVersaoMaisNova('v1.3.0-rc.1', '1.2.0'), true);
      assert.strictEqual(compararVersaoMaisNova('v1.2.0-beta', '1.2.0'), false);
    });
  });

  describe('selecionarUrlDownload', () => {
    const assetsExemplo: ReleaseAsset[] = [
      {
        name: 'TRPG-Ficha-Android-v1.3.0.apk',
        browser_download_url: 'https://github.com/llorenzus/repo/releases/download/v1.3.0/TRPG-Ficha-Android-v1.3.0.apk',
      },
      {
        name: 'TRPG-Gerenciador-de-Fichas-Setup-v1.3.0.exe',
        browser_download_url: 'https://github.com/llorenzus/repo/releases/download/v1.3.0/TRPG-Gerenciador-de-Fichas-Setup-v1.3.0.exe',
      },
      {
        name: 'TRPG-Gerenciador-de-Fichas-v1.3.0.exe',
        browser_download_url: 'https://github.com/llorenzus/repo/releases/download/v1.3.0/TRPG-Gerenciador-de-Fichas-v1.3.0.exe',
      },
    ];
    const fallback = 'https://github.com/llorenzus/repo/releases/tag/v1.3.0';

    it('deve retornar fallback quando a lista de assets estiver vazia', () => {
      const url = selecionarUrlDownload([], fallback);
      assert.strictEqual(url, fallback);
    });

    it('deve selecionar o arquivo .apk quando a plataforma for Android', () => {
      const url = selecionarUrlDownload(assetsExemplo, fallback, 'android');
      assert.strictEqual(url, 'https://github.com/llorenzus/repo/releases/download/v1.3.0/TRPG-Ficha-Android-v1.3.0.apk');
    });

    it('deve priorizar o instalador Setup .exe quando a plataforma for Windows', () => {
      const url = selecionarUrlDownload(assetsExemplo, fallback, 'windows');
      assert.strictEqual(url, 'https://github.com/llorenzus/repo/releases/download/v1.3.0/TRPG-Gerenciador-de-Fichas-Setup-v1.3.0.exe');
    });

    it('deve escolher o executável portátil se não houver Setup no Windows', () => {
      const assetsSemSetup: ReleaseAsset[] = [
        {
          name: 'TRPG-Gerenciador-de-Fichas-v1.3.0.exe',
          browser_download_url: 'https://github.com/llorenzus/repo/releases/download/v1.3.0/TRPG-Gerenciador-de-Fichas-v1.3.0.exe',
        },
      ];
      const url = selecionarUrlDownload(assetsSemSetup, fallback, 'windows');
      assert.strictEqual(url, 'https://github.com/llorenzus/repo/releases/download/v1.3.0/TRPG-Gerenciador-de-Fichas-v1.3.0.exe');
    });
  });
});
