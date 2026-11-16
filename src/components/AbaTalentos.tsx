import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  converterTalentoParaItem,
  formatarDescricaoTalento,
  TalentoData,
} from '../data';
import {
  FichaPersonagem,
  gerarId,
  HabilidadeOuTalento,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoComSugestoes } from './CampoComSugestoes';
import { CampoTexto } from './CommonInput';
import { CompendioModal } from './CompendioModal';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaTalentos: React.FC<Props> = ({ ficha, onChange }) => {
  const [compendioVisivel, setCompendioVisivel] = useState(false);

  const abrirCompendioTalentos = () => {
    setCompendioVisivel(true);
  };

  const adicionarTalentoManual = () => {
    const novo: HabilidadeOuTalento = {
      id: gerarId(),
      nome: '',
      descricao: '',
    };
    onChange({
      ...ficha,
      talentos: [...ficha.talentos, novo],
    });
  };

  const atualizarTalento = (editado: HabilidadeOuTalento) => {
    onChange({
      ...ficha,
      talentos: ficha.talentos.map((item) =>
        item.id === editado.id ? editado : item
      ),
    });
  };

  const removerTalento = (id: string) => {
    onChange({
      ...ficha,
      talentos: ficha.talentos.filter((item) => item.id !== id),
    });
  };

  const handleAdicionarTalentoCompendio = (talento: TalentoData) => {
    const novo = converterTalentoParaItem(talento);
    onChange({
      ...ficha,
      talentos: [...ficha.talentos, novo],
    });
  };

  const handlePreencherTalentoExistente = (
    itemAntigo: HabilidadeOuTalento,
    talento: TalentoData
  ) => {
    const atualizado: HabilidadeOuTalento = {
      ...itemAntigo,
      nome: talento.nome,
      descricao: formatarDescricaoTalento(talento),
    };
    atualizarTalento(atualizado);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* CARD PRINCIPAL DE TALENTOS */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithAction}>
          <View style={styles.cardHeaderTitleCol}>
            <View style={styles.tituloRow}>
              <Text style={styles.cardHeaderTitle}>Talentos</Text>
              <View style={styles.badgeQtd}>
                <Text style={styles.badgeQtdText}>
                  {ficha.talentos.length} {ficha.talentos.length === 1 ? 'talento' : 'talentos'}
                </Text>
              </View>
            </View>
            <Text style={styles.cardHeaderSubtitle}>
              Combate, Destino, Magia, Perícia, Concedidos, Regionais e Tormenta
            </Text>
          </View>
          <View style={styles.headerButtonsRow}>
            <TouchableOpacity
              style={styles.btnCompendio}
              onPress={abrirCompendioTalentos}
              activeOpacity={0.8}
            >
              <Text style={styles.btnCompendioText}>📖 Compêndio de Talentos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAdicionarHeader}
              onPress={adicionarTalentoManual}
              activeOpacity={0.8}
            >
              <Text style={styles.btnAdicionarHeaderText}>+ Manual</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBody}>
          {ficha.talentos.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>⭐</Text>
              <Text style={styles.emptyTitle}>Nenhum talento registrado</Text>
              <Text style={styles.emptyText}>
                Toque em "📖 Compêndio de Talentos" para explorar todos os talentos de Tormenta RPG ou use "+ Manual" para criar um customizado.
              </Text>
            </View>
          ) : (
            ficha.talentos.map((item) => (
              <View key={item.id} style={styles.itemSubCard}>
                <View style={styles.rowTop}>
                  <View style={styles.colFlex}>
                    <CampoComSugestoes
                      label="Nome do Talento"
                      value={item.nome}
                      onChangeText={(v) =>
                        atualizarTalento({ ...item, nome: v })
                      }
                      tipo="talento"
                      placeholder="Ex: Ataque Poderoso, Foco em Arma..."
                      onSelecionarSugestao={(t) =>
                        handlePreencherTalentoExistente(item, t as TalentoData)
                      }
                      onAbrirCompendio={abrirCompendioTalentos}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.btnRemove}
                    onPress={() => removerTalento(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <CampoTexto
                  label="Descrição / Pré-requisitos / Benefício"
                  value={item.descricao}
                  onChangeText={(v) =>
                    atualizarTalento({ ...item, descricao: v })
                  }
                  multiline
                  minHeight={96}
                  numberOfLines={4}
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
        abaInicial="talentos"
        fichaAtual={ficha}
        onAtualizarFichaAtual={onChange}
        onAdicionarTalentoAFicha={handleAdicionarTalentoCompendio}
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
    paddingBottom: 40,
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
  tituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  badgeQtd: {
    backgroundColor: 'rgba(200,157,60,0.18)',
    borderColor: COLORS.gold,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeQtdText: {
    color: '#8A6414',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardHeaderSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 420,
  },
  itemSubCard: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

