import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { FichaPersonagem, normalizarFicha } from '../models/ficha';
import { db, isFirebaseConfigured } from './firebase';
import { sanitizarParaFirestore } from './syncService';

export interface PerfilPublicoUsuario {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  atualizadoEm: number;
}

export interface ResultadoBuscaUsuario {
  usuario: PerfilPublicoUsuario | null;
  erro?: string;
  erroPermissao?: boolean;
}

/**
 * Registra ou atualiza os dados públicos de busca do usuário (email e username em minúsculo)
 */
export async function registrarPerfilUsuario(user: User, usernameCustom?: string): Promise<void> {
  if (!isFirebaseConfigured() || !user || !user.uid) return;

  try {
    const emailLimpo = user.email ? user.email.toLowerCase().trim() : '';
    const nomeBase =
      usernameCustom?.trim() ||
      user.displayName?.trim() ||
      user.email?.split('@')[0]?.trim() ||
      'Jogador';
    const usernameLimpo = nomeBase.toLowerCase().trim();

    const perfil: PerfilPublicoUsuario = {
      uid: user.uid,
      email: emailLimpo,
      username: usernameLimpo,
      displayName: nomeBase,
      atualizadoEm: Date.now(),
    };

    const docRef = doc(db, 'users_profiles', user.uid);
    await setDoc(docRef, perfil, { merge: true });
  } catch (error: any) {
    console.warn('Erro ao registrar perfil de usuário para busca:', error?.code, error?.message);
  }
}

/**
 * Busca um usuário por username ou email exato no Firestore
 */
export async function buscarUsuarioPorIdentificador(
  termo: string
): Promise<ResultadoBuscaUsuario> {
  if (!isFirebaseConfigured() || !termo) return { usuario: null };

  const termoNormalizado = termo.trim().toLowerCase();
  if (!termoNormalizado) return { usuario: null };

  // Se o usuário digitou o UID do Firebase diretamente (ex: 28 caracteres)
  const pareceUid = /^[a-zA-Z0-9_-]{20,40}$/.test(termo.trim());

  try {
    const colRef = collection(db, 'users_profiles');

    // 1. Tenta buscar por e-mail exato
    const qEmail = query(colRef, where('email', '==', termoNormalizado));
    const snapEmail = await getDocs(qEmail);
    if (!snapEmail.empty) {
      return { usuario: snapEmail.docs[0].data() as PerfilPublicoUsuario };
    }

    // 2. Tenta buscar por username
    const qUsername = query(colRef, where('username', '==', termoNormalizado));
    const snapUsername = await getDocs(qUsername);
    if (!snapUsername.empty) {
      return { usuario: snapUsername.docs[0].data() as PerfilPublicoUsuario };
    }

    // 3. Se parece um UID, tenta buscar diretamente pelo ID do documento
    if (pareceUid) {
      const docDirectRef = doc(db, 'users_profiles', termo.trim());
      const snapDirect = await getDoc(docDirectRef);
      if (snapDirect.exists()) {
        return { usuario: snapDirect.data() as PerfilPublicoUsuario };
      }
      // Se não encontrou documento com esse UID mas o formato é válido, permite vincular diretamente
      return {
        usuario: {
          uid: termo.trim(),
          email: '',
          username: termo.trim().slice(0, 8),
          displayName: `Jogador (${termo.trim().slice(0, 6)}...)`,
          atualizadoEm: Date.now(),
        },
      };
    }

    return { usuario: null };
  } catch (error: any) {
    console.warn('Erro ao buscar usuário por identificador:', error?.code, error?.message);
    const isPerm =
      error?.code === 'permission-denied' ||
      error?.message?.includes('permission') ||
      error?.message?.includes('PERMISSION_DENIED');

    return {
      usuario: null,
      erro: isPerm
        ? 'Permissão negada no Firestore (permission-denied). As regras de segurança para busca de contas precisam ser publicadas no Firebase Console.'
        : error?.message || 'Falha ao buscar usuário no servidor.',
      erroPermissao: isPerm,
    };
  }
}

