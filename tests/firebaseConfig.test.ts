import { describe, it } from 'node:test';
import assert from 'node:assert';
import { app, auth, db, firebaseConfig, isFirebaseConfigured } from '../src/services/firebase';

describe('Configuração do Firebase (Auth e Firestore com Persistência Offline)', () => {
  it('deve exportar as instâncias singleton de app, auth e db', () => {
    assert.ok(app, 'FirebaseApp deve estar inicializado');
    assert.ok(auth, 'FirebaseAuth deve estar inicializado');
    assert.ok(db, 'FirebaseFirestore deve estar inicializado');
  });

  it('deve possuir a estrutura padrão de firebaseConfig com campos de ambiente', () => {
    assert.strictEqual(typeof firebaseConfig, 'object');
    assert.ok('apiKey' in firebaseConfig);
    assert.ok('authDomain' in firebaseConfig);
    assert.ok('projectId' in firebaseConfig);
    assert.ok('storageBucket' in firebaseConfig);
    assert.ok('messagingSenderId' in firebaseConfig);
    assert.ok('appId' in firebaseConfig);
    assert.ok('measurementId' in firebaseConfig);
  });

  it('deve validar corretamente se o Firebase está configurado', () => {
    const configurado = isFirebaseConfigured();
    assert.strictEqual(typeof configurado, 'boolean');
  });

  it('deve garantir que o Firestore foi instanciado com o app correto', () => {
    assert.strictEqual(db.app, app);
    assert.strictEqual(auth.app, app);
  });
});
