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
import { abrirCompendioEmJanelaSeparada } from '../utils/janelaCompendio';
import { ModalCompartilharFicha } from '../components/ModalCompartilharFicha';
import { User } from 'firebase/auth';

interface Props {
  ficha: FichaPersonagem;
  somenteLeitura?: boolean;
  usuarioAtual?: User | null;
  onChange: (nova: FichaPersonagem) => void;
  onSalvarManual: () => Promise<boolean> | boolean;
  onExportar: () => void;
  onVoltar: () => void;
}

const STORAGE_KEY_ORDEM_PREFERIDA = '@trpg_ordem_abas_preferida';

export const FichaDetalheScreen: React.FC<Props> = ({
  ficha,
  somenteLeitura = false,
  usuarioAtual,
  onChange,
  onSalvarManual,
  onExportar,
  onVoltar,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 850;
  const isReadOnly = !!somenteLeitura || !!ficha.isCompartilhadaComigo;

  const [modalCompartilharAberto, setModalCompartilharAberto] = useState(false);

  // Wrapper seguro para evitar mutações em fichas de somente leitura
  const handleSafeChange = (nova: FichaPersonagem) => {
    if (isReadOnly) return;
    onChange(nova);
  };

  // Bloqueio rigoroso de edição em modo somente leitura no Web e Electron Desktop
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'trpg-readonly-mode-lock';
      let tag = document.getElementById(styleId);
      if (isReadOnly) {
        if (!tag) {
          tag = document.createElement('style');
          tag.id = styleId;
          tag.innerHTML = `
            .trpg-readonly-mode input,
            .trpg-readonly-mode textarea,
            .trpg-readonly-mode select,
            .trpg-readonly-mode [contenteditable="true"] {
              pointer-events: none !important;
              background-color: rgba(0, 0, 0, 0.04) !important;
              cursor: not-allowed !important;
              user-select: text !important;
            }
            .trpg-readonly-mode [role="button"]:not(.trpg-allow-click),
            .trpg-readonly-mode button:not(.trpg-allow-click) {
              opacity: 0.75 !important;
              pointer-events: none !important;
              cursor: not-allowed !important;
            }
          `;
          document.head.appendChild(tag);
        }
      } else if (tag) {
        tag.remove();
      }
      return () => {
        if (tag) tag.remove();
      };
    }
  }, [isReadOnly]);

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
        .catch(() => { });
    }
  }, []);

  // Garante que a ordem reaja a mudanças externas na ficha
  useEffect(() => {
    if (Array.isArray(ficha.ordemAbas) && ficha.ordemAbas.length > 0) {
      const salvas = ficha.ordemAbas.filter((k) => k in TODAS_AS_ABAS) as AbaKey[];
      const faltantes = ORDEM_ABAS_PADRAO.filter((k) => !salvas.includes(k));
      const completa = [...salvas, ...faltantes];
      setOrdemAbas(completa);
    }
  }, [ficha.id, JSON.stringify(ficha.ordemAbas)]);

  // Estado das abas selecionadas por Chave
  const [abaMobile, setAbaMobile] = useState<AbaKey>('atributos');
  const [abaEsquerda, setAbaEsquerda] = useState<AbaKey>('atributos');
  const [abaDireita, setAbaDireita] = useState<AbaKey>('habilidades_classe');

  // Modal de Organização de Abas
  const [modalReordenarAberto, setModalReordenarAberto] = useState(false);

  // Split View no Desktop
  const [splitAtivo, setSplitAtivo] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.5); // 50% / 50%
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [compendioGeralAberto, setCompendioGeralAberto] = useState(false);
  const scrollRefP1 = useRef<ScrollView | null>(null);
  const scrollRefP2 = useRef<ScrollView | null>(null);
  const scrollPosP1 = useRef(0);
  const scrollPosP2 = useRef(0);

  const atualizarOrdemAbas = (novaOrdem: AbaKey[]) => {
    setOrdemAbas(novaOrdem);
    handleSafeChange({ ...ficha, ordemAbas: novaOrdem });
    AsyncStorage.setItem(STORAGE_KEY_ORDEM_PREFERIDA, JSON.stringify(novaOrdem)).catch(() => { });
  };

  const handleAdicionarTalento = (talento: TalentoData) => {
    const novo = converterTalentoParaItem(talento);
    handleSafeChange({ ...ficha, talentos: [...ficha.talentos, novo] });
  };

  const handleAdicionarMagia = (magia: MagiaData) => {
    const nova = converterMagiaParaItem(magia);
    handleSafeChange({ ...ficha, magias: [...ficha.magias, nova] });
  };

  const handleAdicionarManobra = (manobra: PosturaData | GolpeMarcialData) => {
    const nova = converterManobraParaItem(manobra);
    const manobrasAtuais = Array.isArray(ficha.manobras) ? ficha.manobras : [];
    handleSafeChange({ ...ficha, manobras: [...manobrasAtuais, nova] });
  };

  const handleAplicarRaca = (raca: RacaData) => {
    const novosTracos: HabilidadeOuTalento[] = raca.tracosRaciais.map((t) => ({
      id: gerarId(),
      nome: `${t.nome} (${raca.nome})`,
      descricao: t.descricao,
    }));
    handleSafeChange({
      ...ficha,
      raca: raca.nome,
      tamanho: raca.tamanho,
      deslocamento: `${raca.deslocamento}m`,
      habilidadesRaca: [...ficha.habilidadesRaca, ...novosTracos],
    });
  };

  const handleAplicarClasse = (classe: ClasseData) => {
    handleSafeChange(aplicarClasseNaFicha(ficha, classe));
  };

  const handleAdicionarEquipamento = (equip: EquipamentoData) => {
    if (equip.tipo === 'Arma') {
      const novaArma = converterArmaParaItem(equip);
      handleSafeChange({ ...ficha, armas: [...ficha.armas, novaArma] });
    } else if (equip.tipo === 'Armadura' || equip.tipo === 'Escudo') {
      const novaArmadura = converterArmaduraParaItem(equip);
      handleSafeChange({ ...ficha, armaduras: [...ficha.armaduras, novaArmadura] });
    } else {
      const novoItem = converterItemGeralParaItem(equip);
      handleSafeChange({ ...ficha, itensGerais: [...ficha.itensGerais, novoItem] });
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

  const pvTemp = ficha.buffsTemporarios?.pvTemporario || 0;
  const pvTexto = `PV ${ficha.pvAtual}${pvTemp > 0 ? ` (+${pvTemp} temp)` : ''}/${ficha.pvTotal}`;

  const subtituloDesktop = [
    ficha.raca?.trim(),
    ficha.classe?.trim(),
    `Nível Total: ${ficha.nivel}`,
    ficha.jogador?.trim() && `Jogador: ${ficha.jogador.trim()}`,
    pvTexto,
    `PM ${ficha.pmAtual}/${ficha.pmTotal}`,
    `CA ${caTotal}`,
  ]
    .filter(Boolean)
    .join(' • ');

  // Renderizador centralizado do conteúdo de qualquer aba por chave
  const renderConteudoAba = (chave: AbaKey) => {
    let conteudo = null;
    switch (chave) {
      case 'dados_cadastrais':
        conteudo = <AbaDadosCadastrais ficha={ficha} onChange={handleSafeChange} />;
        break;
      case 'atributos':
        conteudo = <AbaAtributos ficha={ficha} onChange={handleSafeChange} />;
        break;
      case 'pericias':
        conteudo = <AbaPericias ficha={ficha} onChange={handleSafeChange} />;
        break;
      case 'habilidades_raca':
        conteudo = <AbaHabilidadesRaca ficha={ficha} onChange={handleSafeChange} />;
        break;
      case 'habilidades_classe':
        conteudo = <AbaHabilidadesClasse ficha={ficha} onChange={handleSafeChange} />;
        break;
      case 'manobras':
        conteudo = <AbaManobras ficha={ficha} onChange={handleSafeChange} />;
        break;
      case 'talentos':
        conteudo = <AbaTalentos ficha={ficha} onChange={handleSafeChange} />;
        break;
      case 'magias':
        conteudo = <AbaMagias ficha={ficha} onChange={handleSafeChange} />;
        break;
      case 'equipamentos':
        conteudo = <AbaEquipamentos ficha={ficha} onChange={handleSafeChange} />;
        break;
      default:
        return null;
    }

    return (
      <View
        style={[styles.abaConteudoWrapper, isReadOnly && styles.abaConteudoReadOnly]}
        // @ts-ignore
        className={isReadOnly ? 'trpg-readonly-mode' : undefined}
      >
        {isReadOnly && (
          <View style={styles.bannerReadOnlyAba}>
            <Text style={styles.bannerReadOnlyAbaIcon}>🔒</Text>
            <Text style={styles.bannerReadOnlyAbaText}>
              Ficha em modo somente leitura (Dono:{' '}
              <Text style={styles.bannerReadOnlyAbaBold}>{ficha.donoNome || 'Outro Jogador'}</Text>
              ). Edição desabilitada.
            </Text>
          </View>
        )}
        {conteudo}
      </View>
    );
  };

  // Barra de abas reutilizável com botão de Organizar e botões de rolagem lateral rápida
  const renderTabBar = (
    abaSelecionada: AbaKey,
    onSelecionar: (chave: AbaKey) => void,
    outroPainelAba?: AbaKey,
    rotuloPainel?: string,
    onFecharPainel?: () => void
  ) => {
    const isPainel2 = rotuloPainel === 'Painel 2';
    const targetRef = isPainel2 ? scrollRefP2 : scrollRefP1;
    const posRef = isPainel2 ? scrollPosP2 : scrollPosP1;

    const handleRolarEsquerda = () => {
      const novoX = Math.max(0, posRef.current - 240);
      posRef.current = novoX;
      targetRef.current?.scrollTo({ x: novoX, animated: true });
    };

    const handleRolarDireita = () => {
      const novoX = posRef.current + 240;
      posRef.current = novoX;
      targetRef.current?.scrollTo({ x: novoX, animated: true });
    };

    return (
      <View style={styles.tabBarWrap}>
        {/* Botão de navegação para a Esquerda */}
        <TouchableOpacity
          style={styles.tabScrollArrowBtn}
          onPress={handleRolarEsquerda}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          accessibilityLabel="Rolar abas para a esquerda"
        >
          <Text style={styles.tabScrollArrowText}>◀</Text>
        </TouchableOpacity>

        <ScrollView
          ref={targetRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
          keyboardShouldPersistTaps="handled"
          style={styles.tabBarScrollView}
          onScroll={(e) => {
            posRef.current = e.nativeEvent.contentOffset.x;
          }}
          scrollEventThrottle={16}
          // @ts-ignore
          onWheel={(e: any) => {
            if (e.deltaY) {
              const novoX = Math.max(0, posRef.current + e.deltaY * 1.5);
              posRef.current = novoX;
              targetRef.current?.scrollTo({ x: novoX, animated: false });
            }
          }}
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
          {/* Opção no final do scroll das abas */}
          <TouchableOpacity
            style={styles.tabItemOrganizar}
            onPress={() => setModalReordenarAberto(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <View style={styles.tabItemContent}>
              <Text style={styles.tabIcon}>⚙️</Text>
              <Text style={styles.tabTextOrganizar}>Ordem das Abas</Text>
            </View>
          </TouchableOpacity>

          {/* Botão de Fechar no Painel 2 */}
          {onFecharPainel && (
            <TouchableOpacity
              style={styles.btnFecharDivisao}
              onPress={onFecharPainel}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
            >
              <Text style={styles.btnFecharDivisaoText}>✕ Fechar</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Botão de navegação para a Direita */}
        <TouchableOpacity
          style={styles.tabScrollArrowBtn}
          onPress={handleRolarDireita}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          accessibilityLabel="Rolar abas para a direita"
        >
          <Text style={styles.tabScrollArrowText}>▶</Text>
        </TouchableOpacity>

        {/* Botão fixo no canto da listagem das abas para acesso rápido */}
        <TouchableOpacity
          style={styles.fixedTabOrganizarBtn}
          onPress={() => setModalReordenarAberto(true)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          accessibilityLabel="Organizar Ordem das Abas"
        >
          <Text style={styles.fixedTabOrganizarIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
            <View style={styles.titleWithBadgeRow}>
              <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
                {ficha.nomePersonagem?.trim() || 'Ficha de Personagem'}
              </Text>
              {isReadOnly && (
                <View style={styles.badgeReadOnlyHeader}>
                  <Text style={styles.badgeReadOnlyHeaderText} numberOfLines={1}>
                    👁️ Somente Leitura (Dono: {ficha.donoNome || 'Outro Jogador'})
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.subtitleText} numberOfLines={1} ellipsizeMode="tail">
              {isDesktop
                ? subtituloDesktop || 'Tormenta RPG'
                : `${pvTexto} • PM ${ficha.pmAtual}/${ficha.pmTotal} • CA ${caTotal}`}
            </Text>
          </View>

          <View style={styles.topRightActions}>
            <TouchableOpacity
              style={styles.compendioTopBtn}
              onPress={() => {
                if (isDesktop && Platform.OS === 'web') {
                  abrirCompendioEmJanelaSeparada();
                } else {
                  setCompendioGeralAberto(true);
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.compendioTopBtnText}>
                {isDesktop ? '📖 Compêndio' : '📖'}
              </Text>
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

            {!isReadOnly && usuarioAtual && (
              <TouchableOpacity
                style={styles.btnCompartilharTop}
                onPress={() => setModalCompartilharAberto(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnCompartilharTopText}>
                  {isDesktop ? '👥 Compartilhar' : '👥'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.exportBtn} onPress={onExportar} activeOpacity={0.8}>
              <Text style={styles.exportBtnText}>Exportar</Text>
            </TouchableOpacity>

            {!isReadOnly && (
              <TouchableOpacity style={styles.saveBtn} onPress={handleSalvarClick} activeOpacity={0.8}>
                <Text style={styles.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
            )}
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
        onAtualizarFichaAtual={handleSafeChange}
        onAdicionarTalentoAFicha={handleAdicionarTalento}
        onAdicionarMagiaAFicha={handleAdicionarMagia}
        onAplicarRacaAFicha={handleAplicarRaca}
        onAplicarClasseAFicha={handleAplicarClasse}
        onAdicionarEquipamentoAFicha={handleAdicionarEquipamento}
        onAdicionarManobraAFicha={handleAdicionarManobra}
      />

      {/* Modal de Compartilhamento de Ficha */}
      <ModalCompartilharFicha
        visivel={modalCompartilharAberto}
        ficha={ficha}
        usuarioAtual={usuarioAtual || null}
        onFechar={() => setModalCompartilharAberto(false)}
        onFichaAtualizada={(fAtualizada) => {
          onChange(fAtualizada);
        }}
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
    paddingHorizontal: 10,
    paddingVertical: 8,
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
    gap: 6,
  },
  desktopMaxWidth: {
    maxWidth: 1400,
    alignSelf: 'center',
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: 4,
    flexShrink: 0,
  },
  backBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    paddingHorizontal: 4,
  },
  titleWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  titleText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  badgeReadOnlyHeader: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeReadOnlyHeaderText: {
    color: '#BFDBFE',
    fontSize: 11,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11.5,
    marginTop: 1,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  btnCompartilharTop: {
    backgroundColor: 'rgba(217, 119, 6, 0.25)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
    flexShrink: 0,
  },
  btnCompartilharTopText: {
    color: '#FDE68A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  compendioTopBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    flexShrink: 0,
  },
  compendioTopBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  compendioJanelaSeparadaBtn: {
    backgroundColor: 'rgba(200,157,60,0.22)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    flexShrink: 0,
  },
  compendioJanelaSeparadaBtnText: {
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
    flexShrink: 0,
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
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
    flexShrink: 0,
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
    flexShrink: 0,
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
  tabScrollArrowBtn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139,30,30,0.06)',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: COLORS.border,
    cursor: 'pointer' as any,
    zIndex: 5,
  },
  tabScrollArrowText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
  },
  tabBarScrollView: {
    flex: 1,
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
    cursor: 'pointer' as any,
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabItemNoOutro: {
    backgroundColor: 'rgba(200,157,60,0.08)',
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
  fixedTabOrganizarBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(139,30,30,0.06)',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer' as any,
  },
  fixedTabOrganizarIcon: {
    fontSize: 15,
  },
  tabItemOrganizar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 4,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(139,30,30,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139,30,30,0.2)',
    cursor: 'pointer' as any,
  },
  tabTextOrganizar: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
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
  abaConteudoWrapper: {
    flex: 1,
  },
  abaConteudoReadOnly: {
    opacity: 0.96,
  },
  bannerReadOnlyAba: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  bannerReadOnlyAbaIcon: {
    fontSize: 16,
  },
  bannerReadOnlyAbaText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    fontWeight: '500',
  },
  bannerReadOnlyAbaBold: {
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
});
