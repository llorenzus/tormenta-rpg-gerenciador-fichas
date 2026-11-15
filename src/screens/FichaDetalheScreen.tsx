import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
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
  const [abaEsquerda, setAbaEsquerda] = useState(1); // Padrão Desktop: Atributos
  const [abaDireita, setAbaDireita] = useState(3); // Padrão Desktop: Habilidades / Magias
  const [splitAtivo, setSplitAtivo] = useState(true);

  const caTotal = calcularCaTotal(ficha);

  const handleSalvarClick = async () => {
    const sucesso = await onSalvarManual();
    if (sucesso) {
      Alert.alert('Ficha Salva', 'Todas as alterações foram salvas no seu aparelho.');
    }
  };

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
    onFecharPainel?: () => void,
    rotuloPainel?: string
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
          return (
            <TouchableOpacity
              key={titulo}
              style={[styles.tabItem, selecionada && styles.tabItemActive]}
              onPress={() => onSelecionar(idx)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabText, selecionada && styles.tabTextActive]}
              >
                {titulo}
              </Text>
            </TouchableOpacity>
          );
        })}
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
            {/* Botão de Split View no Desktop */}
            {isDesktop && (
              <TouchableOpacity
                style={[styles.splitBtn, splitAtivo && styles.splitBtnActive]}
                onPress={() => setSplitAtivo(!splitAtivo)}
                activeOpacity={0.8}
              >
                <Text style={[styles.splitBtnText, splitAtivo && styles.splitBtnTextActive]}>
                  {splitAtivo ? '◫ 2 Painéis' : '▢ 1 Painel'}
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

      {/* Corpo da Ficha: Mobile (1 Coluna) vs Desktop (Split View ou 1 Coluna) */}
      {!isDesktop ? (
        /* Layout Mobile */
        <View style={styles.mobileBody}>
          {renderTabBar(abaMobile, setAbaMobile)}
          <View style={styles.contentWrap}>
            {renderConteudoAba(abaMobile)}
          </View>
        </View>
      ) : splitAtivo ? (
        /* Layout Desktop: 2 Painéis Lado a Lado (Split View) */
        <View style={styles.desktopSplitBody}>
          {/* Painel 1 (Esquerda) */}
          <View style={styles.paneLeft}>
            {renderTabBar(abaEsquerda, setAbaEsquerda, undefined, 'Painel 1')}
            <View style={styles.contentWrap}>
              {renderConteudoAba(abaEsquerda)}
            </View>
          </View>

          {/* Painel 2 (Direita) */}
          <View style={styles.paneRight}>
            {renderTabBar(abaDireita, setAbaDireita, () => setSplitAtivo(false), 'Painel 2')}
            <View style={styles.contentWrap}>
              {renderConteudoAba(abaDireita)}
            </View>
          </View>
        </View>
      ) : (
        /* Layout Desktop: Painel Único */
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
  },
  desktopSingleBody: {
    flex: 1,
  },
  paneLeft: {
    flex: 1,
    borderRightWidth: 1.5,
    borderRightColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  paneRight: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  tabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
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
