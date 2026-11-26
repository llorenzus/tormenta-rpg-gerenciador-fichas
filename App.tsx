import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  BackHandler,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompendioModal } from './src/components/CompendioModal';
import { ModalAtualizacao } from './src/components/ModalAtualizacao';
import { ModalLogin } from './src/components/ModalLogin';
import { ModalExportarFicha } from './src/components/ModalExportarFicha';
import {
  ClasseData,
  converterArmaParaItem,
  converterArmaduraParaItem,
  converterItemGeralParaItem,
  converterMagiaParaItem,
  converterTalentoParaItem,
  converterManobraParaItem,
  EquipamentoData,
  MagiaData,
  RacaData,
  TalentoData,
  PosturaData,
  GolpeMarcialData,
} from './src/data';
import {
  aplicarClasseNaFicha,
  criarNovaFichaPadrao,
  FichaPersonagem,
  gerarId,
  gerarProximoNomePadrao,
  HabilidadeOuTalento,
} from './src/models/ficha';
import { FichaDetalheScreen } from './src/screens/FichaDetalheScreen';
import { ListaFichasScreen } from './src/screens/ListaFichasScreen';
import { TelaInicialScreen } from './src/screens/TelaInicialScreen';
import {
  carregarFichasLocais,
  compartilharJson,
  compartilharPdf,
  excluirFichaLocal,
  imprimirFichaDireto,
  importarFichaArquivoJson,
  limparFichasAtivasAoDeslogar,
  salvarFichaLocal,
  salvarJsonNoAparelho,
  salvarPdfNoAparelho,
} from './src/storage/fichaStorage';
import { COLORS } from './src/theme/colors';
import { checarAtualizacaoOnline, InfoAtualizacao } from './src/utils/updateChecker';
import { User } from 'firebase/auth';
import {
  fazerLogout,
  observarEstadoAuth,
  obterUsuarioAtual,
} from './src/services/authService';
import {
  sincronizarPrimeiroLogin,
  enviarFichaParaNuvem,
  excluirFichaDaNuvem,
} from './src/services/syncService';
import {
  observarFichasCompartilhadasComigo,
  registrarPerfilUsuario,
} from './src/services/sharingService';

const obterNomeJogadorAtual = (user: User | null): string => {
  if (!user) return '';
  return user.displayName?.trim() || user.email?.split('@')[0]?.trim() || '';
};

