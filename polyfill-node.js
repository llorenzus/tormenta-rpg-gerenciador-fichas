// Polyfill para Node.js < 22 (suporte ao método estático global URL.parse usado no Expo SDK 58)
if (typeof URL !== 'undefined' && typeof URL.parse !== 'function') {
  URL.parse = function (input, base) {
    try {
      return new URL(input, base);
    } catch {
      return null;
    }
  };
}

if (typeof globalThis.__DEV__ === 'undefined') {
  globalThis.__DEV__ = false;
}

// Carregamento resiliente de variáveis do .env no ambiente Node.js (testes e scripts)
try {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const conteudo = fs.readFileSync(envPath, 'utf8');
    conteudo.split(/\r?\n/).forEach((linha) => {
      const match = linha.trim().match(/^([^=]+)=(.*)$/);
      if (match && !match[1].startsWith('#')) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch {
  // Ignora se não conseguir ler .env
}


