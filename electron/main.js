const { app, BrowserWindow, shell, protocol, net, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const http = require('http');
const fs = require('fs');

// Define um User-Agent padrão Chrome para que o Google OAuth não bloqueie como 'disallowed_useragent'
app.userAgentFallback =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

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

let mainWindow = null;
let compendioWindow = null;
let localServer = null;
let localServerPort = null;
let activeFirebaseConfig = null;
let pendingAuthCallback = null;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

/**
 * Inicia um servidor HTTP local em 127.0.0.1 em uma porta dinâmica.
 * O Firebase Auth autoriza nativamente requisições em 'localhost', permitindo que
 * o signInWithPopup do Google funcione perfeitamente sem erros de origem ou domínio.
 */
function startLocalServer(distPath) {
  return new Promise((resolve) => {
    try {
      localServer = http.createServer((req, res) => {
        try {
          const parsed = url.parse(req.url, true);
          let reqPath = decodeURIComponent(parsed.pathname || '/');

          // Rota de callback do Google OAuth vindo do navegador externo
          if (reqPath === '/auth-callback') {
            if (req.method === 'OPTIONS') {
              res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
              });
              res.end();
              return;
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                try {
                  const data = JSON.parse(body || '{}');
                  if (pendingAuthCallback) {
                    pendingAuthCallback(data);
                    pendingAuthCallback = null;
                  }
                  if (mainWindow && !mainWindow.isDestroyed()) {
                    if (mainWindow.isMinimized()) mainWindow.restore();
                    mainWindow.focus();
                  }
                  res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  });
                  res.end(JSON.stringify({ ok: true }));
                } catch (parseErr) {
                  res.writeHead(400, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  });
                  res.end(JSON.stringify({ ok: false, error: 'JSON inválido' }));
                }
              });
              return;
            }
          }

          // Rota da página bridge de autenticação Google no navegador padrão (RFC 8252)
          if (reqPath === '/auth-google') {
            const configJson = JSON.stringify(activeFirebaseConfig || {});
            const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Autenticação Google - Tormenta RPG</title>
  <style>
    * { box-sizing: border-box; }
    body {
      background-color: #12100e;
      color: #F4EAD4;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background-color: #1e1b18;
      border: 2px solid #8B0000;
      border-radius: 12px;
      padding: 36px 28px;
      max-width: 460px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.7);
    }
    .logo {
      font-size: 20px;
      font-weight: bold;
      color: #DAA520;
      letter-spacing: 1px;
      margin-bottom: 20px;
      text-transform: uppercase;
    }
    h2 {
      color: #F4EAD4;
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 22px;
    }
    p {
      color: #D3C3A3;
      font-size: 15px;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .spinner {
      border: 4px solid rgba(218, 165, 32, 0.2);
      border-top: 4px solid #DAA520;
      border-radius: 50%;
      width: 46px;
      height: 46px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .btn-manual {
      display: inline-block;
      background-color: #8B0000;
      color: #FFF;
      font-weight: bold;
      padding: 12px 28px;
      border-radius: 6px;
      border: 1px solid #DAA520;
      cursor: pointer;
      font-size: 15px;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    .btn-manual:hover {
      background-color: #A00000;
    }
    .success {
      color: #4CAF50 !important;
    }
    .error {
      color: #F44336 !important;
    }
  </style>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
</head>
<body>
  <div class="card" id="card">
    <div class="logo">TORMENTA RPG</div>
    <div class="spinner" id="spinner"></div>
    <h2 id="titulo">Conectando com o Google</h2>
    <p id="mensagem">Abrindo a janela de seleção de conta do Google com segurança...</p>
    <button id="btnAcao" class="btn-manual" style="display:none;" onclick="iniciarAuth()">Fazer Login com Google</button>
  </div>
  <script>
    var fbConfig = ${configJson};
    function iniciarAuth() {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(fbConfig);
        }
        document.getElementById('btnAcao').style.display = 'none';
        document.getElementById('spinner').style.display = 'block';
        document.getElementById('mensagem').textContent = 'Selecione sua conta Google na janela aberta pelo navegador...';

        var provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        firebase.auth().signInWithPopup(provider)
          .then(async function(result) {
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('titulo').textContent = '✓ Login Concluído!';
            document.getElementById('titulo').className = 'success';
            document.getElementById('mensagem').textContent = 'Autenticado com sucesso! Você já pode fechar esta aba e retornar ao aplicativo Tormenta RPG.';

            var credential = result.credential;
            var idToken = credential ? credential.idToken : await result.user.getIdToken();
            var accessToken = credential ? credential.accessToken : null;

            fetch('/auth-callback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                idToken: idToken,
                accessToken: accessToken,
                displayName: result.user.displayName,
                email: result.user.email,
                uid: result.user.uid
              })
            }).catch(function(err){ console.warn(err); });

            setTimeout(function() {
              window.close();
            }, 3000);
          })
          .catch(function(err) {
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('titulo').textContent = 'Falha no Login';
            document.getElementById('titulo').className = 'error';
            var erroMsg = err.message || 'Ocorreu um erro ao autenticar com o Google.';
            if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.indexOf('unauthorized-domain') !== -1)) {
              erroMsg = 'O domínio "localhost" precisa estar autorizado no Firebase Console. Acesse Firebase Console > Authentication > Settings > Authorized Domains e adicione "localhost".';
            }
            document.getElementById('mensagem').textContent = erroMsg;
            document.getElementById('btnAcao').style.display = 'inline-block';
            document.getElementById('btnAcao').textContent = 'Tentar Novamente';

            fetch('/auth-callback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ erro: err.message || err.code || 'Falha no login Google' })
            }).catch(function(){});
          });
      } catch (e) {
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('titulo').textContent = 'Erro ao Carregar';
        document.getElementById('titulo').className = 'error';
        document.getElementById('mensagem').textContent = e.message || 'Não foi possível inicializar os módulos do Google.';
        document.getElementById('btnAcao').style.display = 'inline-block';
      }
    }
    window.onload = iniciarAuth;
  </script>
