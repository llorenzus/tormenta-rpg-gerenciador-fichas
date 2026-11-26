import { describe, it } from 'node:test';
import assert from 'node:assert';
import { app, auth, db, firebaseConfig, isFirebaseConfigured } from '../src/services/firebase';

describe('Configuração e Conexão do Firebase (Auth e Firestore)', () => {
  it('deve exportar as instâncias singleton de app, auth e db', () => {
    assert.ok(app, 'FirebaseApp deve estar inicializado');
    assert.ok(auth, 'FirebaseAuth deve estar inicializado');
    assert.ok(db, 'FirebaseFirestore deve estar inicializado');
  });

  it('deve carregar com sucesso as credenciais do .env para firebaseConfig', () => {
    assert.strictEqual(typeof firebaseConfig, 'object');
    assert.ok(firebaseConfig.apiKey, 'apiKey não deve estar vazia');
    assert.strictEqual(firebaseConfig.projectId, 'trpg-gerenciador-fichas');
    assert.strictEqual(firebaseConfig.authDomain, 'trpg-gerenciador-fichas.firebaseapp.com');
    assert.strictEqual(firebaseConfig.storageBucket, 'trpg-gerenciador-fichas.firebasestorage.app');
    assert.strictEqual(firebaseConfig.messagingSenderId, '1027929319516');
    assert.strictEqual(firebaseConfig.appId, '1:1027929319516:web:b427353797cbb5824d1e99');
  });

  it('deve validar que isFirebaseConfigured() retorna true com o .env preenchido', () => {
    const configurado = isFirebaseConfigured();
    assert.strictEqual(configurado, true, 'isFirebaseConfigured() deve ser true quando as chaves existem');
  });

  it('deve garantir que o Firestore e Auth foram instanciados com o app correto', () => {
    assert.strictEqual(db.app, app);
    assert.strictEqual(auth.app, app);
  });

  it('deve testar a conectividade online com os servidores de autenticação do Firebase (Ping de Conexão)', async () => {
    // Testa comunicação direta com a API pública do Firebase Auth Identity Toolkit da Google
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${firebaseConfig.apiKey}`;
    const resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ continueUri: 'http://localhost' }),
    });

    // Se a chave for inválida ou o projeto não existir, Google retorna 400 com API_KEY_INVALID ou 403
    // Quando a chave é válida e a conexão funciona, Google processa e responde (código 400 por payload de teste esperado)
    const dados = (await resposta.json()) as any;
    assert.ok(dados, 'Deve receber resposta dos servidores da Google');
    assert.notStrictEqual(dados?.error?.message, 'API_KEY_INVALID', 'A chave do Firebase deve ser válida na Google');
    assert.strictEqual(
      dados?.error?.message,
      'MISSING_IDENTIFIER',
      'Servidor do Firebase respondeu com sucesso à chamada'
    );
  });
});
