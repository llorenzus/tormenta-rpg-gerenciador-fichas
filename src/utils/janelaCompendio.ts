import { Platform } from 'react-native';

/**
 * Abre o Compêndio em uma janela separada no Windows (Electron) ou navegador Web.
 */
export function abrirCompendioEmJanelaSeparada(): void {
  if (typeof window === 'undefined') return;

  const electronAPI = (window as any).electronAPI;
  if (electronAPI && typeof electronAPI.abrirJanelaCompendio === 'function') {
    electronAPI.abrirJanelaCompendio();
    return;
  }

  if (Platform.OS === 'web') {
    const baseUrl = window.location.href.split('?')[0];
    window.open(
      `${baseUrl}?janela=compendio`,
      'CompendioTRPG',
      'width=1100,height=800,menubar=no,toolbar=no,status=no,resizable=yes'
    );
  }
}
