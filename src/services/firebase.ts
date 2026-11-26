import { getApps, initializeApp, FirebaseApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  inMemoryPersistence,
} from 'firebase/auth';
import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
} from 'firebase/firestore';

/**
 * Detecção segura da plataforma (Web, Electron Desktop, React Native Android/iOS ou Node)
 */
function isWebEnvironment(): boolean {
  try {
    const rn = require('react-native');
    if (rn?.Platform?.OS) {
      return rn.Platform.OS === 'web';
    }
  } catch {
    // Ambiente Node / Testes
  }
  return typeof window !== 'undefined';
}

/**
 * Obtenção resiliente do AsyncStorage para persistência do Auth no Mobile
 */
function getAsyncStorage(): any {
  try {
    const mod = require('@react-native-async-storage/async-storage');
    return mod.default || mod;
  } catch {
    return null;
  }
}

/**
 * Configuração do Firebase lida exclusivamente de variáveis de ambiente.
 * No Expo (Android, iOS e Web/Electron), variáveis iniciadas com EXPO_PUBLIC_
 * são automaticamente injetadas em tempo de build.
 */
export const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    process.env.FIREBASE_API_KEY ||
    'AIzaSyCQNRuOD1YANvq9UX0FjmC7XdCXA_qWNyA',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    process.env.FIREBASE_AUTH_DOMAIN ||
    'trpg-gerenciador-fichas.firebaseapp.com',
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    'trpg-gerenciador-fichas',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.FIREBASE_STORAGE_BUCKET ||
    'trpg-gerenciador-fichas.firebasestorage.app',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.FIREBASE_MESSAGING_SENDER_ID ||
    '1027929319516',
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    process.env.FIREBASE_APP_ID ||
    '1:1027929319516:web:b427353797cbb5824d1e99',
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    process.env.FIREBASE_MEASUREMENT_ID ||
    'G-DXQ8F9F6LG',
};

/**
 * Verifica se as credenciais mínimas obrigatórias do Firebase foram fornecidas no .env
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

// Inicializa a instância do Firebase App como singleton
const app: FirebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(
        isFirebaseConfigured()
          ? firebaseConfig
          : {
              apiKey: 'trpg-placeholder-key',
              authDomain: 'trpg-placeholder.firebaseapp.com',
              projectId: 'trpg-placeholder-proj',
              appId: '1:123456789:web:placeholder',
            }
      );

/**
 * Inicializa o Firebase Auth com persistência de sessão compatível com:
 * - Windows Desktop / Web (Electron): browserLocalPersistence (LocalStorage / IndexedDB nativo)
 * - Android / iOS Mobile (React Native): AsyncStorage (persistência nativa entre reinicializações)
 * - Testes / Headless: inMemoryPersistence (fallback seguro)
 */
let auth: Auth;
try {
  if (isWebEnvironment()) {
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } else {
    // React Native (Android / iOS)
    let rnPersistence: any;
    const storage = getAsyncStorage();
    if (storage) {
      try {
        const authModule = require('firebase/auth');
        if (typeof authModule.getReactNativePersistence === 'function') {
          rnPersistence = authModule.getReactNativePersistence(storage);
        }
      } catch {
        rnPersistence = undefined;
      }
    }

    auth = initializeAuth(app, {
      persistence: rnPersistence || inMemoryPersistence,
    });
  }
} catch {
  auth = getAuth(app);
}

/**
 * Inicializa o Cloud Firestore com persistência offline nativa habilitada.
 * Utiliza cache persistente local com gerenciador multi-abas (fundamental no Windows para suportar
 * janelas independentes, como a janela do Compêndio do Electron) e fallback resiliente para Android.
 */
let db: Firestore;
try {
  db = initializeFirestore(app, {
    ignoreUndefinedProperties: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch {
  try {
    db = initializeFirestore(app, {
      ignoreUndefinedProperties: true,
      localCache: persistentLocalCache(),
    });
  } catch {
    db = getFirestore(app);
  }
}

export { app, auth, db };
export default app;
