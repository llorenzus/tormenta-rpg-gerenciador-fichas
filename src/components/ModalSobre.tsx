import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { checarAtualizacaoOnline, InfoAtualizacao, VERSAO_ATUAL } from '../utils/updateChecker';
import { ModalAtualizacao } from './ModalAtualizacao';

interface Props {
  visivel: boolean;
  onFechar: () => void;
}

export const ModalSobre: React.FC<Props> = ({ visivel, onFechar }) => {
  const [verificando, setVerificando] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);
  const [infoAtualizacao, setInfoAtualizacao] = useState<InfoAtualizacao | null>(null);
  const [modalAtualizacaoVisivel, setModalAtualizacaoVisivel] = useState(false);

  const handleVerificarAtualizacao = async () => {
    setVerificando(true);
    setMensagemStatus(null);
    try {
      const info = await checarAtualizacaoOnline(true);
      if (info && info.temAtualizacao) {
        setInfoAtualizacao(info);
        setModalAtualizacaoVisivel(true);
        setMensagemStatus(null);
      } else if (info && !info.temAtualizacao) {
        setMensagemStatus(`✅ O aplicativo já está na versão mais recente (v${VERSAO_ATUAL}).`);
      } else {
        setMensagemStatus('⚠️ Não foi possível verificar no momento. Verifique sua conexão com a internet.');
      }
    } catch {
      setMensagemStatus('⚠️ Erro ao consultar atualizações. Tente novamente mais tarde.');
    } finally {
      setVerificando(false);
    }
  };

  const handleFecharTudo = () => {
    setMensagemStatus(null);
    onFechar();
  };

  return (
    <>
      <Modal
        visible={visivel}
        transparent
        animationType="fade"
        onRequestClose={handleFecharTudo}
      >
        <TouchableWithoutFeedback onPress={handleFecharTudo}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <View style={styles.header}>
                  <Text style={styles.title}>ℹ️ Sobre o Aplicativo</Text>
                  <TouchableOpacity onPress={handleFecharTudo} style={styles.btnClose}>
                    <Text style={styles.btnCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.content}>
                  <Text style={styles.appTitle}>Tormenta RPG - Gerenciador de Fichas</Text>
                  <Text style={styles.versionText}>Versão {VERSAO_ATUAL} (Comunidade)</Text>

                  {/* Botão de Verificação Manual de Atualização */}
                  <View style={styles.updateSection}>
                    <TouchableOpacity
                      style={[styles.btnCheckUpdate, verificando && styles.btnCheckUpdateDisabled]}
                      onPress={handleVerificarAtualizacao}
                      disabled={verificando}
                      activeOpacity={0.8}
                    >
                      {verificando ? (
                        <View style={styles.loadingRow}>
                          <ActivityIndicator size="small" color={COLORS.primaryDark} />
                          <Text style={styles.btnCheckUpdateText}>Consultando atualizações...</Text>
                        </View>
                      ) : (
                        <Text style={styles.btnCheckUpdateText}>🔄 Verificar Novas Versões</Text>
                      )}
                    </TouchableOpacity>

                    {mensagemStatus && (
                      <View style={styles.statusMessageBox}>
                        <Text style={styles.statusMessageText}>{mensagemStatus}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.disclaimerBox}>
                    <Text style={styles.disclaimerTitle}>⚖️ Aviso Legal / Isenção de Vínculo</Text>
                    <Text style={styles.disclaimerText}>
                      Este é um projeto de código aberto desenvolvido por fãs, de forma independente e sem fins lucrativos. Não é um produto oficial da Jambô Editora e não possui qualquer vínculo com a mesma. Todos os direitos sobre o universo, termos e marcas de Tormenta pertencem à Jambô Editora e seus respectivos autores.
                    </Text>
                  </View>

                  <Text style={styles.creditsText}>
                    Desenvolvido e produzido por Lorenzo Rech Tochetto
                  </Text>
                  <Text style={styles.infoText}>
                    Criado para auxiliar jogadores e mestres na gestão prática de fichas e consulta rápida de regras durante sessões de RPG de mesa.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.btnEntendido}
                  onPress={handleFecharTudo}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnEntendidoText}>Entendido</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de Atualização acionado manualmente */}
      <ModalAtualizacao
        visivel={modalAtualizacaoVisivel}
        info={infoAtualizacao}
        onFechar={() => setModalAtualizacaoVisivel(false)}
      />
    </>
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
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
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
  content: {
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  updateSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  btnCheckUpdate: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  btnCheckUpdateDisabled: {
    opacity: 0.6,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnCheckUpdateText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  statusMessageBox: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusMessageText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  disclaimerBox: {
    backgroundColor: COLORS.surfaceVariant,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    borderRadius: 8,
    marginBottom: 14,
  },
  disclaimerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.text,
    textAlign: 'justify',
  },
  creditsText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },
  btnEntendido: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  btnEntendidoText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
