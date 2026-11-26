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

