import React, { useRef, useState } from 'react';
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
import { AbaAtributos } from '../components/AbaAtributos';
import { AbaDadosCadastrais } from '../components/AbaDadosCadastrais';
import { AbaEquipamentos } from '../components/AbaEquipamentos';
import { AbaHabilidadesEMagias } from '../components/AbaHabilidadesEMagias';
import { AbaPericias } from '../components/AbaPericias';
import { calcularCaTotal, FichaPersonagem } from '../models/ficha';
import { COLORS } from '../theme/colors';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
  onSalvarManual: () => Promise<boolean> | boolean;
  onExportar: () => void;
  onVoltar: () => void;
}

const ABAS = [
  'Dados Cadastrais',
  'Atributos',
  'Perícias',
  'Habilidades / Magias',
  'Equipamentos',
];

export const FichaDetalheScreen: React.FC<Props> = ({
  ficha,
  onChange,
  onSalvarManual,
  onExportar,
  onVoltar,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 850;

  // Estado das abas
  const [abaMobile, setAbaMobile] = useState(1); // Padrão: Atributos
  const [abaEsquerda, setAbaEsquerda] = useState(1); // Padrão: Atributos
  const [abaDireita, setAbaDireita] = useState(3); // Padrão: Habilidades / Magias

  // Padrão inicial: 1 painel único (o usuário ativa split view se desejar)
  const [splitAtivo, setSplitAtivo] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.5); // 50% / 50%
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const containerWidthRef = useRef(containerWidth);
  containerWidthRef.current = containerWidth;
  const splitRatioRef = useRef(splitRatio);
  splitRatioRef.current = splitRatio;

  const caTotal = calcularCaTotal(ficha);

  const handleSalvarClick = async () => {
    const sucesso = await onSalvarManual();
    if (sucesso) {
      Alert.alert('Ficha Salva', 'Todas as alterações foram salvas no seu aparelho.');
    }
  };

  // Alterna o Split View
  const handleToggleSplit = () => {
    if (!splitAtivo) {
      // Ao abrir o segundo painel, garante que ele não abra a mesma aba
      const proximaDireita = abaEsquerda === 3 ? 1 : 3;
      setAbaDireita(proximaDireita);
      setSplitAtivo(true);
    } else {
      setSplitAtivo(false);
    }
  };

  // Seleção de aba no Painel 1 (com swap inteligente se já estiver no Painel 2)
  const handleSelecionarAbaEsquerda = (idx: number) => {
    if (idx === abaEsquerda) return;
    if (splitAtivo && idx === abaDireita) {
      // Swap: a aba anterior do Painel 1 vai para o Painel 2
      setAbaDireita(abaEsquerda);
    }
    setAbaEsquerda(idx);
  };

  // Seleção de aba no Painel 2 (com swap inteligente se já estiver no Painel 1)
  const handleSelecionarAbaDireita = (idx: number) => {
    if (idx === abaDireita) return;
    if (splitAtivo && idx === abaEsquerda) {
      // Swap: a aba anterior do Painel 2 vai para o Painel 1
      setAbaEsquerda(abaDireita);
    }
    setAbaDireita(idx);
  };

  // Dragging no Web / Electron via Mouse Events
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

  // Dragging no Touch / Mobile via PanResponder
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
      }),
    []
  );

  const subtituloDesktop = [
    ficha.raca?.trim(),
    ficha.classe?.trim(),
    `Nível ${ficha.nivel}`,
    ficha.jogador?.trim() && `Jogador: ${ficha.jogador.trim()}`,
    `PV ${ficha.pvAtual}/${ficha.pvTotal}`,
    `PM ${ficha.pmAtual}/${ficha.pmTotal}`,
    `CA ${caTotal}`,
  ]
    .filter(Boolean)
    .join(' • ');

  // Renderizador centralizado do conteúdo de qualquer aba
  const renderConteudoAba = (abaIdx: number) => {
    switch (abaIdx) {
      case 0:
        return <AbaDadosCadastrais ficha={ficha} onChange={onChange} />;
      case 1:
        return <AbaAtributos ficha={ficha} onChange={onChange} />;
      case 2:
        return <AbaPericias ficha={ficha} onChange={onChange} />;
      case 3:
        return <AbaHabilidadesEMagias ficha={ficha} onChange={onChange} />;
      case 4:
        return <AbaEquipamentos ficha={ficha} onChange={onChange} />;
      default:
        return null;
    }
  };

  // Barra de abas reutilizável por painel
  const renderTabBar = (
    abaSelecionada: number,
    onSelecionar: (idx: number) => void,
    outroPainelAba?: number,
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

        {ABAS.map((titulo, idx) => {
          const selecionada = abaSelecionada === idx;
          const abertaNoOutro = splitAtivo && outroPainelAba === idx;

          return (
            <TouchableOpacity
              key={titulo}
              style={[
                styles.tabItem,
                selecionada && styles.tabItemActive,
                abertaNoOutro && styles.tabItemNoOutro,
              ]}
              onPress={() => onSelecionar(idx)}
              activeOpacity={0.7}
            >
              <View style={styles.tabItemContent}>
                <Text
                  style={[
                    styles.tabText,
                    selecionada && styles.tabTextActive,
                    abertaNoOutro && styles.tabTextNoOutro,
                  ]}
                >
                  {titulo}
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
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
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
