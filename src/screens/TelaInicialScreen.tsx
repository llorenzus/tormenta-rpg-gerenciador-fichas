import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { User } from 'firebase/auth';
import { ModalSobre } from '../components/ModalSobre';
import { COLORS } from '../theme/colors';

interface Props {
  onIniciar: () => void;
  usuarioAtual?: User | null;
  onAbrirConta?: () => void;
}

export const TelaInicialScreen: React.FC<Props> = ({
  onIniciar,
  usuarioAtual,
  onAbrirConta,
}) => {
  const [sobreVisivel, setSobreVisivel] = useState(false);
  const { height } = useWindowDimensions();
  const isCompactScreen = height < 680;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isCompactScreen && styles.scrollContainerCompact,
        ]}
        bounces={false}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>TORMENTA RPG</Text>
          <Text style={styles.subtitle}>Gerenciador de Fichas de Personagem</Text>
          <View style={styles.authorBadge}>
            <Text style={styles.authorText}>Desenvolvido e produzido por Lorenzo Rech Tochetto</Text>
          </View>
        </View>

        <View style={styles.centerArea}>
          <TouchableOpacity
            style={[styles.botaoCircular, isCompactScreen && styles.botaoCircularCompact]}
            onPress={onIniciar}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Iniciar Gerenciador de Fichas"
          >
            <View style={[styles.botaoCircularInner, isCompactScreen && styles.botaoCircularInnerCompact]}>
              <Text style={styles.botaoTexto}>Iniciar</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footerWrap}>
          <Text style={styles.footerText}>
            {usuarioAtual
              ? `Conectado como ${usuarioAtual.displayName || usuarioAtual.email?.split('@')[0]}`
              : 'Toque em Iniciar para acessar suas fichas'}
          </Text>

          <TouchableOpacity
            style={styles.btnSobre}
            onPress={() => setSobreVisivel(true)}
            activeOpacity={0.7}
            accessibilityLabel="Informações e Aviso Legal"
          >
            <Text style={styles.btnSobreText}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ModalSobre
        visivel={sobreVisivel}
        onFechar={() => setSobreVisivel(false)}
        onAbrirConta={onAbrirConta}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'web' ? 56 : 36,
    paddingHorizontal: 24,
  },
  scrollContainerCompact: {
    paddingVertical: 20,
  },
  headerBlock: {
    alignItems: 'center',
    marginTop: 8,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
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
  botaoCircularCompact: {
    width: 144,
    height: 144,
    borderRadius: 72,
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
  botaoCircularInnerCompact: {
    width: 124,
    height: 124,
    borderRadius: 62,
  },
  botaoTexto: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerWrap: {
    alignItems: 'center',
    gap: 12,
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
