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
  converterArmaParaItem,
  converterArmaduraParaItem,
  converterItemGeralParaItem,
  converterMagiaParaItem,
  converterTalentoParaItem,
  converterManobraParaItem,
  EquipamentoData,
  MagiaData,
  RacaData,
  TalentoData,
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

export const AbaHabilidadesRaca: React.FC<Props> = ({ ficha, onChange }) => {
  const [compendioVisivel, setCompendioVisivel] = useState(false);

  const adicionarHabilidadeRaca = () => {
    const nova: HabilidadeOuTalento = {
      id: gerarId(),
      nome: '',
      descricao: '',
    };
    onChange({ ...ficha, habilidadesRaca: [...ficha.habilidadesRaca, nova] });
  };

  const atualizarHabilidadeRaca = (editada: HabilidadeOuTalento) => {
    onChange({
      ...ficha,
      habilidadesRaca: ficha.habilidadesRaca.map((item) =>
        item.id === editada.id ? editada : item
      ),
    });
  };

  const removerHabilidadeRaca = (id: string) => {
    onChange({
      ...ficha,
      habilidadesRaca: ficha.habilidadesRaca.filter((item) => item.id !== id),
    });
  };

  const handleAplicarRacaCompendio = (raca: RacaData) => {
    const novosTracos: HabilidadeOuTalento[] = raca.tracosRaciais.map((t) => ({
      id: gerarId(),
      nome: `${t.nome} (${raca.nome})`,
      descricao: t.descricao,
    }));
    onChange({
      ...ficha,
      raca: raca.nome,
      tamanho: raca.tamanho,
      deslocamento: `${raca.deslocamento}m`,
      habilidadesRaca: [...ficha.habilidadesRaca, ...novosTracos],
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.cardHeaderWithAction}>
          <View style={styles.cardHeaderTitleCol}>
            <Text style={styles.cardHeaderTitle}>Habilidades de Raça</Text>
            <Text style={styles.cardHeaderSubtitle}>
              {ficha.raca ? `Raça: ${ficha.raca} • ` : ''}Traços e poderes raciais
            </Text>
          </View>
          <View style={styles.headerButtonsRow}>
            <TouchableOpacity
              style={styles.btnCompendio}
              onPress={() => setCompendioVisivel(true)}
            >
              <Text style={styles.btnCompendioText}>📖 Raças</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAdicionarHeader}
              onPress={adicionarHabilidadeRaca}
            >
              <Text style={styles.btnAdicionarHeaderText}>+ Manual</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBody}>
          {ficha.habilidadesRaca.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                Nenhum traço racial cadastrado. Toque em "📖 Raças" para consultar e aplicar da enciclopédia ou "+ Manual" para criar.
              </Text>
            </View>
          ) : (
            ficha.habilidadesRaca.map((item) => (
              <View key={item.id} style={styles.itemSubCard}>
                <View style={styles.rowTop}>
                  <CampoTexto
                    label="Nome da Habilidade Racial"
                    value={item.nome}
                    onChangeText={(v) =>
                      atualizarHabilidadeRaca({ ...item, nome: v })
                    }
                    style={styles.colFlex}
                  />
                  <TouchableOpacity
                    style={styles.btnRemove}
                    onPress={() => removerHabilidadeRaca(item.id)}
                  >
                    <Text style={styles.btnRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <CampoTexto
                  label="Descrição / Traço Racial"
                  value={item.descricao}
                  onChangeText={(v) =>
                    atualizarHabilidadeRaca({ ...item, descricao: v })
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
        abaInicial="racas"
        fichaAtual={ficha}
        onAplicarRacaAFicha={handleAplicarRacaCompendio}
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
