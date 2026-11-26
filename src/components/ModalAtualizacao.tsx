import React from 'react';
import {
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { InfoAtualizacao } from '../utils/updateChecker';

interface Props {
  visivel: boolean;
  info: InfoAtualizacao | null;
  onFechar: () => void;
}

export const ModalAtualizacao: React.FC<Props> = ({ visivel, info, onFechar }) => {
  if (!info) return null;

  const handleBaixar = async () => {
    try {
      if (info.urlDownload) {
        await Linking.openURL(info.urlDownload);
      } else if (info.urlRelease) {
        await Linking.openURL(info.urlRelease);
      }
    } catch (e) {
      if (info.urlRelease) {
        Linking.openURL(info.urlRelease).catch(() => {});
      }
    }
  };

  const handleVerNoGithub = () => {
    if (info.urlRelease) {
      Linking.openURL(info.urlRelease).catch(() => {});
    }
  };

  const isAndroid = Platform.OS === 'android';
  const isWindows =
    Platform.OS === 'windows' ||
    (Platform.OS === 'web' && typeof navigator !== 'undefined' && /win/i.test(navigator.userAgent));

  const dicaPlataforma = isAndroid
    ? 'O arquivo de instalação Android (.apk) será baixado pelo seu navegador.'
    : isWindows
    ? 'O instalador Windows Desktop (.exe) será baixado pelo seu navegador.'
    : 'Você será direcionado para a página oficial de download.';

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
    >
      <TouchableWithoutFeedback onPress={onFechar}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Cabeçalho */}
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Text style={styles.headerIcon}>🚀</Text>
                  <Text style={styles.title}>Nova Versão Disponível!</Text>
                </View>
                <TouchableOpacity onPress={onFechar} style={styles.btnClose}>
                  <Text style={styles.btnCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Badges de Versão */}
              <View style={styles.versionBadgesRow}>
                <View style={styles.badgeAtual}>
                  <Text style={styles.badgeLabel}>Versão Atual</Text>
                  <Text style={styles.badgeValue}>v{info.versaoAtual}</Text>
                </View>
                <Text style={styles.arrowBetween}>➔</Text>
                <View style={styles.badgeNova}>
                  <Text style={styles.badgeLabelNova}>Nova Versão</Text>
                  <Text style={styles.badgeValueNova}>v{info.versaoNova}</Text>
                </View>
              </View>

              {/* Título da Release */}
              <Text style={styles.releaseName}>{info.nomeRelease}</Text>

              {/* Notas da Versão */}
              <View style={styles.notesContainer}>
                <Text style={styles.notesTitle}>Novidades & Alterações:</Text>
                <ScrollView style={styles.notesScrollView} nestedScrollEnabled>
                  <Text style={styles.notesText}>{info.notasVersao.trim()}</Text>
                </ScrollView>
              </View>

              {/* Dica da plataforma */}
              <Text style={styles.dicaText}>💡 {dicaPlataforma}</Text>

              {/* Botões de Ação */}
              <View style={styles.actionsBlock}>
                <TouchableOpacity
                  style={styles.btnBaixar}
                  onPress={handleBaixar}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnBaixarText}>⬇️ Baixar Atualização</Text>
                </TouchableOpacity>

                <View style={styles.secondaryButtonsRow}>
                  <TouchableOpacity
                    style={styles.btnGithub}
                    onPress={handleVerNoGithub}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnGithubText}>Ver no GitHub</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnMaisTarde}
                    onPress={onFechar}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnMaisTardeText}>Mais Tarde</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.gold,
    padding: 22,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  btnClose: {
    padding: 6,
  },
  btnCloseText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  versionBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 14,
  },
  badgeAtual: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  badgeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  arrowBetween: {
    fontSize: 18,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  badgeNova: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  badgeLabelNova: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  badgeValueNova: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  releaseName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  notesContainer: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
    maxHeight: 180,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  notesScrollView: {
    maxHeight: 130,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  },
  dicaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionsBlock: {
    gap: 10,
  },
  btnBaixar: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
    elevation: 2,
  },
  btnBaixarText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  btnGithub: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnGithubText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '600',
  },
  btnMaisTarde: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnMaisTardeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});
