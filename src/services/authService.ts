import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

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

export interface RespostaAuth {
  sucesso: boolean;
  usuario?: User | null;
  erro?: string;
}

/**
 * Traduz códigos de erro do Firebase Auth para mensagens amigáveis em português.
 */
export function traduzirErroAuth(codigoOuMensagem?: string): string {
  if (!codigoOuMensagem) return 'Ocorreu um erro desconhecido.';

  if (codigoOuMensagem.includes('auth/email-already-in-use')) {
    return 'Este e-mail já está cadastrado em outra conta.';
  }
  if (codigoOuMensagem.includes('auth/invalid-email')) {
    return 'O formato do e-mail inserido é inválido.';
  }
  if (codigoOuMensagem.includes('auth/user-not-found')) {
    return 'Nenhuma conta encontrada com este e-mail.';
  }
  if (
    codigoOuMensagem.includes('auth/wrong-password') ||
    codigoOuMensagem.includes('auth/invalid-credential')
  ) {
    return 'E-mail ou senha incorretos.';
  }
  if (codigoOuMensagem.includes('auth/weak-password')) {
    return 'A senha é fraca. Crie uma senha com pelo menos 6 caracteres.';
  }
  if (codigoOuMensagem.includes('auth/network-request-failed')) {
    return 'Falha na conexão com a internet. Verifique sua rede e tente novamente.';
  }
  if (codigoOuMensagem.includes('auth/too-many-requests')) {
    return 'Muitas tentativas falhas. Bloqueado temporariamente por segurança; aguarde alguns instantes.';
  }
  if (codigoOuMensagem.includes('auth/popup-closed-by-user')) {
    return 'Janela de autenticação cancelada pelo usuário.';
  }
  if (codigoOuMensagem.includes('auth/popup-blocked')) {
    return 'A janela de autenticação foi bloqueada pelo navegador.';
  }

  return 'Não foi possível concluir a autenticação. Tente novamente.';
}

/**
 * Observa alterações no estado de autenticação (login / logout)
 */
export function observarEstadoAuth(callback: (usuario: User | null) => void): () => void {
  try {
    return onAuthStateChanged(auth, callback);
  } catch (error) {
    callback(null);
    return () => {};
  }
}

/**
 * Retorna o usuário logado no momento (ou null se anônimo/offline)
 */
export function obterUsuarioAtual(): User | null {
  try {
    return auth?.currentUser || null;
  } catch {
    return null;
  }
}

/**
 * Realiza login com E-mail e Senha
 */
export async function loginComEmail(email: string, pass: string): Promise<RespostaAuth> {
  const emailTrim = email.trim();
  if (!emailTrim || !pass) {
    return {
      sucesso: false,
      erro: 'Preencha o e-mail e a senha para entrar.',
    };
  }

  if (!isFirebaseConfigured()) {
    return {
      sucesso: false,
      erro: 'O Firebase ainda não foi configurado no arquivo .env. Consulte o .env.example.',
    };
  }

  try {
    const credencial = await signInWithEmailAndPassword(auth, emailTrim, pass);
    return { sucesso: true, usuario: credencial.user };
  } catch (error: any) {
    return {
      sucesso: false,
      erro: traduzirErroAuth(error?.code || error?.message),
    };
  }
}

/**
 * Cria uma nova conta com E-mail e Senha
 */
export async function cadastrarComEmail(email: string, pass: string): Promise<RespostaAuth> {
  const emailTrim = email.trim();
  if (!emailTrim || !pass) {
    return {
      sucesso: false,
      erro: 'Preencha o e-mail e a senha para se cadastrar.',
    };
  }

  if (pass.length < 6) {
    return {
      sucesso: false,
      erro: 'A senha deve ter no mínimo 6 caracteres.',
    };
  }

  if (!isFirebaseConfigured()) {
    return {
      sucesso: false,
      erro: 'O Firebase ainda não foi configurado no arquivo .env. Consulte o .env.example.',
    };
  }

  try {
    const credencial = await createUserWithEmailAndPassword(auth, emailTrim, pass);
    return { sucesso: true, usuario: credencial.user };
  } catch (error: any) {
    return {
      sucesso: false,
      erro: traduzirErroAuth(error?.code || error?.message),
    };
  }
}

/**
 * Envia e-mail de recuperação e redefinição de senha
 */
export async function redefinirSenha(email: string): Promise<RespostaAuth> {
  const emailTrim = email.trim();
  if (!emailTrim) {
    return {
      sucesso: false,
      erro: 'Informe o e-mail para receber o link de redefinição de senha.',
    };
  }

  if (!isFirebaseConfigured()) {
    return {
      sucesso: false,
      erro: 'O Firebase ainda não foi configurado no arquivo .env. Consulte o .env.example.',
    };
  }

  try {
    await sendPasswordResetEmail(auth, emailTrim);
    return { sucesso: true };
  } catch (error: any) {
    return {
      sucesso: false,
      erro: traduzirErroAuth(error?.code || error?.message),
    };
  }
}

/**
 * Realiza login com conta Google (suportado nativamente no Windows Desktop/Web via Popup).
 * No Android, orienta o usuário ou executa se o provider for suportado.
 */
export async function loginComGoogle(): Promise<RespostaAuth> {
  if (!isFirebaseConfigured()) {
    return {
      sucesso: false,
      erro: 'O Firebase ainda não foi configurado no arquivo .env.',
    };
  }

  try {
    const isWebOrDesktop =
      isWebEnvironment() ||
      (typeof window !== 'undefined' && Boolean((window as any).electronAPI?.isElectron));

    if (isWebOrDesktop) {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credencial = await signInWithPopup(auth, provider);
      return { sucesso: true, usuario: credencial.user };
    }

    // No Android mobile nativo, o signInWithPopup do Firebase JS não abre janelas nativas de app
    return {
      sucesso: false,
      erro: 'No momento, o Login com Google está disponível no Desktop Windows. No celular, utilize Login com E-mail e Senha.',
    };
  } catch (error: any) {
    return {
      sucesso: false,
      erro: traduzirErroAuth(error?.code || error?.message),
    };
  }
}

/**
 * Desconecta a conta do usuário (Logout).
 * ATENÇÃO: Conforme especificado nas regras, o logout desconecta a conta
 * MAS NÃO apaga nenhuma ficha salva no dispositivo local.
 */
export async function fazerLogout(): Promise<RespostaAuth> {
  try {
    await signOut(auth);
    return { sucesso: true };
  } catch (error: any) {
    return {
      sucesso: false,
      erro: traduzirErroAuth(error?.code || error?.message),
    };
  }
}
