import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ClasseData,
  converterManobraParaItem,
  PosturaData,
  GolpeMarcialData,
} from '../data';
import {
  aplicarClasseNaFicha,
  FichaPersonagem,
  gerarId,
  HabilidadeOuTalento,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoTexto } from './CommonInput';
import { AbaCompendio, CompendioModal } from './CompendioModal';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaHabilidadesClasse: React.FC<Props> = ({ ficha, onChange }) => {
  // Controle do Compêndio Modal
  const [compendioVisivel, setCompendioVisivel] = useState(false);
  const [compendioAba, setCompendioAba] = useState<AbaCompendio>('classes');

  const abrirCompendioClasses = () => {
    setCompendioAba('classes');
    setCompendioVisivel(true);
  };

  const abrirCompendioManobras = () => {
    setCompendioAba('manobras');
    setCompendioVisivel(true);
  };

  // Funções de manipulação de itens de habilidades de classe
  const adicionarHabilidade = () => {
    const novo: HabilidadeOuTalento = {
      id: gerarId(),
      nome: '',
      descricao: '',
    };
    onChange({
      ...ficha,
      habilidadesClasse: [...ficha.habilidadesClasse, novo],
    });
  };

  const atualizarHabilidade = (editado: HabilidadeOuTalento) => {
    onChange({
      ...ficha,
      habilidadesClasse: ficha.habilidadesClasse.map((item) =>
        item.id === editado.id ? editado : item
      ),
    });
  };

  const removerHabilidade = (id: string) => {
    onChange({
      ...ficha,
      habilidadesClasse: ficha.habilidadesClasse.filter((item) => item.id !== id),
    });
  };

  const handleAplicarClasseCompendio = (classe: ClasseData) => {
    onChange(aplicarClasseNaFicha(ficha, classe));
  };

  const handleAdicionarManobraCompendio = (
    manobra: PosturaData | GolpeMarcialData
  ) => {
    const nova = converterManobraParaItem(manobra);
    onChange({
      ...ficha,
      habilidadesClasse: [...ficha.habilidadesClasse, nova],
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* BARRA DE RECURSOS: PONTOS DE ENERGIA (PE) E PONTOS DE AÇÃO (PA) */}
      <View style={styles.cardRecursos}>
        <View style={styles.recursoItem}>
          <Text style={styles.recursoLabel}>Pontos de Energia (PE)</Text>
          <View style={styles.recursoRow}>
            <Text style={styles.recursoVal}>{ficha.peAtual ?? 0} / {ficha.peTotal ?? 0}</Text>
            <TouchableOpacity
              style={styles.btnRecursoDelta}
              onPress={() => onChange({ ...ficha, peAtual: Math.max(0, (ficha.peAtual ?? 0) - 1) })}
            >
              <Text style={styles.btnRecursoDeltaText}>-1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnRecursoDelta}
              onPress={() => onChange({ ...ficha, peAtual: (ficha.peAtual ?? 0) + 1 })}
            >
              <Text style={styles.btnRecursoDeltaText}>+1</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recursoDivider} />

        <View style={styles.recursoItem}>
          <Text style={styles.recursoLabel}>Pontos de Ação (PA)</Text>
          <View style={styles.recursoRow}>
            <Text style={[styles.recursoVal, { color: COLORS.primary }]}>{ficha.pontosAcao ?? 1} PA</Text>
            <TouchableOpacity
              style={styles.btnRecursoDelta}
              onPress={() => onChange({ ...ficha, pontosAcao: Math.max(0, (ficha.pontosAcao ?? 1) - 1) })}
            >
              <Text style={styles.btnRecursoDeltaText}>-1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnRecursoDelta}
              onPress={() => onChange({ ...ficha, pontosAcao: (ficha.pontosAcao ?? 1) + 1 })}
            >
              <Text style={styles.btnRecursoDeltaText}>+1</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 1. HABILIDADES DE CLASSE & MANOBRAS */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithAction}>
          <View style={styles.cardHeaderTitleCol}>
            <Text style={styles.cardHeaderTitle}>Habilidades de Classe & Manobras</Text>
            <Text style={styles.cardHeaderSubtitle}>
              {ficha.classe ? `${ficha.classe} • ` : ''}Poderes de classe, posturas e golpes marciais
            </Text>
          </View>
          <View style={styles.headerButtonsRow}>
            <TouchableOpacity
              style={styles.btnCompendio}
              onPress={abrirCompendioClasses}
            >
              <Text style={styles.btnCompendioText}>📖 Classes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnCompendio, { backgroundColor: '#1B609E' }]}
              onPress={abrirCompendioManobras}
            >
              <Text style={[styles.btnCompendioText, { color: '#FFFFFF' }]}>⚔️ Manobras</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAdicionarHeader}
              onPress={adicionarHabilidade}
            >
              <Text style={styles.btnAdicionarHeaderText}>+ Manual</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBody}>
          {ficha.habilidadesClasse.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                Nenhuma habilidade de classe ou manobra cadastrada. Toque em "📖 Classes" ou "⚔️ Manobras" para buscar no compêndio.
              </Text>
            </View>
          ) : (
            ficha.habilidadesClasse.map((item) => (
              <View key={item.id} style={styles.itemSubCard}>
                <View style={styles.rowTop}>
                  <CampoTexto
                    label="Nome da Habilidade ou Manobra"
                    value={item.nome}
                    onChangeText={(v) =>
                      atualizarHabilidade({ ...item, nome: v })
                    }
                    style={styles.colFlex}
                  />
                  <TouchableOpacity
                    style={styles.btnRemove}
                    onPress={() => removerHabilidade(item.id)}
                  >
                    <Text style={styles.btnRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <CampoTexto
                  label="Descrição / Efeito Mecânico"
                  value={item.descricao}
                  onChangeText={(v) =>
                    atualizarHabilidade({ ...item, descricao: v })
                  }
                  multiline
                />
              </View>
            ))
          )}
        </View>
      </View>

      {/* Modal do Compêndio */}
      <CompendioModal
        visivel={compendioVisivel}
        onFechar={() => setCompendioVisivel(false)}
        abaInicial={compendioAba}
        fichaAtual={ficha}
        onAplicarClasseAFicha={handleAplicarClasseCompendio}
        onAdicionarManobraAFicha={handleAdicionarManobraCompendio}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 12,
    paddingBottom: 36,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardRecursos: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
  },
  recursoItem: {
    alignItems: 'center',
    minWidth: 140,
  },
  recursoLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  recursoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recursoVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B609E',
    marginRight: 4,
  },
  btnRecursoDelta: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnRecursoDeltaText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  recursoDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  cardHeaderWithAction: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surfaceVariant,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexWrap: 'wrap',
    gap: 8,
  },
  cardHeaderTitleCol: {
    flex: 1,
    minWidth: 180,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardHeaderSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  btnCompendio: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnCompendioText: {
    color: '#3B2900',
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnAdicionarHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnAdicionarHeaderText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardBody: {
    padding: 12,
  },
  emptyWrap: {
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  itemSubCard: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  colFlex: {
    flex: 1,
  },
  btnRemove: {
    marginTop: 24,
    width: 34,
    height: 38,
    borderRadius: 6,
    backgroundColor: 'rgba(179,38,30,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRemoveText: {
    color: COLORS.danger,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