export default function App() {
  const [iniciado, setIniciado] = useState(false);
  const [fichas, setFichas] = useState<FichaPersonagem[]>([]);
  const [fichasCompartilhadas, setFichasCompartilhadas] = useState<FichaPersonagem[]>([]);
  const [fichaAberta, setFichaAberta] = useState<FichaPersonagem | null>(null);
  const [compendioGeralAberto, setCompendioGeralAberto] = useState(false);
  const [fichaParaExportar, setFichaParaExportar] = useState<FichaPersonagem | null>(null);
  const [infoAtualizacao, setInfoAtualizacao] = useState<InfoAtualizacao | null>(null);
  const [modalAtualizacaoVisivel, setModalAtualizacaoVisivel] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<User | null>(null);
  const [modalContaVisivel, setModalContaVisivel] = useState(false);

  // Debounce e ref para persistência assíncrona fluída no mobile sem travar a thread JS
  const salvarDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const fichaPendenteSalvarRef = useRef<FichaPersonagem | null>(null);

  // Debounce de 2.5s para economizar as 20.000 escritas diárias gratuitas do Cloud Firestore
  const salvarNuvemDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const fichaPendenteNuvemRef = useRef<FichaPersonagem | null>(null);
  const ultimoHashSalvoNuvemRef = useRef<Map<string, string>>(new Map());

  // Limpa timers se desmontar
  useEffect(() => {
    return () => {
      if (salvarDebounceRef.current) {
        clearTimeout(salvarDebounceRef.current);
      }
      if (salvarNuvemDebounceRef.current) {
        clearTimeout(salvarNuvemDebounceRef.current);
      }
    };
  }, []);

  // Flush automático e resiliente para evitar qualquer perda de dados ao fechar ou minimizar o app
  useEffect(() => {
    const flushDadosPendentes = async () => {
      if (fichaPendenteSalvarRef.current) {
        const pendente = fichaPendenteSalvarRef.current;
        await salvarFichaLocal(pendente);
        const user = usuarioAtual || obterUsuarioAtual();
        if (user) {
          const serial = JSON.stringify(pendente);
          if (ultimoHashSalvoNuvemRef.current.get(pendente.id) !== serial) {
            ultimoHashSalvoNuvemRef.current.set(pendente.id, serial);
            enviarFichaParaNuvem(user.uid, pendente).catch(() => {});
          }
        }
      }
    };

    // Mobile Android/iOS: salva imediatamente ao pausar ou colocar o app em background
    const subAppState = AppState.addEventListener('change', (estado) => {
      if (estado === 'background' || estado === 'inactive') {
        flushDadosPendentes();
      }
    });

    // Windows Desktop / Web: salva imediatamente ao fechar a janela ou perder o foco
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('beforeunload', flushDadosPendentes);
      window.addEventListener('blur', flushDadosPendentes);
    }

    return () => {
      subAppState.remove();
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', flushDadosPendentes);
        window.removeEventListener('blur', flushDadosPendentes);
      }
    };
  }, [usuarioAtual]);

  useEffect(() => {
    carregarFichasLocais().then(setFichas);

    // Checa discretamente se há uma nova versão online ao iniciar (intervalo de 24h)
    checarAtualizacaoOnline(false)
      .then((info) => {
        if (info && info.temAtualizacao) {
          setInfoAtualizacao(info);
          setModalAtualizacaoVisivel(true);
        }
      })
      .catch(() => {});

    // Sincroniza fichas entre janelas no Windows/Web (Electron e browser)
    const sincronizarFichas = () => {
      carregarFichasLocais().then((lista) => {
        setFichas(lista);
        setFichaAberta((atual) => {
          if (!atual) return atual;
          return lista.find((f) => f.id === atual.id) || atual;
        });
      });
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('storage', sincronizarFichas);
      window.addEventListener('focus', sincronizarFichas);
    }

    // Checagem imediata de sessão anterior persistida para evitar tela inicial piscar
    AsyncStorage.getItem('@tormenta_rpg:usuario_conectado_uid')
      .then((uid) => {
        if (uid) {
          AsyncStorage.getItem('@tormenta_rpg:manter_conectado').then((pref) => {
            if (pref !== 'false') {
              setIniciado(true);
            }
          });
        }
      })
      .catch(() => {});

    // Observa o estado de autenticação do usuário (login/logout e restauração de sessão)
    const unsubAuth = observarEstadoAuth(async (user) => {
      setUsuarioAtual(user);
      if (user) {
        AsyncStorage.setItem('@tormenta_rpg:usuario_conectado_uid', user.uid).catch(() => {});

        // Verifica a preferência do usuário de persistir o login
        let manterConectado = true;
        try {
          const pref = await AsyncStorage.getItem('@tormenta_rpg:manter_conectado');
          if (pref === 'false') {
            manterConectado = false;
          }
        } catch {}

        if (!manterConectado) {
          // Se o usuário desmarcou "Permanecer conectado", efetua logout ao reabrir
          await AsyncStorage.removeItem('@tormenta_rpg:usuario_conectado_uid');
          await fazerLogout();
          return;
        }

        // Se está conectado e com persistência ativa, entra direto na tela de fichas
        setIniciado(true);

        const nomeJogador = obterNomeJogadorAtual(user);

        // Ao abrir a aplicação, se logado ou ao logar, busca os dados do usuário e carrega para o app
        sincronizarPrimeiroLogin(user.uid)
          .then((listaConsolidada) => {
            const listaComJogador = nomeJogador
              ? listaConsolidada.map((f) => ({ ...f, jogador: nomeJogador }))
              : listaConsolidada;
            setFichas(listaComJogador);
            setFichaAberta((atual) => {
              if (!atual) return atual;
              const fEncontrada = listaComJogador.find((f) => f.id === atual.id);
              return fEncontrada || (nomeJogador ? { ...atual, jogador: nomeJogador } : atual);
            });
          })
          .catch((err) => {
            console.warn('Erro ao mesclar dados com a nuvem:', err);
          });
      } else {
        // Se deslogou, cancela qualquer gravação pendente em nuvem e volta para a tela inicial
        if (salvarNuvemDebounceRef.current) {
          clearTimeout(salvarNuvemDebounceRef.current);
          salvarNuvemDebounceRef.current = null;
        }
        fichaPendenteNuvemRef.current = null;
        setIniciado(false);
        setFichaAberta(null);
        setFichas([]); // Limpa as fichas da tela imediatamente para evitar vazamento entre usuários
        AsyncStorage.removeItem('@tormenta_rpg:usuario_conectado_uid').catch(() => {});
        const userAnterior = usuarioAtual || obterUsuarioAtual();
        limparFichasAtivasAoDeslogar(userAnterior?.uid).catch(() => {});
      }
    });

    // No Windows Desktop (Electron) e Web, garante o cursor de mãozinha (pointer) em abas e botões
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'trpg-pointer-cursor-fix';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          [role="button"], button, [role="tab"], [data-focusable="true"], .r-cursor-pointer {
            cursor: pointer !important;
          }
        `;
        document.head.appendChild(style);
      }
    }

    return () => {
      unsubAuth();
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.removeEventListener('storage', sincronizarFichas);
        window.removeEventListener('focus', sincronizarFichas);
      }
    };
  }, []);

  // Escuta em tempo real fichas compartilhadas com o usuário logado
  useEffect(() => {
    if (!usuarioAtual) {
      setFichasCompartilhadas([]);
      return;
    }

    // Registra perfil público para busca por outros usuários
    registrarPerfilUsuario(usuarioAtual).catch(() => {});

    // Listener Firestore onSnapshot em tempo real
    const unsubShared = observarFichasCompartilhadasComigo(
      usuarioAtual.uid,
      (listaShared) => {
        setFichasCompartilhadas(listaShared);
        // Sincronização em tempo real: se a ficha compartilhada estiver aberta na tela,
        // atualiza os PVs e dados imediatamente quando o dono alterar e salvar!
        setFichaAberta((atual) => {
          if (!atual || !atual.isCompartilhadaComigo) return atual;
          const atualizada = listaShared.find((s) => s.id === atual.id);
          return atualizada || atual;
        });
      }
    );

    return () => {
      unsubShared();
    };
  }, [usuarioAtual]);

  const handleVoltarDaFicha = async () => {
    if (salvarDebounceRef.current) {
      clearTimeout(salvarDebounceRef.current);
      salvarDebounceRef.current = null;
    }
    if (salvarNuvemDebounceRef.current) {
      clearTimeout(salvarNuvemDebounceRef.current);
      salvarNuvemDebounceRef.current = null;
    }

    const fichaAlvo = fichaPendenteSalvarRef.current || fichaAberta;
    fichaPendenteSalvarRef.current = null;
    fichaPendenteNuvemRef.current = null;

    if (!fichaAlvo) {
      setFichaAberta(null);
      return;
    }

    // Se a ficha é compartilhada (somente leitura), apenas fecha sem sobrescrever fichas locais
    if (fichaAlvo.isCompartilhadaComigo) {
      setFichaAberta(null);
      return;
    }

    const nomeTrim = fichaAlvo.nomePersonagem?.trim();
    let fichaFinal: FichaPersonagem;

    // Se o nome ficou vazio ao sair, gera o próximo nome padrão
    if (!nomeTrim) {
      const nomePadrao = gerarProximoNomePadrao(fichas, fichaAlvo.id);
      fichaFinal = { ...fichaAlvo, nomePersonagem: nomePadrao };
    } else {
      fichaFinal = fichaAlvo;
    }

    const listaAtualizada = await salvarFichaLocal(fichaFinal);
    setFichas(listaAtualizada);

    // Se logado, envia a versão final imediata para o Firestore
    const userAuth = usuarioAtual || obterUsuarioAtual();
    if (userAuth) {
      ultimoHashSalvoNuvemRef.current.set(fichaFinal.id, JSON.stringify(fichaFinal));
      enviarFichaParaNuvem(userAuth.uid, fichaFinal).catch(() => {});
    }

    setFichaAberta(null);
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (compendioGeralAberto) {
        setCompendioGeralAberto(false);
        return true;
      }
      if (fichaParaExportar) {
        setFichaParaExportar(null);
        return true;
      }
      if (fichaAberta) {
        handleVoltarDaFicha();
        return true;
      }
      if (iniciado) {
        setIniciado(false);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [compendioGeralAberto, fichaParaExportar, fichaAberta, iniciado, fichas]);

  const handleCriarNova = () => {
    // Cria ficha nova com nome vazio conforme especificação
    const nova = criarNovaFichaPadrao();
    const user = usuarioAtual || obterUsuarioAtual();
    if (user?.uid) {
      nova.userId = user.uid;
    }
    const nomeJogador = obterNomeJogadorAtual(user);
    if (nomeJogador) {
      nova.jogador = nomeJogador;
    }
    setFichaAberta(nova);
  };

  const handleAtualizarFicha = (editada: FichaPersonagem) => {
    // Fichas compartilhadas por outros jogadores são estritamente somente leitura
    if (editada.isCompartilhadaComigo) {
      return;
    }

    const user = usuarioAtual || obterUsuarioAtual();
    if (user?.uid && !editada.userId) {
      editada.userId = user.uid;
    }
    const nomeJogador = obterNomeJogadorAtual(user);
    if (nomeJogador && editada.jogador !== nomeJogador) {
      editada.jogador = nomeJogador;
    }

    // 1. Atualização imediata em memória para digitação e cliques fluidos a 60 FPS
    setFichaAberta(editada);
    fichaPendenteSalvarRef.current = editada;

    // 2. Gravação no AsyncStorage com debounce de 600ms para evitar travar o SQLite e a bridge nativa
    if (salvarDebounceRef.current) {
      clearTimeout(salvarDebounceRef.current);
    }
    salvarDebounceRef.current = setTimeout(async () => {
      salvarDebounceRef.current = null;
      if (fichaPendenteSalvarRef.current) {
        const fichaParaSalvar = fichaPendenteSalvarRef.current;
        fichaPendenteSalvarRef.current = null;
        const listaAtualizada = await salvarFichaLocal(fichaParaSalvar);
        setFichas(listaAtualizada);
      }
    }, 600);

    // 3. Envio para a nuvem no Firestore com debounce de 2.5s para economizar cota diária
    const userAuth = usuarioAtual || obterUsuarioAtual();
    if (userAuth) {
      fichaPendenteNuvemRef.current = editada;
      if (salvarNuvemDebounceRef.current) {
        clearTimeout(salvarNuvemDebounceRef.current);
      }
      salvarNuvemDebounceRef.current = setTimeout(async () => {
        salvarNuvemDebounceRef.current = null;
        const currentUser = obterUsuarioAtual();
        if (fichaPendenteNuvemRef.current && currentUser) {
          const alvoNuvem = fichaPendenteNuvemRef.current;
          fichaPendenteNuvemRef.current = null;
          const serial = JSON.stringify(alvoNuvem);
          if (ultimoHashSalvoNuvemRef.current.get(alvoNuvem.id) === serial) {
            return; // Sem alteração real nos dados; evita conexão desnecessária com o Firestore
          }
          ultimoHashSalvoNuvemRef.current.set(alvoNuvem.id, serial);
          await enviarFichaParaNuvem(currentUser.uid, alvoNuvem);
        }
      }, 2500);
    }
  };

  const handleSalvarManual = async (): Promise<boolean> => {
    if (salvarDebounceRef.current) {
      clearTimeout(salvarDebounceRef.current);
      salvarDebounceRef.current = null;
    }
    if (salvarNuvemDebounceRef.current) {
      clearTimeout(salvarNuvemDebounceRef.current);
      salvarNuvemDebounceRef.current = null;
    }

    const fichaAlvo = fichaPendenteSalvarRef.current || fichaAberta;
    fichaPendenteSalvarRef.current = null;
    fichaPendenteNuvemRef.current = null;

    if (!fichaAlvo) return false;
    if (fichaAlvo.isCompartilhadaComigo) return true;

    let fichaFinal: FichaPersonagem;
    const nomeTrim = fichaAlvo.nomePersonagem?.trim();

    // Se o nome não foi alterado (está vazio), atribui 'Novo Personagem', 'Novo Personagem 2'...
    if (!nomeTrim) {
      const nomePadrao = gerarProximoNomePadrao(fichas, fichaAlvo.id);
      fichaFinal = { ...fichaAlvo, nomePersonagem: nomePadrao };
    } else {
      fichaFinal = { ...fichaAlvo, nomePersonagem: nomeTrim };
    }

    setFichaAberta(fichaFinal);
    const listaAtualizada = await salvarFichaLocal(fichaFinal);
    setFichas(listaAtualizada);

    // Sincroniza imediatamente na nuvem ao acionar salvamento manual
    const userManual = usuarioAtual || obterUsuarioAtual();
    const nomeJogadorManual = obterNomeJogadorAtual(userManual);
    if (nomeJogadorManual && fichaFinal.jogador !== nomeJogadorManual) {
      fichaFinal.jogador = nomeJogadorManual;
    }
    if (userManual) {
      ultimoHashSalvoNuvemRef.current.set(fichaFinal.id, JSON.stringify(fichaFinal));
      enviarFichaParaNuvem(userManual.uid, fichaFinal).catch(() => {});
    }

    return true;
  };

  const handleIniciar = () => {
    const user = usuarioAtual || obterUsuarioAtual();
    if (!user) {
      setModalContaVisivel(true);
    } else {
      setIniciado(true);
    }
  };

  const handleExcluirFicha = async (id: string) => {
    const listaAtualizada = await excluirFichaLocal(id);
    setFichas(listaAtualizada);

    // Se logado, remove a ficha correspondente da nuvem
    const userDel = usuarioAtual || obterUsuarioAtual();
    if (userDel) {
      excluirFichaDaNuvem(userDel.uid, id).catch(() => {});
    }

    if (fichaAberta?.id === id) {
      setFichaAberta(null);
    }
  };

  const handleExportarFicha = (ficha: FichaPersonagem) => {
    setFichaParaExportar(ficha);
  };

  const handleSalvarPdfLocal = async (ficha: FichaPersonagem) => {
    try {
      const salvou = await salvarPdfNoAparelho(ficha);
      if (salvou) {
        setFichaParaExportar(null);
        Alert.alert(
          'PDF Salvo com Sucesso!',
          `A ficha de "${ficha.nomePersonagem || 'Personagem'}" foi gravada no seu aparelho.`
        );
      }
    } catch (e: any) {
      Alert.alert(
        'Erro ao Salvar PDF',
        e?.message || 'Não foi possível gravar o arquivo PDF no aparelho.'
      );
    }
  };

  const handleSalvarJsonLocal = async (ficha: FichaPersonagem) => {
    try {
      const salvou = await salvarJsonNoAparelho(ficha);
      if (salvou) {
        setFichaParaExportar(null);
        Alert.alert(
          'JSON Salvo com Sucesso!',
          `O arquivo JSON de "${ficha.nomePersonagem || 'Personagem'}" foi gravado no seu aparelho.`
        );
      }
    } catch (e: any) {
      Alert.alert(
        'Erro ao Salvar JSON',
        e?.message || 'Não foi possível gravar o arquivo JSON no aparelho.'
      );
    }
  };

  const handleCompartilharPdf = async (ficha: FichaPersonagem) => {
    try {
      setFichaParaExportar(null);
      await compartilharPdf(ficha);
    } catch (e: any) {
      Alert.alert(
        'Erro ao Compartilhar PDF',
        e?.message || 'Não foi possível compartilhar o PDF da ficha.'
      );
    }
  };

  const handleCompartilharJson = async (ficha: FichaPersonagem) => {
    try {
      setFichaParaExportar(null);
      await compartilharJson(ficha);
    } catch (e: any) {
      Alert.alert(
        'Erro ao Compartilhar JSON',
        e?.message || 'Não foi possível compartilhar a ficha em JSON.'
      );
    }
  };

  const handleImprimirDireto = async (ficha: FichaPersonagem) => {
    try {
      setFichaParaExportar(null);
      await imprimirFichaDireto(ficha);
    } catch (e: any) {
      Alert.alert(
        'Erro ao Imprimir',
        e?.message || 'Não foi possível acionar o serviço de impressão.'
      );
    }
  };

  const handleImportarFicha = async () => {
    try {
      const resultado = await importarFichaArquivoJson();
      if (!resultado) return;
      setFichas(resultado.lista);
      Alert.alert(
        'Ficha Importada!',
        `A ficha de "${resultado.fichaImportada.nomePersonagem}" foi importada com sucesso!`,
        [
          { text: 'Ficar na Lista', style: 'cancel' },
          {
            text: 'Abrir Ficha',
            onPress: () => setFichaAberta(resultado.fichaImportada),
          },
        ]
      );
    } catch (e: any) {
      Alert.alert(
        'Erro ao Importar Ficha',
        e?.message || 'O arquivo selecionado não é uma ficha válida do Tormenta RPG em formato JSON.'
      );
    }
  };

  const handleAdicionarItemParaFichaEspecifica = async (
    fichaId: string,
    tipo: 'talento' | 'magia' | 'raca' | 'classe' | 'equipamento' | 'manobra',
    item: TalentoData | MagiaData | RacaData | ClasseData | EquipamentoData | PosturaData | GolpeMarcialData
  ) => {
    const alvo = fichas.find((f) => f.id === fichaId);
    if (!alvo) return;

    const limpo = (s: string) => s.replace(/\s*\[.*?\]/g, '').trim().toLowerCase();
    const nomeLimpo = limpo(item.nome);
    const nomeNorm = item.nome.trim().toLowerCase();

    let fichaModificada: FichaPersonagem;
    let foiRemovido = false;

    if (tipo === 'talento') {
      const existe = (alvo.talentos || []).some(
        (t) => limpo(t.nome) === nomeLimpo || t.nome.trim().toLowerCase() === nomeNorm
      );
      if (existe) {
        fichaModificada = {
          ...alvo,
          talentos: (alvo.talentos || []).filter(
            (t) => limpo(t.nome) !== nomeLimpo && t.nome.trim().toLowerCase() !== nomeNorm
          ),
        };
        foiRemovido = true;
      } else {
        const novoTalento = converterTalentoParaItem(item as TalentoData);
        fichaModificada = {
          ...alvo,
          talentos: [...alvo.talentos, novoTalento],
        };
      }
    } else if (tipo === 'magia') {
      const existe = (alvo.magias || []).some(
        (m) => limpo(m.nome) === nomeLimpo || m.nome.trim().toLowerCase() === nomeNorm
      );
      if (existe) {
        fichaModificada = {
          ...alvo,
          magias: (alvo.magias || []).filter(
            (m) => limpo(m.nome) !== nomeLimpo && m.nome.trim().toLowerCase() !== nomeNorm
          ),
        };
        foiRemovido = true;
      } else {
        const novaMagia = converterMagiaParaItem(item as MagiaData);
        fichaModificada = {
          ...alvo,
          magias: [...alvo.magias, novaMagia],
        };
      }
    } else if (tipo === 'raca') {
      const raca = item as RacaData;
      const novosTracos: HabilidadeOuTalento[] = raca.tracosRaciais.map((t) => ({
        id: gerarId(),
        nome: `${t.nome} (${raca.nome})`,
        descricao: t.descricao,
      }));
      fichaModificada = {
        ...alvo,
        raca: raca.nome,
        tamanho: raca.tamanho,
        deslocamento: `${raca.deslocamento}m`,
        habilidadesRaca: [...alvo.habilidadesRaca, ...novosTracos],
      };
    } else if (tipo === 'classe') {
      const classe = item as ClasseData;
      fichaModificada = aplicarClasseNaFicha(alvo, classe);
    } else if (tipo === 'manobra') {
      const manobra = item as PosturaData | GolpeMarcialData;
      const manobrasAtuais = Array.isArray(alvo.manobras) ? alvo.manobras : [];
      const existe = manobrasAtuais.some(
        (m) => limpo(m.nome) === nomeLimpo || m.nome.trim().toLowerCase() === nomeNorm
      );
      if (existe) {
        fichaModificada = {
          ...alvo,
          manobras: manobrasAtuais.filter(
            (m) => limpo(m.nome) !== nomeLimpo && m.nome.trim().toLowerCase() !== nomeNorm
          ),
        };
        foiRemovido = true;
      } else {
        const novaManobra = converterManobraParaItem(manobra);
        fichaModificada = {
          ...alvo,
          manobras: [...manobrasAtuais, novaManobra],
        };
      }
    } else {
      const equip = item as EquipamentoData;
      if (equip.tipo === 'Arma') {
        const existe = (alvo.armas || []).some(
          (a) => limpo(a.nome) === nomeLimpo || a.nome.trim().toLowerCase() === nomeNorm
        );
        if (existe) {
          fichaModificada = {
            ...alvo,
            armas: (alvo.armas || []).filter(
              (a) => limpo(a.nome) !== nomeLimpo && a.nome.trim().toLowerCase() !== nomeNorm
            ),
          };
          foiRemovido = true;
        } else {
          const novaArma = converterArmaParaItem(equip);
          fichaModificada = {
            ...alvo,
            armas: [...alvo.armas, novaArma],
          };
        }
      } else if (equip.tipo === 'Armadura' || equip.tipo === 'Escudo') {
        const existe = (alvo.armaduras || []).some(
          (a) => limpo(a.nome) === nomeLimpo || a.nome.trim().toLowerCase() === nomeNorm
        );
        if (existe) {
          fichaModificada = {
            ...alvo,
            armaduras: (alvo.armaduras || []).filter(
              (a) => limpo(a.nome) !== nomeLimpo && a.nome.trim().toLowerCase() !== nomeNorm
            ),
          };
          foiRemovido = true;
        } else {
          const novaArmadura = converterArmaduraParaItem(equip);
          fichaModificada = {
            ...alvo,
            armaduras: [...alvo.armaduras, novaArmadura],
          };
        }
      } else {
        const existe = (alvo.itensGerais || []).some(
          (i) => limpo(i.nome) === nomeLimpo || i.nome.trim().toLowerCase() === nomeNorm
        );
        if (existe) {
          fichaModificada = {
            ...alvo,
            itensGerais: (alvo.itensGerais || []).filter(
              (i) => limpo(i.nome) !== nomeLimpo && i.nome.trim().toLowerCase() !== nomeNorm
            ),
          };
          foiRemovido = true;
        } else {
          const novoItem = converterItemGeralParaItem(equip);
          fichaModificada = {
            ...alvo,
            itensGerais: [...alvo.itensGerais, novoItem],
          };
        }
      }
    }

    const listaAtualizada = await salvarFichaLocal(fichaModificada);
    setFichas(listaAtualizada);
    if (fichaAberta?.id === fichaId) {
      setFichaAberta(fichaModificada);
    }

    Alert.alert(
      foiRemovido ? 'Removido da Ficha' : 'Registrado com Sucesso!',
      foiRemovido
        ? `"${item.nome}" foi removido da ficha de "${alvo.nomePersonagem || 'Personagem'}".`
        : `"${item.nome}" foi aplicado à ficha de "${alvo.nomePersonagem || 'Personagem'}".`
    );
  };

  // Se estiver abrindo em uma janela dedicada ao Compêndio (Desktop / Windows / Web)
  const isJanelaCompendio =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('janela') === 'compendio';

  if (isJanelaCompendio) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
        <View style={styles.container}>
          <CompendioModal
            visivel={true}
            onFechar={() => {
              if (typeof window !== 'undefined' && typeof window.close === 'function') {
                window.close();
              }
            }}
            todasFichas={fichas}
            fichaAtual={fichaAberta || (fichas.length === 1 ? fichas[0] : null)}
            onAtualizarFichaAtual={handleAtualizarFicha}
            onAdicionarItemParaFichaEspecifica={handleAdicionarItemParaFichaEspecifica}
            standalone={true}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {!iniciado ? (
          <TelaInicialScreen
            onIniciar={handleIniciar}
            usuarioAtual={usuarioAtual}
            onAbrirConta={() => setModalContaVisivel(true)}
          />
        ) : fichaAberta ? (
          <FichaDetalheScreen
            ficha={fichaAberta}
            somenteLeitura={!!fichaAberta.isCompartilhadaComigo}
            usuarioAtual={usuarioAtual}
            onChange={handleAtualizarFicha}
            onSalvarManual={handleSalvarManual}
            onExportar={() => handleExportarFicha(fichaAberta)}
            onVoltar={handleVoltarDaFicha}
          />
        ) : (
          <ListaFichasScreen
            fichas={fichas}
            fichasCompartilhadas={fichasCompartilhadas}
            usuarioAtual={usuarioAtual}
            onAbrirConta={() => setModalContaVisivel(true)}
            onCriarNova={handleCriarNova}
            onImportarFicha={handleImportarFicha}
            onExportarFicha={handleExportarFicha}
            onAbrirFicha={(f) => {
              if (f.isCompartilhadaComigo) {
                setFichaAberta(f);
              } else {
                const user = usuarioAtual || obterUsuarioAtual();
                const nomeJogador = obterNomeJogadorAtual(user);
                const fichaComJogador =
                  nomeJogador && f.jogador !== nomeJogador ? { ...f, jogador: nomeJogador } : f;
                setFichaAberta(fichaComJogador);
              }
            }}
            onExcluirFicha={handleExcluirFicha}
            onAbrirCompendio={() => setCompendioGeralAberto(true)}
          />
        )}

        <CompendioModal
          visivel={compendioGeralAberto}
          onFechar={() => setCompendioGeralAberto(false)}
          todasFichas={fichas}
          fichaAtual={fichaAberta}
          onAdicionarItemParaFichaEspecifica={handleAdicionarItemParaFichaEspecifica}
        />

        <ModalExportarFicha
          visivel={!!fichaParaExportar}
          ficha={fichaParaExportar}
          onFechar={() => setFichaParaExportar(null)}
          onSalvarPdf={handleSalvarPdfLocal}
          onSalvarJson={handleSalvarJsonLocal}
          onCompartilharPdf={handleCompartilharPdf}
          onCompartilharJson={handleCompartilharJson}
          onImprimirDireto={handleImprimirDireto}
        />

        <ModalAtualizacao
          visivel={modalAtualizacaoVisivel}
          info={infoAtualizacao}
          onFechar={() => setModalAtualizacaoVisivel(false)}
        />

        <ModalLogin
          visivel={modalContaVisivel}
          usuarioAtual={usuarioAtual}
          onFechar={() => setModalContaVisivel(false)}
          onLoginSucesso={(user) => {
            setUsuarioAtual(user);
            setIniciado(true);
            setModalContaVisivel(false);
          }}
          onLogoutSucesso={() => {
            setUsuarioAtual(null);
            setIniciado(false);
            setFichaAberta(null);
            if (salvarNuvemDebounceRef.current) {
              clearTimeout(salvarNuvemDebounceRef.current);
              salvarNuvemDebounceRef.current = null;
            }
            fichaPendenteNuvemRef.current = null;
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
