import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  calcularCaTotal,
  FichaPersonagem,
  formatarModificador,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { ModalSobre } from '../components/ModalSobre';
import { abrirCompendioEmJanelaSeparada } from '../utils/janelaCompendio';
import { User } from 'firebase/auth';

interface Props {
  fichas: FichaPersonagem[];
  fichasCompartilhadas?: FichaPersonagem[];
  usuarioAtual?: User | null;
  onAbrirConta?: () => void;
  onCriarNova: () => void;
  onImportarFicha: () => void;
  onExportarFicha: (ficha: FichaPersonagem) => void;
  onAbrirFicha: (ficha: FichaPersonagem) => void;
  onExcluirFicha: (id: string) => void;
  onAbrirCompendio: () => void;
}

export const ListaFichasScreen: React.FC<Props> = ({
  fichas,
  fichasCompartilhadas = [],
  usuarioAtual,
  onAbrirConta,
  onCriarNova,
  onImportarFicha,
  onExportarFicha,
  onAbrirFicha,
  onExcluirFicha,
  onAbrirCompendio,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;
  const numColumns = width >= 1200 ? 3 : width >= 800 ? 2 : 1;

  const [abaAtiva, setAbaAtiva] = useState<'meus' | 'compartilhados'>('meus');
  const [filtroCompartilhados, setFiltroCompartilhados] = useState('');
  const [fichaParaExcluir, setFichaParaExcluir] = useState<FichaPersonagem | null>(null);
  const [sobreVisivel, setSobreVisivel] = useState(false);

  // Filtro exclusivo para a aba de personagens compartilhados
  const listaCompartilhadosFiltrada = React.useMemo(() => {
    const termo = filtroCompartilhados.trim().toLowerCase();
    if (!termo) return fichasCompartilhadas;
    return fichasCompartilhadas.filter((f) => {
      const nome = (f.nomePersonagem || '').toLowerCase();
      const dono = (f.donoNome || '').toLowerCase();
      const jogador = (f.jogador || '').toLowerCase();
      const campanha = (f.campanha || '').toLowerCase();
      return (
        nome.includes(termo) ||
        dono.includes(termo) ||
        jogador.includes(termo) ||
        campanha.includes(termo)
      );
    });
  }, [fichasCompartilhadas, filtroCompartilhados]);

  const confirmarExclusao = (ficha: FichaPersonagem) => {
    setFichaParaExcluir(ficha);
  };

  const handleExecutarExclusao = () => {
    if (fichaParaExcluir) {
      onExcluirFicha(fichaParaExcluir.id);
      setFichaParaExcluir(null);
    }
  };


  return (
    <View style={styles.container}>
      {/* Top Bar Responsiva: Perfeita em Mobile e Desktop */}
      <View style={[styles.topBar, isDesktop ? styles.topBarDesktop : styles.topBarMobile]}>
        <View style={[styles.topBarContent, isDesktop && styles.desktopMaxWidth]}>
          <View style={styles.topBarLeft}>
            <Text
              style={isDesktop ? styles.titleDesktop : styles.titleMobile}
              numberOfLines={1}
            >
              Tormenta RPG
            </Text>
            <Text
              style={isDesktop ? styles.subtitleDesktop : styles.subtitleMobile}
              numberOfLines={1}
            >
              {isDesktop ? 'Gerenciador de Fichas de Personagem' : 'Gerenciador de Fichas'}
            </Text>
          </View>

          <View style={[styles.topActionsRow, isDesktop ? styles.actionsDesktop : styles.actionsMobile]}>
            {onAbrirConta && (
              <TouchableOpacity
                style={[
                  styles.btnAction,
                  styles.btnUserBadge,
                  isDesktop ? styles.btnUserBadgeDesktop : styles.btnUserBadgeMobile,
                ]}
                onPress={onAbrirConta}
                activeOpacity={0.8}
                accessibilityLabel="Conta e Perfil"
              >
                <Text style={styles.btnUserIcon}>{usuarioAtual ? '👤' : '🔑'}</Text>
                <Text
                  style={styles.btnUserText}
                  numberOfLines={1}
                >
                  {usuarioAtual
                    ? usuarioAtual.displayName || usuarioAtual.email?.split('@')[0] || 'Usuário'
                    : 'Entrar'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.btnAction, styles.btnSobreAction]}
              onPress={() => setSobreVisivel(true)}
              activeOpacity={0.8}
              accessibilityLabel="Informações do Aplicativo"
            >
              <Text style={styles.btnSobreActionText}>ℹ️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnAction, isDesktop ? styles.btnCompendioDesktop : styles.btnCompendioMobile]}
              onPress={() => {
                if (isDesktop && Platform.OS === 'web') {
                  abrirCompendioEmJanelaSeparada();
                } else {
                  onAbrirCompendio();
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.btnText, isDesktop ? styles.btnTextCompendioDesktop : styles.btnTextCompendioMobile]}>
                {isDesktop ? '📖 Compêndio' : '📖 Regras'}
              </Text>
            </TouchableOpacity>

            {abaAtiva === 'meus' && (
              <>
                <TouchableOpacity
                  style={[styles.btnAction, isDesktop ? styles.btnImportarDesktop : styles.btnImportarMobile]}
                  onPress={onImportarFicha}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.btnText, isDesktop ? styles.btnTextWhiteDesktop : styles.btnTextWhiteMobile]}>
                    {isDesktop ? 'Importar JSON' : 'Importar'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnAction, isDesktop ? styles.btnNovaDesktop : styles.btnNovaMobile]}
                  onPress={onCriarNova}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.btnText, isDesktop ? styles.btnTextDarkDesktop : styles.btnTextDarkMobile]}>
                    {isDesktop ? '+ Nova Ficha' : '+ Nova'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Abas: Meus Personagens vs Personagens Compartilhados */}
      <View style={[styles.tabsBarWrap, isDesktop && styles.tabsBarWrapDesktop]}>
        <View style={[styles.tabsBarContent, isDesktop && styles.desktopMaxWidth]}>
          <TouchableOpacity
            style={[styles.mainTabBtn, abaAtiva === 'meus' && styles.mainTabBtnActive]}
            onPress={() => setAbaAtiva('meus')}
            activeOpacity={0.8}
          >
            <Text style={[styles.mainTabText, abaAtiva === 'meus' && styles.mainTabTextActive]}>
              🛡️ Meus Personagens ({fichas.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mainTabBtn, abaAtiva === 'compartilhados' && styles.mainTabBtnActive]}
            onPress={() => setAbaAtiva('compartilhados')}
            activeOpacity={0.8}
          >
            <Text style={[styles.mainTabText, abaAtiva === 'compartilhados' && styles.mainTabTextActive]}>
              👥 Personagens Compartilhados ({fichasCompartilhadas.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de Busca e Filtro (Exclusiva para a aba de Personagens Compartilhados) */}
      {abaAtiva === 'compartilhados' && fichasCompartilhadas.length > 0 && (
        <View style={[styles.filterBarWrap, isDesktop && styles.filterBarWrapDesktop]}>
          <View style={[styles.filterBarContent, isDesktop && styles.desktopMaxWidth]}>
            <View style={styles.filterInputRow}>
              <Text style={styles.filterIcon}>🔍</Text>
              <TextInput
                style={styles.filterInput}
                value={filtroCompartilhados}
                onChangeText={setFiltroCompartilhados}
                placeholder="Filtrar por nome de personagem, jogador ou campanha..."
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {filtroCompartilhados.length > 0 && (
                <TouchableOpacity
                  onPress={() => setFiltroCompartilhados('')}
                  style={styles.filterClearBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.filterClearBtnText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {abaAtiva === 'meus' && fichas.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyCard, isDesktop && styles.emptyCardDesktop]}>
            <Text style={styles.emptyTitle}>Nenhuma ficha salva ainda</Text>
            <Text style={styles.emptyDesc}>
              Toque em "+ Nova Ficha" para criar seu personagem de Tormenta RPG
              ou importe um arquivo .json enviado por um amigo.
            </Text>
            <View style={styles.emptyActionsCol}>
              <TouchableOpacity
                style={styles.btnCriarGrande}
                onPress={onCriarNova}
              >
                <Text style={styles.btnCriarGrandeText}>
                  + Criar Personagem
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnCompendioGrande}
                onPress={onAbrirCompendio}
              >
                <Text style={styles.btnCompendioGrandeText}>
                  📖 Consultar Compêndio de Regras
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnImportarGrande}
                onPress={onImportarFicha}
              >
                <Text style={styles.btnImportarGrandeText}>
                  Importar Arquivo JSON
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : abaAtiva === 'compartilhados' && fichasCompartilhadas.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyCard, isDesktop && styles.emptyCardDesktop]}>
            <Text style={styles.emptyTitle}>Nenhum personagem compartilhado</Text>
            <Text style={styles.emptyDesc}>
              Personagens compartilhados por outros jogadores aparecerão aqui para você acompanhar em tempo real.
            </Text>
            <View style={styles.infoBoxShared}>
              <Text style={styles.infoBoxSharedText}>
                💡 Para receber acesso, peça para o dono da ficha clicar no botão "👥 Compartilhar" dentro da ficha dele e informar seu username (
                <Text style={styles.negrito}>
                  {usuarioAtual?.displayName || usuarioAtual?.email?.split('@')[0] || 'seu usuário'}
                </Text>
                ) ou seu e-mail.
              </Text>
            </View>
          </View>
        </View>
      ) : abaAtiva === 'compartilhados' && listaCompartilhadosFiltrada.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyCard, isDesktop && styles.emptyCardDesktop]}>
            <Text style={styles.emptyTitle}>Nenhum personagem encontrado</Text>
            <Text style={styles.emptyDesc}>
              Nenhum personagem compartilhado corresponde à busca "{filtroCompartilhados}".
            </Text>
            <TouchableOpacity
              style={styles.btnLimparFiltro}
              onPress={() => setFiltroCompartilhados('')}
            >
              <Text style={styles.btnLimparFiltroText}>Limpar Filtro</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          key={`lista-fichas-grid-${numColumns}-${abaAtiva}`}
          data={abaAtiva === 'meus' ? fichas : listaCompartilhadosFiltrada}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
          contentContainerStyle={[styles.listContent, isDesktop && styles.listContentDesktop]}
          renderItem={({ item }) => {
            const ca = calcularCaTotal(item);
            const isCompartilhada = abaAtiva === 'compartilhados' || !!item.isCompartilhadaComigo;
            const subtitulo = [
              item.raca?.trim(),
              item.classe?.trim(),
              `Nível ${item.nivel}`,
            ]
              .filter(Boolean)
              .join(' • ');

            return (
              <TouchableOpacity
                style={[
                  styles.fichaCard,
                  numColumns > 1 && styles.fichaCardGrid,
                  isCompartilhada && styles.fichaCardShared,
                ]}
                onPress={() => onAbrirFicha(item)}
                activeOpacity={0.85}
              >
                {/* Badges de compartilhamento, dono e campanha */}
                {isCompartilhada && (
                  <View style={styles.sharedBadgesRow}>
                    <View style={styles.badgeReadOnly}>
                      <Text style={styles.badgeReadOnlyText}>👁️ Apenas Leitura</Text>
                    </View>
                    <View style={styles.badgeOwner}>
                      <Text style={styles.badgeOwnerText} numberOfLines={1}>
                        👤 Dono: {item.donoNome || item.jogador || 'Outro Jogador'}
                      </Text>
                    </View>
                    {item.campanha ? (
                      <View style={styles.badgeCampanha}>
                        <Text style={styles.badgeCampanhaText} numberOfLines={1}>
                          🎲 {item.campanha}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}

                <View style={styles.fichaCardTop}>
                  <View style={styles.fichaTitleCol}>
                    <Text style={styles.fichaNome} numberOfLines={1}>
                      {item.nomePersonagem?.trim() || 'Personagem Sem Nome'}
                    </Text>
                    <Text style={styles.fichaSub} numberOfLines={1}>
                      {subtitulo || 'Sem detalhes cadastrados'}
                    </Text>
                  </View>
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.btnExport}
                      onPress={() => onExportarFicha(item)}
                    >
                      <Text style={styles.btnExportText}>Exportar</Text>
                    </TouchableOpacity>

                    {!isCompartilhada ? (
                      <TouchableOpacity
                        style={styles.btnDelete}
                        onPress={() => confirmarExclusao(item)}
                      >
                        <Text style={styles.btnDeleteText}>Excluir</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.btnVer}>
                        <Text style={styles.btnVerText}>Ver →</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.badgesRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>PV </Text>
                    <Text style={styles.badgeValue}>
                      {item.pvAtual}/{item.pvTotal}
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>PM </Text>
                    <Text style={styles.badgeValue}>
                      {item.pmAtual}/{item.pmTotal}
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>CA </Text>
                    <Text style={styles.badgeValue}>{ca}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>BBA </Text>
                    <Text style={styles.badgeValue}>
                      {formatarModificador(item.bba)}
                    </Text>
                  </View>
                </View>

                {isDesktop && (
                  <View style={styles.desktopOpenHint}>
                    <Text style={styles.desktopOpenHintText}>
                      {isCompartilhada
                        ? 'Clique para visualizar a ficha em tempo real (somente leitura) →'
                        : 'Clique para abrir e editar a ficha →'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Modal de Confirmação de Exclusão (100% compatível com Web, Electron e Mobile) */}
      <Modal
        visible={!!fichaParaExcluir}
        transparent
        animationType="fade"
        onRequestClose={() => setFichaParaExcluir(null)}
      >
        <TouchableWithoutFeedback onPress={() => setFichaParaExcluir(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitulo}>Excluir Personagem?</Text>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.modalTexto}>
                    Tem certeza de que deseja excluir a ficha de{' '}
                    <Text style={styles.modalNomeDestaque}>
                      "{fichaParaExcluir?.nomePersonagem?.trim() || 'Sem Nome'}"
                    </Text>
                    ?
                  </Text>
                  <Text style={styles.modalAviso}>
                    ⚠️ Esta ação removerá a ficha deste aparelho e não poderá ser desfeita.
                  </Text>

                  <View style={styles.modalAcoesRow}>
                    <TouchableOpacity
                      style={styles.btnModalCancelar}
                      onPress={() => setFichaParaExcluir(null)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnModalCancelarText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnModalExcluir}
                      onPress={handleExecutarExclusao}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnModalExcluirText}>Sim, Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* Modal Sobre o Aplicativo & Isenção Legal */}
      <ModalSobre
        visivel={sobreVisivel}
        onFechar={() => setSobreVisivel(false)}
      />
    </View>
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
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  topBarDesktop: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  desktopMaxWidth: {
    maxWidth: 1300,
    alignSelf: 'center',
  },
  topBarLeft: {
    flexShrink: 0,
    marginRight: 6,
  },
  titleMobile: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  titleDesktop: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: 'bold',
    letterSpacing: 0.6,
  },
  subtitleMobile: {
    color: '#FFEAA7',
    fontSize: 10.5,
    marginTop: 1,
  },
  subtitleDesktop: {
    color: '#FFEAA7',
    fontSize: 12,
    marginTop: 2,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  actionsMobile: {
    gap: 5,
  },
  actionsDesktop: {
    gap: 10,
  },
  btnAction: {
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSobreAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  btnUserBadge: {
    backgroundColor: 'rgba(200, 157, 60, 0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  btnUserBadgeMobile: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    maxWidth: 120,
  },
  btnUserBadgeDesktop: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 220,
  },
  btnUserIcon: {
    fontSize: 12,
  },
  btnUserText: {
    fontSize: 12,
    color: '#FFEAA7',
    fontWeight: '700',
  },
  btnSobreActionText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  btnCompendioMobile: {
    backgroundColor: 'rgba(200,157,60,0.25)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  btnCompendioDesktop: {
    backgroundColor: 'rgba(200,157,60,0.25)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  btnJanelaSeparadaAction: {
    backgroundColor: 'rgba(200,157,60,0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  btnJanelaSeparadaActionText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnImportarMobile: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  btnImportarDesktop: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  btnNovaMobile: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  btnNovaDesktop: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  btnText: {
    fontWeight: 'bold',
  },
  btnTextCompendioMobile: {
    color: '#FFEAA7',
    fontSize: 11,
  },
  btnTextCompendioDesktop: {
    color: '#FFEAA7',
    fontSize: 13,
  },
  btnTextWhiteMobile: {
    color: COLORS.white,
    fontSize: 11,
  },
  btnTextWhiteDesktop: {
    color: COLORS.white,
    fontSize: 13,
  },
  btnTextDarkMobile: {
    color: '#1F1A17',
    fontSize: 11.5,
  },
  btnTextDarkDesktop: {
    color: '#1F1A17',
    fontSize: 13.5,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
  },
  emptyCardDesktop: {
    maxWidth: 500,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 20,
  },
  emptyActionsCol: {
    width: '100%',
    gap: 10,
  },
  btnCriarGrande: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCriarGrandeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnCompendioGrande: {
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCompendioGrandeText: {
    color: '#8A6414',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnImportarGrande: {
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnImportarGrandeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  listContent: {
    padding: 12,
    paddingBottom: 32,
  },
  listContentDesktop: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxWidth: 1300,
    alignSelf: 'center',
    width: '100%',
  },
  gridRow: {
    gap: 14,
  },
  fichaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  fichaCardGrid: {
    flex: 1,
    marginBottom: 14,
  },
  fichaCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  fichaTitleCol: {
    flex: 1,
    paddingRight: 8,
  },
  fichaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  fichaSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnExport: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnExportText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  btnDelete: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(179,38,30,0.1)',
  },
  btnDeleteText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceVariant,
    paddingTop: 10,
    gap: 6,
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  badgeValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  desktopOpenHint: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0E8D4',
    alignItems: 'flex-end',
  },
  desktopOpenHintText: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FAF6EE',
    borderRadius: 12,
    maxWidth: 440,
    width: '100%',
    borderWidth: 2,
    borderColor: '#C43030',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    backgroundColor: '#8B1E1E',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#6B1414',
  },
  modalTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  modalBody: {
    padding: 18,
  },
  modalTexto: {
    fontSize: 15,
    color: '#2C2416',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalNomeDestaque: {
    fontWeight: 'bold',
    color: '#8B1E1E',
  },
  modalAviso: {
    fontSize: 12,
    color: '#886B3E',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  modalAcoesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btnModalCancelar: {
    flex: 1,
    backgroundColor: '#EFE7D8',
    borderWidth: 1,
    borderColor: '#D4C4A8',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnModalCancelarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5C4A28',
  },
  btnModalExcluir: {
    flex: 1,
    backgroundColor: '#B3261E',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#8C1D18',
  },
  btnModalExcluirText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Abas principais (Meus Personagens vs Compartilhados)
  tabsBarWrap: {
    backgroundColor: COLORS.primaryDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  tabsBarWrapDesktop: {
    paddingHorizontal: 32,
  },
  tabsBarContent: {
    flexDirection: 'row',
    gap: 8,
  },
  mainTabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  mainTabBtnActive: {
    borderBottomColor: COLORS.gold,
  },
  mainTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  mainTabTextActive: {
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  // Estilos de ficha compartilhada e badges
  fichaCardShared: {
    borderColor: '#4A5568',
  },
  sharedBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  badgeReadOnly: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeReadOnlyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#93C5FD',
  },
  badgeOwner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    maxWidth: 220,
  },
  badgeOwnerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#78350F',
  },
  badgeCampanha: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#9333EA',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    maxWidth: 220,
  },
  badgeCampanhaText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6B21A8',
  },
  // Barra de filtro da aba compartilhados
  filterBarWrap: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterBarWrapDesktop: {
    paddingHorizontal: 32,
  },
  filterBarContent: {
    width: '100%',
  },
  filterInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 40,
  },
  filterIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  filterInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 0,
    height: '100%',
  },
  filterClearBtn: {
    padding: 4,
    marginLeft: 6,
  },
  filterClearBtnText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  btnLimparFiltro: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  btnLimparFiltroText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  btnVer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 6,
  },
  btnVerText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoBoxShared: {
    marginTop: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
  },
  infoBoxSharedText: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
    textAlign: 'center',
  },
  negrito: {
    fontWeight: 'bold',
    color: COLORS.gold,
  },
});