/**
 * Função pura: Aplica a lógica de compartilhamento sobre os dados da ficha
 */
export function aplicarCompartilhamentoFicha(
  dono: { uid: string; displayName?: string | null; email?: string | null },
  ficha: FichaPersonagem,
  alvo: { uid: string; email?: string; username?: string; displayName?: string }
): FichaPersonagem {
  if (!dono || !dono.uid || !ficha || !ficha.id || !alvo || !alvo.uid) {
    throw new Error('Parâmetros inválidos para compartilhar ficha.');
  }

  if (dono.uid === alvo.uid) {
    throw new Error('Você já é o proprietário desta ficha.');
  }

  const uidsExistentes = new Set<string>(ficha.sharedWithUids || []);
  uidsExistentes.add(alvo.uid);

  const listaCompartilhada = Array.isArray(ficha.compartilhadaCom) ? [...ficha.compartilhadaCom] : [];
  const idx = listaCompartilhada.findIndex((item) => item.uid === alvo.uid);
  const infoNovo = {
    uid: alvo.uid,
    email: alvo.email || '',
    username: alvo.username || alvo.displayName || alvo.email?.split('@')[0] || 'Jogador',
    compartilhadoEm: Date.now(),
  };

  if (idx >= 0) {
    listaCompartilhada[idx] = infoNovo;
  } else {
    listaCompartilhada.push(infoNovo);
  }

  const donoNome = dono.displayName?.trim() || dono.email?.split('@')[0]?.trim() || 'Jogador';
  return normalizarFicha({
    ...ficha,
    userId: dono.uid,
    donoId: dono.uid,
    donoNome,
    sharedWithUids: Array.from(uidsExistentes),
    compartilhadaCom: listaCompartilhada,
    atualizadoEm: Date.now(),
    updatedAt: Date.now(),
  });
}

/**
 * Função pura: Aplica a lógica de remoção/revogação de compartilhamento sobre os dados da ficha
 */
export function aplicarRevogacaoCompartilhamento(
  dono: { uid: string },
  ficha: FichaPersonagem,
  alvoUid: string
): FichaPersonagem {
  if (!dono || !dono.uid || !ficha || !ficha.id || !alvoUid) {
    return ficha;
  }

  const uids = (ficha.sharedWithUids || []).filter((uid) => uid !== alvoUid);
  const compartilhados = (ficha.compartilhadaCom || []).filter((item) => item.uid !== alvoUid);

  return normalizarFicha({
    ...ficha,
    userId: dono.uid,
    donoId: dono.uid,
    sharedWithUids: uids,
    compartilhadaCom: compartilhados,
    atualizadoEm: Date.now(),
    updatedAt: Date.now(),
  });
}

/**
 * Compartilha uma ficha com outro usuário identificado pelo UID
 */
export async function compartilharFichaComUsuario(
  dono: User,
  ficha: FichaPersonagem,
  alvo: { uid: string; email?: string; username?: string; displayName?: string }
): Promise<FichaPersonagem> {
  const fichaAtualizada = aplicarCompartilhamentoFicha(dono, ficha, alvo);

  if (isFirebaseConfigured()) {
    // 1. Salva na coleção pública/compartilhada `shared_characters/{ficha.id}`
    const docSharedRef = doc(db, 'shared_characters', ficha.id);
    const dadosShared = sanitizarParaFirestore({
      ...fichaAtualizada,
      ownerId: dono.uid,
      donoId: dono.uid,
      donoNome: fichaAtualizada.donoNome,
    });
    await setDoc(docSharedRef, dadosShared);

    // 2. Atualiza no repositório de personagens do próprio dono
    const docDonoRef = doc(db, 'users', dono.uid, 'characters', ficha.id);
    await setDoc(docDonoRef, sanitizarParaFirestore(fichaAtualizada));
  }

  return fichaAtualizada;
}

/**
 * Remove o compartilhamento de uma ficha com determinado usuário
 */
