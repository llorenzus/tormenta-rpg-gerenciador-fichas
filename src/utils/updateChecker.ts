import packageJson from '../../package.json';

export const VERSAO_ATUAL: string = packageJson.version;
export const GITHUB_REPO = 'llorenzus/tormenta-rpg-gerenciador-fichas';
export const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;
export const GITHUB_API_LATEST_RELEASE = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

const STORAGE_KEY_ULTIMA_CHECAGEM = '@trpg_ultima_checagem_atualizacao';
const INTERVALO_CHECAGEM_MS = 24 * 60 * 60 * 1000; // 24 horas

// Carregamento resiliente de dependências nativas (compatível com Node.js, Web, Electron e React Native)
let Platform: any = { OS: 'unknown' };
try {
  Platform = require('react-native').Platform;
} catch {
  Platform = { OS: 'unknown' };
}

let AsyncStorage: any = null;
try {
  const mod = require('@react-native-async-storage/async-storage');
  AsyncStorage = mod.default || mod;
} catch {
  const memStore = new Map<string, string>();
  AsyncStorage = {
    getItem: async (k: string) => memStore.get(k) || null,
    setItem: async (k: string, v: string) => {
      memStore.set(k, v);
    },
    removeItem: async (k: string) => {
      memStore.delete(k);
    },
  };
}

export interface InfoAtualizacao {
  temAtualizacao: boolean;
  versaoAtual: string;
  versaoNova: string;
  nomeRelease: string;
  notasVersao: string;
  urlDownload: string;
  urlRelease: string;
  publicadoEm?: string;
}

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size?: number;
}

export interface GitHubReleaseResponse {
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at?: string;
  assets?: ReleaseAsset[];
}

/**
 * Normaliza e compara duas strings de versão no padrão semver (ex: "v1.2.1" vs "1.2.0").
 * Retorna true se versaoRemota for estritamente mais nova que versaoAtual.
 */
export function compararVersaoMaisNova(versaoRemota: string, versaoAtual: string): boolean {
  const limpar = (v: string) =>
    v
      .replace(/^[^\d]*/, '') // Remove prefixos como 'v'
      .split('-')[0] // Ignora sufixos de pré-release
      .split('.')
      .map((num) => parseInt(num, 10) || 0);

  const partesRemota = limpar(versaoRemota);
  const partesAtual = limpar(versaoAtual);

  const maxLen = Math.max(partesRemota.length, partesAtual.length);

  for (let i = 0; i < maxLen; i++) {
    const rem = partesRemota[i] || 0;
    const atu = partesAtual[i] || 0;
    if (rem > atu) return true;
    if (rem < atu) return false;
  }

  return false;
}

/**
 * Seleciona a URL de download mais apropriada para a plataforma atual (Android APK ou Windows EXE).
 * Aceita uma plataforma explícita opcional para testes ou sobreposição.
 */
export function selecionarUrlDownload(
  assets: ReleaseAsset[] = [],
  fallbackUrl: string,
  plataformaOverride?: 'android' | 'windows' | 'web'
): string {
  const isElectron =
    typeof window !== 'undefined' &&
    Boolean((window as any).electronAPI?.isElectron);

  const isWindows =
    plataformaOverride === 'windows' ||
    (!plataformaOverride &&
      (isElectron ||
        Platform.OS === 'windows' ||
        (Platform.OS === 'web' &&
          typeof navigator !== 'undefined' &&
          /win/i.test(navigator.userAgent))));

  const isAndroid =
    plataformaOverride === 'android' ||
    (!plataformaOverride && Platform.OS === 'android');

  if (isWindows) {
    // Procura executável Windows (.exe), priorizando Setup/Instalador
    const setupAsset = assets.find(
      (a) =>
        a.name.toLowerCase().endsWith('.exe') &&
        a.name.toLowerCase().includes('setup')
    );
    if (setupAsset) return setupAsset.browser_download_url;

    const anyExeAsset = assets.find((a) => a.name.toLowerCase().endsWith('.exe'));
    if (anyExeAsset) return anyExeAsset.browser_download_url;
  } else if (isAndroid) {
    // Procura arquivo de pacote Android (.apk)
    const apkAsset = assets.find((a) => a.name.toLowerCase().endsWith('.apk'));
    if (apkAsset) return apkAsset.browser_download_url;
  }

  // Fallback: URL da release no GitHub para o usuário escolher o arquivo
  return fallbackUrl;
}

/**
 * Verifica se há uma nova versão disponível no GitHub.
 * @param forcarSeRecente Se true, ignora o intervalo de 24h e consulta a API imediatamente.
 */
export async function checarAtualizacaoOnline(
  forcarSeRecente: boolean = false
): Promise<InfoAtualizacao | null> {
  try {
    if (!forcarSeRecente && AsyncStorage) {
      const ultimaChecagemStr = await AsyncStorage.getItem(STORAGE_KEY_ULTIMA_CHECAGEM);
      if (ultimaChecagemStr) {
        const ultimaChecagem = parseInt(ultimaChecagemStr, 10);
        const agora = Date.now();
        if (agora - ultimaChecagem < INTERVALO_CHECAGEM_MS) {
          // Checagem recente realizada; ignora silenciosamente em background
          return null;
        }
      }
    }

    if (AsyncStorage) {
      await AsyncStorage.setItem(STORAGE_KEY_ULTIMA_CHECAGEM, Date.now().toString());
    }

    // Timeout de 7 segundos para não bloquear conexões lentas
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 7000) : null;

    const response = await fetch(GITHUB_API_LATEST_RELEASE, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'TormentaRPG-Fichas-App',
      },
      signal: controller ? controller.signal : undefined,
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      // Pode ser 404 (sem releases ainda) ou rate limit excedido
      return null;
    }

    const data: GitHubReleaseResponse = await response.json();
    if (!data || !data.tag_name) {
      return null;
    }

    const versaoNovaLimpa = data.tag_name.replace(/^[^\d]*/, '');
    const temNovaVersao = compararVersaoMaisNova(data.tag_name, VERSAO_ATUAL);

    const urlDownload = selecionarUrlDownload(
      data.assets || [],
      data.html_url || GITHUB_RELEASES_URL
    );

    return {
      temAtualizacao: temNovaVersao,
      versaoAtual: VERSAO_ATUAL,
      versaoNova: versaoNovaLimpa || data.tag_name,
      nomeRelease: data.name || `Versão ${data.tag_name}`,
      notasVersao: data.body || 'Correções e melhorias gerais de estabilidade.',
      urlDownload,
      urlRelease: data.html_url || GITHUB_RELEASES_URL,
      publicadoEm: data.published_at,
    };
  } catch (error) {
    // Falha silenciosa em caso de ausência de conexão com internet
    return null;
  }
}
