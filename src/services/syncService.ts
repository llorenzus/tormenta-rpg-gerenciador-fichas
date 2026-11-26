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
 * Algoritmo puro de mesclagem (Merge) Offline-First:
 * - NUNCA apaga fichas locais se a nuvem estiver vazia (faz upload de tudo que é local).
 * - Se uma ficha existe apenas localmente: sobe para a nuvem.
 * - Se uma ficha existe apenas na nuvem: baixa e salva localmente.
 * - Se existe em ambos os lugares: mantém a versão com o updatedAt (ou atualizadoEm) mais recente.
 */
export function mesclarFichasLocalENuvem(
  fichasLocais: FichaPersonagem[] = [],
  fichasNuvem: FichaPersonagem[] = []
): ResultadoMerge {
  const mapLocal = new Map<string, FichaPersonagem>();
  fichasLocais.forEach((f) => {
    if (f && f.id) mapLocal.set(f.id, normalizarFicha(f));
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
      mescladas.push(local);
      enviarParaNuvem.push(local);
    } else if (!local && cloud) {
      // 2. Existe somente na nuvem: baixa para o aparelho local
      mescladas.push(cloud);
    } else if (local && cloud) {
      // 3. Existe nos dois: compara timestamps mais recentes
      const timeLocal = Number(local.updatedAt || local.atualizadoEm) || 0;
      const timeCloud = Number(cloud.updatedAt || cloud.atualizadoEm) || 0;

      if (timeLocal >= timeCloud) {
        mescladas.push(local);
        if (timeLocal > timeCloud) {
          enviarParaNuvem.push(local);
        }
      } else {
        mescladas.push(cloud);
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
  const locais = fichasLocaisParam || (await storage.carregarFichasLocais());

  if (!isFirebaseConfigured() || !userId) {
    return locais;
  }

  try {
    const colRef = collection(db, 'users', userId, 'characters');
    const snapshot = await getDocs(colRef);
    const nuvem: FichaPersonagem[] = snapshot.docs.map((docSnap) => docSnap.data() as FichaPersonagem);

    const { mescladas, enviarParaNuvem } = mesclarFichasLocalENuvem(locais, nuvem);

    // Salva a lista consolidada no armazenamento local do dispositivo
    await storage.salvarListaFichasLocais(mescladas);

    // Envia para o Firestore as fichas locais novas ou mais atualizadas
    if (enviarParaNuvem.length > 0) {
      Promise.allSettled(
        enviarParaNuvem.map((ficha) =>
          setDoc(doc(db, 'users', userId, 'characters', ficha.id), ficha)
        )
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
    await setDoc(docRef, fichaPronta);
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
