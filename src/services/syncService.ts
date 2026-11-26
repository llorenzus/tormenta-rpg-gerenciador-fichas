import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { FichaPersonagem, normalizarFicha } from '../models/ficha';
import { db, isFirebaseConfigured } from './firebase';

export interface ResultadoMerge {
  mescladas: FichaPersonagem[];
  enviarParaNuvem: FichaPersonagem[];
}

/**
 * Remove propriedades com valor `undefined` para garantir compatibilidade estrita com Firestore
 */
export function sanitizarParaFirestore(ficha: FichaPersonagem): Record<string, any> {
  const limpo: Record<string, any> = {};
  for (const [chave, valor] of Object.entries(ficha)) {
    if (valor !== undefined) {
      limpo[chave] = valor;
    }
  }
  return limpo;
}

/**
 * Algoritmo puro de mesclagem (Merge) Offline-First:
 * - NUNCA apaga fichas locais se a nuvem estiver vazia (faz upload de tudo que é local).
 * - Se uma ficha existe apenas localmente: sobe para a nuvem.
 * - Se uma ficha existe apenas na nuvem: baixa e salva localmente.
 * - Se existe em ambos os lugares: mantém a versão com o updatedAt (ou atualizadoEm) mais recente.
 * - PROTEÇÃO MULTI-USUÁRIO: Se uma ficha local pertencer a outro usuário (f.userId !== userId),
 *   ela NUNCA é enviada nem mesclada na conta do novo usuário.
 */
export function mesclarFichasLocalENuvem(
  fichasLocais: FichaPersonagem[] = [],
  fichasNuvem: FichaPersonagem[] = [],
  userId?: string
): ResultadoMerge {
  const mapLocal = new Map<string, FichaPersonagem>();
  fichasLocais.forEach((f) => {
    if (f && f.id) {
      // Bloqueia contaminação cruzada: ignora fichas de outros usuários
      if (userId && f.userId && f.userId !== userId) {
        return;
      }
      mapLocal.set(f.id, normalizarFicha(f));
    }
  });

  const mapNuvem = new Map<string, FichaPersonagem>();
  fichasNuvem.forEach((f) => {
    if (f && f.id) mapNuvem.set(f.id, normalizarFicha(f));
  });

  const allIds = new Set<string>([...mapLocal.keys(), ...mapNuvem.keys()]);
  const mescladas: FichaPersonagem[] = [];
  const enviarParaNuvem: FichaPersonagem[] = [];

  for (const id of allIds) {
    const local = mapLocal.get(id);
    const cloud = mapNuvem.get(id);

    if (local && !cloud) {
      // 1. Existe somente no aparelho local: preserva e agenda upload para a nuvem
      const fichaComDono = userId ? { ...local, userId } : local;
      mescladas.push(fichaComDono);
      enviarParaNuvem.push(fichaComDono);
    } else if (!local && cloud) {
      // 2. Existe somente na nuvem: baixa para o aparelho local
      const fichaComDono = userId ? { ...cloud, userId } : cloud;
      mescladas.push(fichaComDono);
    } else if (local && cloud) {
      // 3. Existe nos dois: compara timestamps mais recentes
      const timeLocal = Number(local.updatedAt || local.atualizadoEm) || 0;
      const timeCloud = Number(cloud.updatedAt || cloud.atualizadoEm) || 0;

      if (timeLocal >= timeCloud) {
        const fichaComDono = userId ? { ...local, userId } : local;
        mescladas.push(fichaComDono);
        if (timeLocal > timeCloud) {
          enviarParaNuvem.push(fichaComDono);
        }
      } else {
        const fichaComDono = userId ? { ...cloud, userId } : cloud;
        mescladas.push(fichaComDono);
      }
    }
  }

  // Ordena por data decrescente
  mescladas.sort((a, b) => {
    const timeA = Number(a.updatedAt || a.atualizadoEm) || 0;
    const timeB = Number(b.updatedAt || b.atualizadoEm) || 0;
    return timeB - timeA;
  });

  return { mescladas, enviarParaNuvem };
}

/**
 * Lógica de Primeira Sincronização ao logar:
 * Lê a subcoleção users/{userId}/characters, executa o merge sem perda de dados locais,
 * atualiza o AsyncStorage e sobe as pendências para a nuvem em segundo plano.
 */
export async function sincronizarPrimeiroLogin(
  userId: string,
  fichasLocaisParam?: FichaPersonagem[]
): Promise<FichaPersonagem[]> {
  const storage = await import('../storage/fichaStorage');
  let locais: FichaPersonagem[] = fichasLocaisParam || (await storage.carregarFichasLocais());

  // Se a lista ativa estiver vazia (ex: logout recente de outro usuário), restaura o cache isolado deste usuário
  if (locais.length === 0 && userId) {
    const cacheDoUsuario = await storage.carregarCacheUsuario(userId);
    if (cacheDoUsuario.length > 0) {
      locais = cacheDoUsuario;
    }
  }

  // Filtra qualquer ficha que pertença expressamente a outro usuário
  if (userId) {
    locais = locais.filter((f) => !f.userId || f.userId === userId);
  }

  if (!isFirebaseConfigured() || !userId) {
    return locais;
  }

  try {
    const colRef = collection(db, 'users', userId, 'characters');
    const snapshot = await getDocs(colRef);
    const nuvem: FichaPersonagem[] = snapshot.docs.map((docSnap) => docSnap.data() as FichaPersonagem);

    const { mescladas, enviarParaNuvem } = mesclarFichasLocalENuvem(locais, nuvem, userId);

    // Salva a lista consolidada no armazenamento local da sessão ativa
    await storage.salvarListaFichasLocais(mescladas);

    // Salva também no cache isolado deste usuário
    await storage.armazenarCacheUsuario(userId, mescladas);

    // Envia para o Firestore as fichas locais novas ou mais atualizadas
    if (enviarParaNuvem.length > 0) {
      Promise.allSettled(
        enviarParaNuvem.map((ficha) => {
          const comDono = normalizarFicha({ ...ficha, userId });
          const limpa = sanitizarParaFirestore(comDono);
          return setDoc(doc(db, 'users', userId, 'characters', ficha.id), limpa);
        })
      ).catch((err) => {
        console.warn('Erro ao sincronizar uploads iniciais para o Firestore:', err);
      });
    }

    return mescladas;
  } catch (error) {
    console.warn('Falha na consulta ao Firestore. Mantendo fichas locais íntegras:', error);
    return locais;
  }
}

/**
 * Envia uma ficha específica para o Firestore (com o id do personagem como id do documento)
 */
export async function enviarFichaParaNuvem(userId: string, ficha: FichaPersonagem): Promise<void> {
  if (!isFirebaseConfigured() || !userId || !ficha || !ficha.id) return;

  try {
    const fichaPronta = normalizarFicha(ficha);
    const docRef = doc(db, 'users', userId, 'characters', fichaPronta.id);
    await setDoc(docRef, sanitizarParaFirestore(fichaPronta));
  } catch (err) {
    console.warn('Erro ao salvar ficha na nuvem:', err);
  }
}

/**
 * Remove uma ficha específica da nuvem no Firestore
 */
export async function excluirFichaDaNuvem(userId: string, fichaId: string): Promise<void> {
  if (!isFirebaseConfigured() || !userId || !fichaId) return;

  try {
    const docRef = doc(db, 'users', userId, 'characters', fichaId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Erro ao remover ficha da nuvem:', err);
  }
}
