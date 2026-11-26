import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  cadastrarComEmail,
  fazerLogout,
  loginComEmail,
  loginComGoogle,
  obterUsuarioAtual,
  redefinirSenha,
  traduzirErroAuth,
} from '../src/services/authService';

describe('Serviço de Autenticação (Firebase Auth)', () => {
  describe('traduzirErroAuth', () => {
    it('deve traduzir corretamente e-mail já cadastrado', () => {
      const msg = traduzirErroAuth('auth/email-already-in-use');
      assert.strictEqual(msg, 'Este e-mail já está cadastrado em outra conta.');
    });

    it('deve traduzir formato de e-mail inválido', () => {
      const msg = traduzirErroAuth('auth/invalid-email');
      assert.strictEqual(msg, 'O formato do e-mail inserido é inválido.');
    });

    it('deve traduzir credencial/senha incorreta', () => {
      const msg1 = traduzirErroAuth('auth/wrong-password');
      const msg2 = traduzirErroAuth('auth/invalid-credential');
      assert.strictEqual(msg1, 'E-mail ou senha incorretos.');
      assert.strictEqual(msg2, 'E-mail ou senha incorretos.');
    });

    it('deve traduzir senha fraca', () => {
      const msg = traduzirErroAuth('auth/weak-password');
      assert.strictEqual(msg, 'A senha é fraca. Crie uma senha com pelo menos 6 caracteres.');
    });

    it('deve traduzir falha de rede', () => {
      const msg = traduzirErroAuth('auth/network-request-failed');
      assert.strictEqual(msg, 'Falha na conexão com a internet. Verifique sua rede e tente novamente.');
    });

    it('deve retornar mensagem padrão para código desconhecido', () => {
      const msg = traduzirErroAuth('auth/codigo-desconhecido');
      assert.strictEqual(msg, 'Não foi possível concluir a autenticação. Tente novamente.');
    });
  });

  describe('Validações prévias de formulário', () => {
    it('deve rejeitar login com e-mail ou senha em branco', async () => {
      const res1 = await loginComEmail('', '');
      assert.strictEqual(res1.sucesso, false);
      assert.ok(res1.erro?.includes('Preencha'));

      const res2 = await loginComEmail('teste@teste.com', '');
      assert.strictEqual(res2.sucesso, false);
    });

    it('deve rejeitar cadastro com senha menor que 6 caracteres', async () => {
      const res = await cadastrarComEmail('novo@teste.com', '123');
      assert.strictEqual(res.sucesso, false);
      assert.ok(res.erro?.includes('6 caracteres'));
    });

    it('deve rejeitar redefinição com e-mail em branco', async () => {
      const res = await redefinirSenha('');
      assert.strictEqual(res.sucesso, false);
      assert.ok(res.erro?.includes('Informe o e-mail'));
    });
  });

  describe('Estado e Sessão', () => {
    it('deve retornar null para usuário inicial offline', () => {
      const user = obterUsuarioAtual();
      assert.strictEqual(user, null);
    });

    it('deve executar logout com sucesso sem apagar dados locais', async () => {
      const res = await fazerLogout();
      assert.strictEqual(res.sucesso, true);
    });
  });
});
