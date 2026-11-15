import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AbaAtributos } from '../components/AbaAtributos';
import { AbaDadosCadastrais } from '../components/AbaDadosCadastrais';
import { AbaEquipamentos } from '../components/AbaEquipamentos';
import { AbaHabilidadesRaca } from '../components/AbaHabilidadesRaca';
import { AbaHabilidadesClasse } from '../components/AbaHabilidadesClasse';
import { AbaManobras } from '../components/AbaManobras';
import { AbaTalentos } from '../components/AbaTalentos';
import { AbaMagias } from '../components/AbaMagias';
import { AbaPericias } from '../components/AbaPericias';
import { CompendioModal } from '../components/CompendioModal';
import {
  ModalReordenarAbas,
  AbaKey,
  TODAS_AS_ABAS,
  ORDEM_ABAS_PADRAO,
} from '../components/ModalReordenarAbas';
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
} from '../data';
import {
  aplicarClasseNaFicha,
  calcularCaTotal,
  FichaPersonagem,
  gerarId,
  HabilidadeOuTalento,
} from '../models/ficha';
import { COLORS } from '../theme/colors';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
  onSalvarManual: () => Promise<boolean> | boolean;
  onExportar: () => void;
  onVoltar: () => void;
}

const STORAGE_KEY_ORDEM_PREFERIDA = '@trpg_ordem_abas_preferida';

