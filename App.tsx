import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { CompendioModal } from './src/components/CompendioModal';
import { ModalAtualizacao } from './src/components/ModalAtualizacao';
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
  salvarFichaLocal,
  salvarJsonNoAparelho,
  salvarPdfNoAparelho,
} from './src/storage/fichaStorage';
import { COLORS } from './src/theme/colors';
import { checarAtualizacaoOnline, InfoAtualizacao } from './src/utils/updateChecker';

export default function App() {
  const [iniciado, setIniciado] = useState(false);
  const [fichas, setFichas] = useState<FichaPersonagem[]>([]);
  const [fichaAberta, setFichaAberta] = useState<FichaPersonagem | null>(null);
  const [compendioGeralAberto, setCompendioGeralAberto] = useState(false);
  const [fichaParaExportar, setFichaParaExportar] = useState<FichaPersonagem | null>(null);
  const [infoAtualizacao, setInfoAtualizacao] = useState<InfoAtualizacao | null>(null);
  const [modalAtualizacaoVisivel, setModalAtualizacaoVisivel] = useState(false);

  // Debounce e ref para persistência assíncrona fluída no mobile sem travar a thread JS
  const salvarDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const fichaPendenteSalvarRef = useRef<FichaPersonagem | null>(null);

  // Limpa timer se desmontar
  useEffect(() => {
    return () => {
      if (salvarDebounceRef.current) {
        clearTimeout(salvarDebounceRef.current);
      }
    };
  }, []);

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
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.removeEventListener('storage', sincronizarFichas);
        window.removeEventListener('focus', sincronizarFichas);
      }
    };
  }, []);

  const handleVoltarDaFicha = async () => {
    if (salvarDebounceRef.current) {
      clearTimeout(salvarDebounceRef.current);
      salvarDebounceRef.current = null;
    }

    const fichaAlvo = fichaPendenteSalvarRef.current || fichaAberta;
    fichaPendenteSalvarRef.current = null;

    if (!fichaAlvo) {
      setFichaAberta(null);
      return;
    }

    const nomeTrim = fichaAlvo.nomePersonagem?.trim();

    // Se o nome ficou vazio ao sair, gera o próximo nome padrão
    if (!nomeTrim) {
      const nomePadrao = gerarProximoNomePadrao(fichas, fichaAlvo.id);
      const fichaSalva = { ...fichaAlvo, nomePersonagem: nomePadrao };
      const listaAtualizada = await salvarFichaLocal(fichaSalva);
      setFichas(listaAtualizada);
    } else {
      const listaAtualizada = await salvarFichaLocal(fichaAlvo);
      setFichas(listaAtualizada);
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
    setFichaAberta(nova);
  };

  const handleAtualizarFicha = (editada: FichaPersonagem) => {
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
  };

  const handleSalvarManual = async (): Promise<boolean> => {
    if (salvarDebounceRef.current) {
      clearTimeout(salvarDebounceRef.current);
      salvarDebounceRef.current = null;
    }

    const fichaAlvo = fichaPendenteSalvarRef.current || fichaAberta;
    fichaPendenteSalvarRef.current = null;

    if (!fichaAlvo) return false;

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
    return true;
  };

  const handleExcluirFicha = async (id: string) => {
    const listaAtualizada = await excluirFichaLocal(id);
    setFichas(listaAtualizada);
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
          <TelaInicialScreen onIniciar={() => setIniciado(true)} />
        ) : fichaAberta ? (
          <FichaDetalheScreen
            ficha={fichaAberta}
            onChange={handleAtualizarFicha}
            onSalvarManual={handleSalvarManual}
            onExportar={() => handleExportarFicha(fichaAberta)}
            onVoltar={handleVoltarDaFicha}
          />
        ) : (
          <ListaFichasScreen
            fichas={fichas}
            onCriarNova={handleCriarNova}
            onImportarFicha={handleImportarFicha}
            onExportarFicha={handleExportarFicha}
            onAbrirFicha={(f) => setFichaAberta(f)}
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