export async function removerCompartilhamentoFicha(
  dono: User,
  ficha: FichaPersonagem,
  alvoUid: string
): Promise<FichaPersonagem> {
  const fichaAtualizada = aplicarRevogacaoCompartilhamento(dono, ficha, alvoUid);
  const uids = fichaAtualizada.sharedWithUids || [];

  if (isFirebaseConfigured()) {
    const docSharedRef = doc(db, 'shared_characters', ficha.id);
    if (uids.length === 0) {
      // Se não sobrou ninguém com acesso compartilhado, remove o documento de compartilhamento
      await deleteDoc(docSharedRef).catch(() => {});
    } else {
      const dadosShared = sanitizarParaFirestore({
        ...fichaAtualizada,
        ownerId: dono.uid,
        donoId: dono.uid,
        donoNome: dono.displayName?.trim() || dono.email?.split('@')[0]?.trim() || 'Jogador',
      });
      await setDoc(docSharedRef, dadosShared);
    }

    // Atualiza a ficha no diretório do dono
    const docDonoRef = doc(db, 'users', dono.uid, 'characters', ficha.id);
    await setDoc(docDonoRef, sanitizarParaFirestore(fichaAtualizada)).catch(() => {});
  }

  return fichaAtualizada;
}

/**
 * Se a ficha possui compartilhamento ativo, propaga a atualização para `shared_characters/{ficha.id}`
 */
export async function atualizarFichaCompartilhadaSeHouver(
  ownerUid: string,
  ficha: FichaPersonagem
): Promise<void> {
  if (!isFirebaseConfigured() || !ownerUid || !ficha || !ficha.id) return;
  if (!Array.isArray(ficha.sharedWithUids) || ficha.sharedWithUids.length === 0) return;

  try {
    const docSharedRef = doc(db, 'shared_characters', ficha.id);
    const dados = sanitizarParaFirestore({
      ...normalizarFicha(ficha),
      ownerId: ownerUid,
      donoId: ownerUid,
      donoNome: ficha.donoNome || ficha.jogador || 'Jogador',
    });
    await setDoc(docSharedRef, dados);
  } catch (err) {
    console.warn('Erro ao sincronizar atualização de ficha compartilhada:', err);
  }
}

/**
 * Remove a ficha da coleção de compartilhamento quando o dono a exclui
 */
export async function removerFichaCompartilhadaAoExcluir(fichaId: string): Promise<void> {
  if (!isFirebaseConfigured() || !fichaId) return;

  try {
    const docSharedRef = doc(db, 'shared_characters', fichaId);
    await deleteDoc(docSharedRef);
  } catch (err) {
    console.warn('Erro ao remover ficha compartilhada excluída:', err);
  }
}

/**
 * Escuta em tempo real todas as fichas compartilhadas com o usuário logado
 */
export function observarFichasCompartilhadasComigo(
  myUid: string,
  onAtualizacao: (fichas: FichaPersonagem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured() || !myUid) {
    onAtualizacao([]);
    return () => {};
  }

  try {
    const colRef = collection(db, 'shared_characters');
    const q = query(colRef, where('sharedWithUids', 'array-contains', myUid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fichas: FichaPersonagem[] = snapshot.docs.map((docSnap) => {
          const dados = docSnap.data() as FichaPersonagem;
          return normalizarFicha({
            ...dados,
            id: docSnap.id,
            isCompartilhadaComigo: true,
            donoNome: dados.donoNome || (dados as any).ownerName || dados.jogador || 'Outro Jogador',
            donoId: dados.donoId || (dados as any).ownerId,
          });
        });

        // Ordena por data decrescente de atualização
        fichas.sort((a, b) => {
          const timeA = Number(a.updatedAt || a.atualizadoEm) || 0;
          const timeB = Number(b.updatedAt || b.atualizadoEm) || 0;
          return timeB - timeA;
        });

        onAtualizacao(fichas);
      },
      (error) => {
        console.warn('Erro ao escutar fichas compartilhadas:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error: any) {
    console.warn('Falha ao inicializar listener de fichas compartilhadas:', error);
    if (onError) onError(error);
    return () => {};
  }
}
