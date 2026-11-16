import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FichaPersonagem } from '../models/ficha';
import { COLORS } from '../theme/colors';
import { AbaHabilidadesRaca } from './AbaHabilidadesRaca';
import { AbaHabilidadesClasse } from './AbaHabilidadesClasse';
import { AbaMagias } from './AbaMagias';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export type SubAbaHabilidades = 'raca' | 'classe' | 'magias';

export const AbaHabilidadesEMagias: React.FC<Props> = ({ ficha, onChange }) => {
  const [subAba, setSubAba] = useState<SubAbaHabilidades>('classe');

  return (
    <View style={styles.container}>
      {/* Barra de Seleção de Sub-Aba */}
      <View style={styles.subTabsRow}>
        <TouchableOpacity
          style={[styles.subTabBtn, subAba === 'raca' && styles.subTabBtnAtivo]}
          onPress={() => setSubAba('raca')}
        >
          <Text
            style={[
              styles.subTabBtnText,
              subAba === 'raca' && styles.subTabBtnTextAtivo,
            ]}
          >
            Raça ({ficha.habilidadesRaca.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabBtn, subAba === 'classe' && styles.subTabBtnAtivo]}
          onPress={() => setSubAba('classe')}
        >
          <Text
            style={[
              styles.subTabBtnText,
              subAba === 'classe' && styles.subTabBtnTextAtivo,
            ]}
          >
            Classe & Talentos ({ficha.habilidadesClasse.length + ficha.talentos.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabBtn, subAba === 'magias' && styles.subTabBtnAtivo]}
          onPress={() => setSubAba('magias')}
        >
          <Text
            style={[
              styles.subTabBtnText,
              subAba === 'magias' && styles.subTabBtnTextAtivo,
            ]}
          >
            Magias ({ficha.magias.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo da Sub-Aba Selecionada */}
      <View style={styles.contentWrap}>
        {subAba === 'raca' && (
          <AbaHabilidadesRaca ficha={ficha} onChange={onChange} />
        )}
        {subAba === 'classe' && (
          <AbaHabilidadesClasse ficha={ficha} onChange={onChange} />
        )}
        {subAba === 'magias' && (
          <AbaMagias ficha={ficha} onChange={onChange} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  subTabsRow: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: COLORS.surfaceVariant,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
    justifyContent: 'center',
  },
  subTabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subTabBtnAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  subTabBtnText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  subTabBtnTextAtivo: {
    color: COLORS.white,
  },
  contentWrap: {
    flex: 1,
  },
});
