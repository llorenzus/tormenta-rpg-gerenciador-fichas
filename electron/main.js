const { app, BrowserWindow, shell, protocol, net } = require('electron');
const path = require('path');
const url = require('url');

// Registra o esquema 'app' como privilegiado antes do evento ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      allowServiceWorkers: true,
      corsEnabled: true,
    },
  },
]);

function createWindow() {
  const iconPath = path.join(__dirname, '../assets/icon.png');

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    title: 'TRPG - Gerenciador de Fichas',
    icon: iconPath,
    autoHideMenuBar: true,
    backgroundColor: '#FAF6EE',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    mainWindow.loadURL('app://bundle/index.html');
  }

  // Permite abrir DevTools com Ctrl+Shift+I ou F12 para diagnóstico se necessário
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  // Abre links externos no navegador padrão do usuário
  mainWindow.webContents.setWindowOpenHandler(({ url: targetUrl }) => {
    if (targetUrl.startsWith('http:') || targetUrl.startsWith('https:')) {
      shell.openExternal(targetUrl);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

app.whenReady().then(() => {
  // Protocolo app:// mapeia para a pasta dist/
  protocol.handle('app', (request) => {
    try {
      const parsedUrl = new URL(request.url);
      let pathname = decodeURIComponent(parsedUrl.pathname);
      if (!pathname || pathname === '/') {
        pathname = '/index.html';
      }

      const distPath = path.join(__dirname, '../dist');
      const resolvedPath = path.join(distPath, pathname);

      return net.fetch(url.pathToFileURL(resolvedPath).toString());
    } catch (err) {
      console.error('[Protocol app Error]', err);
      throw err;
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
