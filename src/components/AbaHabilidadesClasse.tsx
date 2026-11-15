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
  formatarDescricaoTalento,
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
import { CampoComSugestoes } from './CampoComSugestoes';
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

  const abrirCompendioTalentos = () => {
    setCompendioAba('talentos');
    setCompendioVisivel(true);
  };

  // Funções de manipulação de itens da ficha
  const adicionarItem = (campo: 'habilidadesClasse' | 'talentos') => {
    const novo: HabilidadeOuTalento = {
      id: gerarId(),
      nome: '',
      descricao: '',
    };
    onChange({ ...ficha, [campo]: [...ficha[campo], novo] });
  };

  const atualizarItem = (
    campo: 'habilidadesClasse' | 'talentos',
    editado: HabilidadeOuTalento
  ) => {
    onChange({
      ...ficha,
      [campo]: ficha[campo].map((item) =>
        item.id === editado.id ? editado : item
      ),
    });
  };

  const removerItem = (
    campo: 'habilidadesClasse' | 'talentos',
    id: string
  ) => {
    onChange({
      ...ficha,
      [campo]: ficha[campo].filter((item) => item.id !== id),
    });
  };

  // Callbacks ao adicionar do Compêndio
  const handleAdicionarTalentoCompendio = (talento: TalentoData) => {
    const novo = converterTalentoParaItem(talento);
    onChange({
      ...ficha,
      talentos: [...ficha.talentos, novo],
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

  const handlePreencherTalentoExistente = (
    itemAntigo: HabilidadeOuTalento,
    talento: TalentoData
  ) => {
    const atualizado: HabilidadeOuTalento = {
      ...itemAntigo,
      nome: talento.nome,
      descricao: formatarDescricaoTalento(talento),
    };
    atualizarItem('talentos', atualizado);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
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
              onPress={() => adicionarItem('habilidadesClasse')}
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
                      atualizarItem('habilidadesClasse', { ...item, nome: v })
                    }
                    style={styles.colFlex}
                  />
                  <TouchableOpacity
                    style={styles.btnRemove}
                    onPress={() => removerItem('habilidadesClasse', item.id)}
                  >
                    <Text style={styles.btnRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <CampoTexto
                  label="Descrição / Efeito Mecânico"
                  value={item.descricao}
                  onChangeText={(v) =>
                    atualizarItem('habilidadesClasse', { ...item, descricao: v })
                  }
                  multiline
                />
              </View>
            ))
          )}
        </View>
      </View>

      {/* 2. TALENTOS COM AUTOCOMPLETE E COMPÊNDIO */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithAction}>
          <View style={styles.cardHeaderTitleCol}>
            <Text style={styles.cardHeaderTitle}>Talentos</Text>
            <Text style={styles.cardHeaderSubtitle}>
              Combate, Destino, Magia, Perícia, Concedidos, Regionais ou Tormenta
            </Text>
          </View>
          <View style={styles.headerButtonsRow}>
            <TouchableOpacity
              style={styles.btnCompendio}
              onPress={abrirCompendioTalentos}
            >
              <Text style={styles.btnCompendioText}>📖 Talentos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAdicionarHeader}
              onPress={() => adicionarItem('talentos')}
            >
              <Text style={styles.btnAdicionarHeaderText}>+ Manual</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBody}>
          {ficha.talentos.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                Nenhum talento cadastrado. Toque em "📖 Talentos" para escolher da lista ou "+ Manual" para criar.
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
                        atualizarItem('talentos', { ...item, nome: v })
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
                    onPress={() => removerItem('talentos', item.id)}
                  >
                    <Text style={styles.btnRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <CampoTexto
                  label="Descrição / Pré-requisitos / Benefício"
                  value={item.descricao}
                  onChangeText={(v) =>
                    atualizarItem('talentos', { ...item, descricao: v })
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
        onAdicionarTalentoAFicha={handleAdicionarTalentoCompendio}
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
