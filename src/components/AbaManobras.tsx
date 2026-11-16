import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  converterManobraParaItem,
  formatarDescricaoManobra,
  GolpeMarcialData,
  PosturaData,
} from '../data';
import {
  FichaPersonagem,
  gerarId,
  HabilidadeOuTalento,
  obterManobrasFicha,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { BarraDeProgressoRecurso } from './BarraDeProgressoRecurso';
import { CampoComSugestoes, ItemSugestaoCompendio } from './CampoComSugestoes';
import { CampoTexto } from './CommonInput';
import { CompendioModal } from './CompendioModal';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaManobras: React.FC<Props> = ({ ficha, onChange }) => {
  const [compendioVisivel, setCompendioVisivel] = useState(false);

  const manobrasLista = obterManobrasFicha(ficha);

  const abrirCompendioManobras = () => {
    setCompendioVisivel(true);
  };

  const adicionarManobraManual = () => {
    const novo: HabilidadeOuTalento = {
      id: gerarId(),
      nome: '',
      descricao: '',
    };
    onChange({
      ...ficha,
      manobras: [...manobrasLista, novo],
    });
  };

  const atualizarManobra = (editado: HabilidadeOuTalento) => {
    onChange({
      ...ficha,
      manobras: manobrasLista.map((item) =>
        item.id === editado.id ? editado : item
      ),
    });
  };

  const removerManobra = (id: string) => {
    onChange({
      ...ficha,
      manobras: manobrasLista.filter((item) => item.id !== id),
    });
  };

  const handleAdicionarManobraCompendio = (
    manobra: PosturaData | GolpeMarcialData
  ) => {
    const nova = converterManobraParaItem(manobra);
    onChange({
      ...ficha,
      manobras: [...manobrasLista, nova],
    });
  };

  const handlePreencherManobraExistente = (
    itemAntigo: HabilidadeOuTalento,
    itemCompendio: ItemSugestaoCompendio
  ) => {
    const manobra = itemCompendio as PosturaData | GolpeMarcialData;
    const atualizado: HabilidadeOuTalento = {
      ...itemAntigo,
      nome: `${manobra.nome} [${manobra.tipo}]`,
      descricao: formatarDescricaoManobra(manobra),
    };
    atualizarManobra(atualizado);
  };

  const alterarPeAtual = (delta: number) => {
    const novo = Math.max(0, (ficha.peAtual ?? 0) + delta);
    onChange({ ...ficha, peAtual: novo });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. PAINEL DE CONTROLE DE PONTOS DE ENERGIA (PE) - Amarelo */}
      <View style={styles.cardPe}>
        <View style={styles.peInfoCol}>
          <Text style={styles.peLabel}>⚡ Pontos de Energia (PE)</Text>
          <Text style={styles.peSub}>Utilizados para executar golpes marciais e posturas</Text>
          <View style={styles.peValoresRow}>
            <Text style={styles.peAtualText}>{ficha.peAtual ?? 0}</Text>
            <Text style={styles.peDivisorText}>/</Text>
            <Text style={styles.peTotalText}>{ficha.peTotal ?? 0}</Text>
            <Text style={styles.peUnidadeText}>PE</Text>
          </View>
        </View>

        <View style={styles.peControlesRow}>
          <TouchableOpacity
            style={[styles.btnPe, styles.btnPeSub]}
            onPress={() => alterarPeAtual(-1)}
            activeOpacity={0.7}
          >
            <Text style={styles.btnPeText}>-1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnPe, styles.btnPeSub]}
            onPress={() => alterarPeAtual(-2)}
            activeOpacity={0.7}
          >
            <Text style={styles.btnPeText}>-2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnPe, styles.btnPeAdd]}
            onPress={() => alterarPeAtual(+1)}
            activeOpacity={0.7}
          >
            <Text style={styles.btnPeText}>+1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnPe, styles.btnPeAdd]}
            onPress={() => alterarPeAtual(+2)}
            activeOpacity={0.7}
          >
            <Text style={styles.btnPeText}>+2</Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%', marginTop: 8 }}>
          <BarraDeProgressoRecurso
            atual={ficha.peAtual ?? 0}
            max={ficha.peTotal ?? 0}
            cor="#E69500"
            corFundo="rgba(230,149,0,0.15)"
            unidade="PE"
          />
        </View>
      </View>

      {/* 2. CARD DE POSTURAS E GOLPES MARCIAIS */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithAction}>
          <View style={styles.cardHeaderTitleCol}>
            <View style={styles.tituloRow}>
              <Text style={styles.cardHeaderTitle}>Manobras de Combate & Posturas</Text>
              <View style={styles.badgeQtd}>
                <Text style={styles.badgeQtdText}>
                  {manobrasLista.length} {manobrasLista.length === 1 ? 'manobra' : 'manobras'}
                </Text>
              </View>
            </View>
            <Text style={styles.cardHeaderSubtitle}>
              Manual do Guerreiro • Golpes Marciais, Posturas de Luta e Efeitos Especiais
            </Text>
          </View>

          <View style={styles.headerButtonsRow}>
            <TouchableOpacity
              style={styles.btnCompendio}
              onPress={abrirCompendioManobras}
              activeOpacity={0.8}
            >
              <Text style={styles.btnCompendioText}>⚔️ Compêndio de Manobras</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAdicionarHeader}
              onPress={adicionarManobraManual}
              activeOpacity={0.8}
            >
              <Text style={styles.btnAdicionarHeaderText}>+ Manual</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBody}>
          {manobrasLista.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>⚔️</Text>
              <Text style={styles.emptyTitle}>Nenhuma postura ou golpe cadastrado</Text>
              <Text style={styles.emptyText}>
                Guerreiros, Samurais e outros combatentes podem utilizar o "⚔️ Compêndio de Manobras" para adicionar Posturas e Golpes Marciais oficiais, ou usar "+ Manual" para criar técnicas personalizadas.
              </Text>
            </View>
          ) : (
            manobrasLista.map((item) => (
              <View key={item.id} style={styles.itemSubCard}>
                <View style={styles.rowTop}>
                  <View style={styles.colFlex}>
                    <CampoComSugestoes
                      label="Nome da Manobra / Postura"
                      value={item.nome}
                      onChangeText={(v) =>
                        atualizarManobra({ ...item, nome: v })
                      }
                      tipo="manobra"
                      placeholder="Ex: Golpe Poderoso, Postura do Grou, Pirueta..."
                      onSelecionarSugestao={(m) =>
                        handlePreencherManobraExistente(item, m)
                      }
                      onAbrirCompendio={abrirCompendioManobras}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.btnRemove}
                    onPress={() => removerManobra(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.btnRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <CampoTexto
                  label="Custo em PE / Efeito Mecânico / Descrição"
                  value={item.descricao}
                  onChangeText={(v) =>
                    atualizarManobra({ ...item, descricao: v })
                  }
                  multiline
                  minHeight={90}
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
        abaInicial="manobras"
        fichaAtual={ficha}
        onAtualizarFichaAtual={onChange}
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
    paddingBottom: 40,
  },
  cardPe: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E69500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  peInfoCol: {
    flex: 1,
    minWidth: 160,
  },
  peLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D87A00',
  },
  peSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  peValoresRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
    gap: 4,
  },
  peAtualText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D87A00',
  },
  peDivisorText: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  peTotalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  peUnidadeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  peControlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnPe: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 42,
  },
  btnPeSub: {
    backgroundColor: 'rgba(211,47,47,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(211,47,47,0.3)',
  },
  btnPeAdd: {
    backgroundColor: 'rgba(46,125,50,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(46,125,50,0.3)',
  },
  btnPeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
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
    backgroundColor: 'rgba(25,118,210,0.14)',
    borderColor: '#1976D2',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeQtdText: {
    color: '#1565C0',
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
    backgroundColor: '#1B609E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnCompendioText: {
    color: '#FFFFFF',
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

