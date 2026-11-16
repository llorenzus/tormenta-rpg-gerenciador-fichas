const { contextBridge, ipcRenderer } = require('electron');

// Expõe a API do Electron para a janela de forma segura
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  abrirJanelaCompendio: () => {
    ipcRenderer.send('abrir-janela-compendio');
  },
});
