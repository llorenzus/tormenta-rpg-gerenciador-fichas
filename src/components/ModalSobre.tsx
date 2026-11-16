import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS } from '../theme/colors';

interface Props {
  visivel: boolean;
  onFechar: () => void;
}

export const ModalSobre: React.FC<Props> = ({ visivel, onFechar }) => {
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
              <View style={styles.header}>
                <Text style={styles.title}>ℹ️ Sobre o Aplicativo</Text>
                <TouchableOpacity onPress={onFechar} style={styles.btnClose}>
                  <Text style={styles.btnCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <Text style={styles.appTitle}>Tormenta RPG - Gerenciador de Fichas</Text>
                <Text style={styles.versionText}>Versão 1.1.0 (Comunidade)</Text>

                <View style={styles.disclaimerBox}>
                  <Text style={styles.disclaimerTitle}>⚖️ Aviso Legal / Isenção de Vínculo</Text>
                  <Text style={styles.disclaimerText}>
                    Este é um projeto de código aberto desenvolvido por fãs, de forma independente e sem fins lucrativos. Não é um produto oficial da Jambô Editora e não possui qualquer vínculo com a mesma. Todos os direitos sobre o universo, termos e marcas de Tormenta pertencem à Jambô Editora e seus respectivos autores.
                  </Text>
                </View>

                <Text style={styles.infoText}>
                  Desenvolvido para auxiliar jogadores e mestres na gestão prática de fichas e consulta rápida de regras durante sessões de RPG de mesa.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.btnEntendido}
                onPress={onFechar}
                activeOpacity={0.85}
              >
                <Text style={styles.btnEntendidoText}>Entendido</Text>
              </TouchableOpacity>
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
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gold,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  disclaimerBox: {
    backgroundColor: 'rgba(200, 157, 60, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    padding: 12,
    borderRadius: 6,
    marginBottom: 14,
  },
  disclaimerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.text,
    textAlign: 'justify',
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