</body>
</html>`;
            res.writeHead(200, {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-cache',
            });
            res.end(html);
            return;
          }

          if (reqPath === '/' || !reqPath) {
            reqPath = '/index.html';
          }
          const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
          const filePath = path.join(distPath, safePath);

          fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
              const indexPath = path.join(distPath, 'index.html');
              fs.readFile(indexPath, (idxErr, content) => {
                if (idxErr) {
                  res.writeHead(404, { 'Content-Type': 'text/plain' });
                  res.end('Not Found');
                } else {
                  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                  res.end(content);
                }
              });
              return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            fs.readFile(filePath, (readErr, content) => {
              if (readErr) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Read Error');
              } else {
                res.writeHead(200, {
                  'Content-Type': contentType,
                  'Cache-Control': 'no-cache',
                });
                res.end(content);
              }
            });
          });
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        }
      });

      // Tenta portas fixas prioritárias para manter a mesma origem http://localhost:PORT.
      // Manter a mesma porta garante que o IndexedDB (sessão do Firebase Auth) e o LocalStorage
      // sejam persistidos entre fechamentos e reaberturas do aplicativo no Windows.
      const portsToTry = [19542, 19543, 19544, 19545, 0];
      function tryNextPort(idx) {
        if (idx >= portsToTry.length) {
          resolve(null);
          return;
        }
        const port = portsToTry[idx];
        const onError = (err) => {
          localServer.removeListener('listening', onListening);
          if (err.code === 'EADDRINUSE') {
            tryNextPort(idx + 1);
          } else {
            console.warn('[LocalServer Error]', err);
            tryNextPort(idx + 1);
          }
        };
        const onListening = () => {
          localServer.removeListener('error', onError);
          localServerPort = localServer.address().port;
          resolve(localServerPort);
        };
        localServer.once('error', onError);
        localServer.once('listening', onListening);
        localServer.listen(port);
      }
      tryNextPort(0);
    } catch (e) {
      console.warn('[LocalServer Init Error]', e);
      resolve(null);
    }
  });
}

function createWindow() {
  const iconPath = path.join(__dirname, '../assets/icon.png');

  mainWindow = new BrowserWindow({
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
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else if (localServerPort) {
    mainWindow.loadURL(`http://localhost:${localServerPort}/index.html`);
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

  // Permite popups de autenticação do Firebase / Google e abre outros links externos no navegador
  mainWindow.webContents.setWindowOpenHandler(({ url: targetUrl }) => {
    if (
      !targetUrl ||
      targetUrl === 'about:blank' ||
      targetUrl.includes('firebaseapp.com') ||
      targetUrl.includes('accounts.google.com') ||
      targetUrl.includes('google.com') ||
      targetUrl.includes('googleapis.com')
    ) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 520,
          height: 680,
          autoHideMenuBar: true,
          title: 'Login Google',
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
          },
        },
      };
    }

    if (targetUrl.startsWith('http:') || targetUrl.startsWith('https:')) {
      shell.openExternal(targetUrl);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.webContents.on('did-create-window', (childWindow) => {
    childWindow.webContents.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createCompendioWindow() {
  if (compendioWindow && !compendioWindow.isDestroyed()) {
    compendioWindow.focus();
    return compendioWindow;
  }

  const iconPath = path.join(__dirname, '../assets/icon.png');

  compendioWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 800,
    minHeight: 550,
    title: 'TRPG - Compêndio de Regras',
    icon: iconPath,
    autoHideMenuBar: true,
    backgroundColor: '#FAF6EE',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const baseUrl =
    process.env.ELECTRON_START_URL ||
    (localServerPort ? `http://localhost:${localServerPort}/index.html` : 'app://bundle/index.html');
  const targetUrl = baseUrl.includes('?')
    ? `${baseUrl}&janela=compendio`
    : `${baseUrl}?janela=compendio`;

  compendioWindow.loadURL(targetUrl);

  compendioWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
      compendioWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  compendioWindow.webContents.setWindowOpenHandler(({ url: targetUrl }) => {
    if (
      !targetUrl ||
      targetUrl === 'about:blank' ||
      targetUrl.includes('firebaseapp.com') ||
      targetUrl.includes('accounts.google.com') ||
      targetUrl.includes('google.com') ||
      targetUrl.includes('googleapis.com')
    ) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 520,
          height: 680,
          autoHideMenuBar: true,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
          },
        },
      };
    }

    if (targetUrl.startsWith('http:') || targetUrl.startsWith('https:')) {
      shell.openExternal(targetUrl);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  compendioWindow.webContents.on('did-create-window', (childWindow) => {
    childWindow.webContents.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );
  });

  compendioWindow.on('closed', () => {
    compendioWindow = null;
  });

  return compendioWindow;
}

// Ouve chamadas do renderizador para abrir a janela destacada do Compêndio
ipcMain.on('abrir-janela-compendio', () => {
  createCompendioWindow();
});

// Ouve chamadas do renderizador para autenticação Google segura no navegador padrão (RFC 8252)
ipcMain.handle('iniciar-login-google-navegador', async (event, config) => {
  if (config) {
    activeFirebaseConfig = config;
  }
  return new Promise((resolve) => {
    pendingAuthCallback = resolve;
    if (localServerPort) {
      shell.openExternal(`http://localhost:${localServerPort}/auth-google`);
    } else {
      resolve({ erro: 'auth/network-request-failed' });
    }

    // Timeout de 3 minutos para segurança
    setTimeout(() => {
      if (pendingAuthCallback === resolve) {
        pendingAuthCallback = null;
        resolve({ erro: 'auth/popup-closed-by-user' });
      }
    }, 180000);
  });
});

app.whenReady().then(async () => {
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

  const distPath = path.join(__dirname, '../dist');
  await startLocalServer(distPath);

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

app.on('will-quit', () => {
  if (localServer) {
    try {
      localServer.close();
    } catch {}
  }
});