export const FichaDetalheScreen: React.FC<Props> = ({
  ficha,
  onChange,
  onSalvarManual,
  onExportar,
  onVoltar,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 850;

  // Ordem reordenável das abas (com persistência na ficha e em preferência geral)
  const [ordemAbas, setOrdemAbas] = useState<AbaKey[]>(() => {
    if (Array.isArray(ficha.ordemAbas) && ficha.ordemAbas.length > 0) {
      const salvas = ficha.ordemAbas.filter((k) => k in TODAS_AS_ABAS) as AbaKey[];
      const faltantes = ORDEM_ABAS_PADRAO.filter((k) => !salvas.includes(k));
      return [...salvas, ...faltantes];
    }
    return ORDEM_ABAS_PADRAO;
  });

  // Tenta carregar preferência global caso a ficha não tenha ordem definida
  useEffect(() => {
    if (!ficha.ordemAbas || ficha.ordemAbas.length === 0) {
      AsyncStorage.getItem(STORAGE_KEY_ORDEM_PREFERIDA)
        .then((salva) => {
          if (salva) {
            try {
              const parsed = JSON.parse(salva) as AbaKey[];
              if (Array.isArray(parsed) && parsed.length > 0) {
                const validas = parsed.filter((k) => k in TODAS_AS_ABAS);
                const faltantes = ORDEM_ABAS_PADRAO.filter((k) => !validas.includes(k));
                const completa = [...validas, ...faltantes];
                setOrdemAbas(completa);
                onChange({ ...ficha, ordemAbas: completa });
              }
            } catch {
              // fallback silencioso
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  // Estado das abas selecionadas por Chave
  const [abaMobile, setAbaMobile] = useState<AbaKey>('atributos');
  const [abaEsquerda, setAbaEsquerda] = useState<AbaKey>('atributos');
  const [abaDireita, setAbaDireita] = useState<AbaKey>('habilidades_classe');

  // Drag & Drop HTML5 de abas
  const [abaArrastando, setAbaArrastando] = useState<AbaKey | null>(null);
  const [abaHoverAlvo, setAbaHoverAlvo] = useState<AbaKey | null>(null);
  const [modalReordenarAberto, setModalReordenarAberto] = useState(false);

  // Split View no Desktop
  const [splitAtivo, setSplitAtivo] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.5); // 50% / 50%
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [compendioGeralAberto, setCompendioGeralAberto] = useState(false);

  const reordenarAbas = (deChave: AbaKey, paraChave: AbaKey) => {
    if (deChave === paraChave) return;
    const nova = [...ordemAbas];
    const deIdx = nova.indexOf(deChave);
    const paraIdx = nova.indexOf(paraChave);
    if (deIdx !== -1 && paraIdx !== -1) {
      nova.splice(deIdx, 1);
      nova.splice(paraIdx, 0, deChave);
      atualizarOrdemAbas(nova);
    }
  };

  const atualizarOrdemAbas = (novaOrdem: AbaKey[]) => {
    setOrdemAbas(novaOrdem);
    onChange({ ...ficha, ordemAbas: novaOrdem });
    AsyncStorage.setItem(STORAGE_KEY_ORDEM_PREFERIDA, JSON.stringify(novaOrdem)).catch(() => {});
  };

  const handleAdicionarTalento = (talento: TalentoData) => {
    const novo = converterTalentoParaItem(talento);
    onChange({ ...ficha, talentos: [...ficha.talentos, novo] });
  };

  const handleAdicionarMagia = (magia: MagiaData) => {
    const nova = converterMagiaParaItem(magia);
    onChange({ ...ficha, magias: [...ficha.magias, nova] });
  };

  const handleAdicionarManobra = (manobra: PosturaData | GolpeMarcialData) => {
    const nova = converterManobraParaItem(manobra);
    const manobrasAtuais = Array.isArray(ficha.manobras) ? ficha.manobras : [];
    onChange({ ...ficha, manobras: [...manobrasAtuais, nova] });
  };

  const handleAplicarRaca = (raca: RacaData) => {
    const novosTracos: HabilidadeOuTalento[] = raca.tracosRaciais.map((t) => ({
      id: gerarId(),
      nome: `${t.nome} (${raca.nome})`,
      descricao: t.descricao,
    }));
    onChange({
      ...ficha,
      raca: raca.nome,
      tamanho: raca.tamanho,
      deslocamento: `${raca.deslocamento}m`,
      habilidadesRaca: [...ficha.habilidadesRaca, ...novosTracos],
    });
  };

  const handleAplicarClasse = (classe: ClasseData) => {
    onChange(aplicarClasseNaFicha(ficha, classe));
  };

  const handleAdicionarEquipamento = (equip: EquipamentoData) => {
    if (equip.tipo === 'Arma') {
      const novaArma = converterArmaParaItem(equip);
      onChange({ ...ficha, armas: [...ficha.armas, novaArma] });
    } else if (equip.tipo === 'Armadura' || equip.tipo === 'Escudo') {
      const novaArmadura = converterArmaduraParaItem(equip);
      onChange({ ...ficha, armaduras: [...ficha.armaduras, novaArmadura] });
    } else {
      const novoItem = converterItemGeralParaItem(equip);
      onChange({ ...ficha, itensGerais: [...ficha.itensGerais, novoItem] });
    }
  };

  const caTotal = calcularCaTotal(ficha);

  const handleSalvarClick = async () => {
    const sucesso = await onSalvarManual();
    if (sucesso) {
      if (Platform.OS === 'web') {
        window.alert('Ficha salva com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Ficha salva com sucesso!');
      }
    }
  };

  // Alterna ativação da Split View
  const handleToggleSplit = () => {
    if (!splitAtivo) {
      const proximaDireita = ordemAbas.find((k) => k !== abaEsquerda) || 'habilidades_classe';
      setAbaDireita(proximaDireita);
      setSplitAtivo(true);
    } else {
      setSplitAtivo(false);
    }
  };

  // Seleção de aba no Painel 1 (com swap se já estiver no Painel 2)
  const handleSelecionarAbaEsquerda = (chave: AbaKey) => {
    if (chave === abaEsquerda) return;
    if (splitAtivo && chave === abaDireita) {
      setAbaDireita(abaEsquerda);
    }
    setAbaEsquerda(chave);
  };

  // Seleção de aba no Painel 2 (com swap se já estiver no Painel 1)
  const handleSelecionarAbaDireita = (chave: AbaKey) => {
    if (chave === abaDireita) return;
    if (splitAtivo && chave === abaEsquerda) {
      setAbaEsquerda(abaDireita);
    }
    setAbaDireita(chave);
  };

  // Dragging do Splitter no Web / Electron
  const splitRatioRef = useRef(splitRatio);
  splitRatioRef.current = splitRatio;
  const containerWidthRef = useRef(containerWidth);
  containerWidthRef.current = containerWidth;

  const handleMouseDown = (e: any) => {
    if (Platform.OS !== 'web') return;
    setIsDragging(true);
    const startX = e.clientX;
    const startRatio = splitRatioRef.current;
    const currentContainerWidth = containerWidthRef.current || 1200;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const newRatio = Math.max(0.2, Math.min(0.8, startRatio + dx / currentContainerWidth));
      setSplitRatio(newRatio);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Dragging do Splitter no Touch / Mobile
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setIsDragging(true);
        },
        onPanResponderMove: (_, gestureState) => {
          const w = containerWidthRef.current || 1200;
          const delta = gestureState.dx / w;
          const novo = Math.max(0.2, Math.min(0.8, splitRatioRef.current + delta));
          setSplitRatio(novo);
        },
        onPanResponderRelease: () => {
          setIsDragging(false);
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
        },
      }),
    []
  );

  const subtituloDesktop = [
    ficha.raca?.trim(),
    ficha.classe?.trim(),
    `Nível Total: ${ficha.nivel}`,
    ficha.jogador?.trim() && `Jogador: ${ficha.jogador.trim()}`,
    `PV ${ficha.pvAtual}/${ficha.pvTotal}`,
    `PM ${ficha.pmAtual}/${ficha.pmTotal}`,
    `CA ${caTotal}`,
  ]
    .filter(Boolean)
    .join(' • ');

  // Renderizador centralizado do conteúdo de qualquer aba por chave
  const renderConteudoAba = (chave: AbaKey) => {
    switch (chave) {
      case 'dados_cadastrais':
        return <AbaDadosCadastrais ficha={ficha} onChange={onChange} />;
      case 'atributos':
        return <AbaAtributos ficha={ficha} onChange={onChange} />;
      case 'pericias':
        return <AbaPericias ficha={ficha} onChange={onChange} />;
      case 'habilidades_raca':
        return <AbaHabilidadesRaca ficha={ficha} onChange={onChange} />;
      case 'habilidades_classe':
        return <AbaHabilidadesClasse ficha={ficha} onChange={onChange} />;
      case 'manobras':
        return <AbaManobras ficha={ficha} onChange={onChange} />;
      case 'talentos':
        return <AbaTalentos ficha={ficha} onChange={onChange} />;
      case 'magias':
        return <AbaMagias ficha={ficha} onChange={onChange} />;
      case 'equipamentos':
        return <AbaEquipamentos ficha={ficha} onChange={onChange} />;
      default:
        return null;
    }
  };

  // Barra de abas reutilizável com Drag & Drop e botão de Organizar
  const renderTabBar = (
    abaSelecionada: AbaKey,
    onSelecionar: (chave: AbaKey) => void,
    outroPainelAba?: AbaKey,
    rotuloPainel?: string,
    onFecharPainel?: () => void
  ) => (
    <View style={styles.tabBarWrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarScroll}
      >
        {rotuloPainel && (
          <View style={styles.paneIndicator}>
            <Text style={styles.paneIndicatorText}>{rotuloPainel}</Text>
          </View>
        )}

        {ordemAbas.map((chave) => {
          const info = TODAS_AS_ABAS[chave];
          if (!info) return null;
          const selecionada = abaSelecionada === chave;
          const abertaNoOutro = splitAtivo && outroPainelAba === chave;
          const isDraggingThis = abaArrastando === chave;
          const isHoverTarget = abaHoverAlvo === chave;

          return (
            <TouchableOpacity
              key={chave}
              style={[
                styles.tabItem,
                selecionada && styles.tabItemActive,
                abertaNoOutro && styles.tabItemNoOutro,
              ]}
              onPress={() => onSelecionar(chave)}
              activeOpacity={0.7}
            >
              <View style={styles.tabItemContent}>
                <Text style={styles.tabIcon}>{info.icone}</Text>
                <Text
                  style={[
                    styles.tabText,
                    selecionada && styles.tabTextActive,
                    abertaNoOutro && styles.tabTextNoOutro,
                  ]}
                >
                  {info.titulo}
                </Text>
                {abertaNoOutro && (
                  <View style={styles.badgeOutroPainel}>
                    <Text style={styles.badgeOutroPainelText}>
                      {rotuloPainel === 'Painel 1' ? 'no P2 ⇄' : 'no P1 ⇄'}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Botão de Organizar Ordem das Abas */}
        <TouchableOpacity
          style={styles.btnOrganizarAbas}
          onPress={() => setModalReordenarAberto(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.btnOrganizarAbasText}>⚙️ Ordem</Text>
        </TouchableOpacity>

        {/* Botão de Fechar no Painel 2 */}
        {onFecharPainel && (
          <TouchableOpacity
            style={styles.btnFecharDivisao}
            onPress={onFecharPainel}
            activeOpacity={0.7}
          >
            <Text style={styles.btnFecharDivisaoText}>✕ Fechar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Bar Responsiva */}
      <View style={[styles.topBar, isDesktop ? styles.topBarDesktop : styles.topBarMobile]}>
        <View style={[styles.topBarContent, isDesktop && styles.desktopMaxWidth]}>
          <TouchableOpacity style={styles.backBtn} onPress={onVoltar} activeOpacity={0.8}>
            <Text style={styles.backBtnText}>← Fichas</Text>
          </TouchableOpacity>

          <View style={styles.titleCol}>
            <Text style={styles.titleText} numberOfLines={1}>
              {ficha.nomePersonagem?.trim() || 'Ficha de Personagem'}
            </Text>
            <Text style={styles.subtitleText} numberOfLines={1}>
              {isDesktop
                ? subtituloDesktop || 'Tormenta RPG'
                : `PV ${ficha.pvAtual}/${ficha.pvTotal} • PM ${ficha.pmAtual}/${ficha.pmTotal} • CA ${caTotal}`}
            </Text>
          </View>

          <View style={styles.topRightActions}>
            <TouchableOpacity
              style={styles.compendioTopBtn}
              onPress={() => setCompendioGeralAberto(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.compendioTopBtnText}>📖 Compêndio</Text>
            </TouchableOpacity>

            {/* Botão para Ativar/Desativar Split View no Desktop */}
            {isDesktop && (
              <TouchableOpacity
                style={[styles.splitBtn, splitAtivo && styles.splitBtnActive]}
                onPress={handleToggleSplit}
                activeOpacity={0.8}
              >
                <Text style={[styles.splitBtnText, splitAtivo && styles.splitBtnTextActive]}>
                  {splitAtivo ? '✕ Fechar Divisão' : '◫ Dividir Tela'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.exportBtn} onPress={onExportar} activeOpacity={0.8}>
              <Text style={styles.exportBtnText}>Exportar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSalvarClick} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Corpo da Ficha: Mobile (1 Coluna) vs Desktop (Split View Redimensionável ou 1 Coluna) */}
      {!isDesktop ? (
        /* Layout Mobile: 1 Coluna */
        <View style={styles.mobileBody}>
          {renderTabBar(abaMobile, setAbaMobile)}
          <View style={styles.contentWrap}>
            {renderConteudoAba(abaMobile)}
          </View>
        </View>
      ) : splitAtivo ? (
        /* Layout Desktop: 2 Painéis com Divisória Arrastável */
        <View
          style={styles.desktopSplitBody}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w > 0) setContainerWidth(w);
          }}
        >
          {/* Painel 1 (Esquerda) */}
          <View style={[styles.paneWrap, { flex: splitRatio }]}>
            {renderTabBar(
              abaEsquerda,
              handleSelecionarAbaEsquerda,
              abaDireita,
              'Painel 1'
            )}
            <View style={styles.contentWrap}>
              {renderConteudoAba(abaEsquerda)}
            </View>
          </View>

          {/* Barra Divisória Arrastável (Splitter) */}
          <View
            style={[styles.resizer, isDragging && styles.resizerActive]}
            {...panResponder.panHandlers}
            // @ts-ignore
            onMouseDown={handleMouseDown}
            // @ts-ignore
            onDoubleClick={() => setSplitRatio(0.5)}
          >
            <View style={styles.resizerLine} />
            <View style={styles.resizerHandle}>
              <Text style={styles.resizerHandleDots}>⋮</Text>
            </View>
            <View style={styles.resizerLine} />
          </View>

          {/* Painel 2 (Direita) */}
          <View style={[styles.paneWrap, { flex: 1 - splitRatio }]}>
            {renderTabBar(
              abaDireita,
              handleSelecionarAbaDireita,
              abaEsquerda,
              'Painel 2',
              () => setSplitAtivo(false)
            )}
            <View style={styles.contentWrap}>
              {renderConteudoAba(abaDireita)}
            </View>
          </View>
        </View>
      ) : (
        /* Layout Desktop: Painel Único (Padrão) */
        <View style={styles.desktopSingleBody}>
          {renderTabBar(abaEsquerda, setAbaEsquerda)}
          <View style={styles.contentWrap}>
            {renderConteudoAba(abaEsquerda)}
          </View>
        </View>
      )}

      {/* Modal Reordenador de Abas */}
      <ModalReordenarAbas
        visivel={modalReordenarAberto}
        ordemAtual={ordemAbas}
        onFechar={() => setModalReordenarAberto(false)}
        onSalvarOrdem={atualizarOrdemAbas}
      />

      {/* Compêndio Geral Aberto da Top Bar */}
      <CompendioModal
        visivel={compendioGeralAberto}
        onFechar={() => setCompendioGeralAberto(false)}
        abaInicial="talentos"
        fichaAtual={ficha}
        onAdicionarTalentoAFicha={handleAdicionarTalento}
        onAdicionarMagiaAFicha={handleAdicionarMagia}
        onAplicarRacaAFicha={handleAplicarRaca}
        onAplicarClasseAFicha={handleAplicarClasse}
        onAdicionarEquipamentoAFicha={handleAdicionarEquipamento}
        onAdicionarManobraAFicha={handleAdicionarManobra}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    backgroundColor: COLORS.primary,
  },
  topBarMobile: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  topBarDesktop: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  desktopMaxWidth: {
    maxWidth: 1400,
    alignSelf: 'center',
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: 6,
  },
  backBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  titleCol: {
    flex: 1,
    paddingHorizontal: 2,
  },
  titleText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 12,
    marginTop: 1,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compendioTopBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  compendioTopBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  splitBtn: {
    backgroundColor: 'rgba(200,157,60,0.25)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  splitBtnActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  splitBtnText: {
    color: '#FFEAA7',
    fontWeight: 'bold',
    fontSize: 12,
  },
  splitBtnTextActive: {
    color: '#1F1A17',
  },
  exportBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exportBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  saveBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveBtnText: {
    color: '#1F1A17',
    fontWeight: 'bold',
    fontSize: 12,
  },
  mobileBody: {
    flex: 1,
  },
  desktopSplitBody: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  desktopSingleBody: {
    flex: 1,
  },
  paneWrap: {
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  resizer: {
    width: 14,
    backgroundColor: '#EAE1CF',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'col-resize' as any,
    userSelect: 'none' as any,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    zIndex: 10,
  },
  resizerActive: {
    backgroundColor: '#DFD1B7',
    borderColor: COLORS.gold,
  },
  resizerLine: {
    flex: 1,
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  resizerHandle: {
    width: 14,
    height: 38,
    borderRadius: 7,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  resizerHandleDots: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  tabBarWrap: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabBarScroll: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  paneIndicator: {
    backgroundColor: 'rgba(139,30,30,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
  },
  paneIndicatorText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    cursor: 'default' as any,
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabItemNoOutro: {
    backgroundColor: 'rgba(200,157,60,0.08)',
  },
  tabItemDragging: {
    opacity: 0.4,
  },
  tabItemHoverTarget: {
    backgroundColor: 'rgba(200,157,60,0.22)',
    borderBottomColor: COLORS.gold,
  },
  tabItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabIcon: {
    fontSize: 13,
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  tabTextNoOutro: {
    color: '#8A6414',
  },
  badgeOutroPainel: {
    backgroundColor: 'rgba(200,157,60,0.25)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeOutroPainelText: {
    fontSize: 9.5,
    color: '#8A6414',
    fontWeight: 'bold',
  },
  btnOrganizarAbas: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOrganizarAbasText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  btnFecharDivisao: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(179,38,30,0.1)',
  },
  btnFecharDivisaoText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: 'bold',
  },
  contentWrap: {
    flex: 1,
  },
});
