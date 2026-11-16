import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ModalSobre } from '../components/ModalSobre';
import { COLORS } from '../theme/colors';

interface Props {
  onIniciar: () => void;
}

export const TelaInicialScreen: React.FC<Props> = ({ onIniciar }) => {
  const [sobreVisivel, setSobreVisivel] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>TORMENTA RPG</Text>
        <Text style={styles.subtitle}>Gerenciador de Fichas de Personagem</Text>
        <View style={styles.authorBadge}>
          <Text style={styles.authorText}>Desenvolvido e produzido por Lucas Lorenzi (llorenzus)</Text>
        </View>
      </View>

      <View style={styles.centerArea}>
        <TouchableOpacity
          style={styles.botaoCircular}
          onPress={onIniciar}
          activeOpacity={0.85}
        >
          <View style={styles.botaoCircularInner}>
            <Text style={styles.botaoTexto}>Iniciar</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footerWrap}>
        <Text style={styles.footerText}>Toque em Iniciar para acessar suas fichas</Text>
        <TouchableOpacity
          style={styles.btnSobre}
          onPress={() => setSobreVisivel(true)}
          activeOpacity={0.7}
          accessibilityLabel="Informações e Aviso Legal"
        >
          <Text style={styles.btnSobreText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  headerBlock: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  authorBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  authorText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '600',
    textAlign: 'center',
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoCircular: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: COLORS.primary,
    borderWidth: 5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  botaoCircularInner: {
    width: 146,
    height: 146,
    borderRadius: 73,
    borderWidth: 1.5,
    borderColor: 'rgba(200, 157, 60, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerWrap: {
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  btnSobre: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  btnSobreText: {
    fontSize: 18,
  },
});
