import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CATEGORIAS_TALENTO,
  converterTalentoParaItem,
  formatarDescricaoTalento,
  normalizarTexto,
  TalentoData,
  talentos,
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
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todas');

  const obterCategoriaDoTalento = (t: HabilidadeOuTalento): string => {
    const comp = talentos.find(
      (item) => normalizarTexto(item.nome) === normalizarTexto(t.nome)
    );
    if (comp) return comp.categoria;

    const match = t.descricao.match(/^\[(.*?)\]/);
    if (match) {
      const tag = match[1].trim();
      for (const cat of CATEGORIAS_TALENTO) {
        if (cat !== 'Todas' && normalizarTexto(cat) === normalizarTexto(tag)) {
          return cat;
        }
      }
      return tag;
    }

    return 'Outros';
  };

  const talentosFiltrados = useMemo(() => {
    if (categoriaFiltro === 'Todas') return ficha.talentos;
    const normFiltro = normalizarTexto(categoriaFiltro);
    return ficha.talentos.filter((t) => {
      const cat = normalizarTexto(obterCategoriaDoTalento(t));
      return cat === normFiltro;
    });
  }, [ficha.talentos, categoriaFiltro]);

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
                  {categoriaFiltro === 'Todas'
                    ? `${ficha.talentos.length} ${ficha.talentos.length === 1 ? 'talento' : 'talentos'}`
                    : `${talentosFiltrados.length} de ${ficha.talentos.length}`}
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

        {/* BARRA DE FILTROS POR CATEGORIA/TIPO DE TALENTO */}
        <View style={styles.filtrosWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {CATEGORIAS_TALENTO.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  categoriaFiltro === cat && styles.chipAtivo,
                ]}
                onPress={() => setCategoriaFiltro(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    categoriaFiltro === cat && styles.chipTextAtivo,
                  ]}
                >
                  {cat === 'Todas' ? 'Todos os Tipos' : cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
          ) : talentosFiltrados.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Nenhum talento do tipo "{categoriaFiltro}"</Text>
              <Text style={styles.emptyText}>
                Nenhum dos {ficha.talentos.length} talentos da ficha pertence a esta categoria. Selecione "Todos os Tipos" para visualizar a lista completa.
              </Text>
            </View>
          ) : (
            talentosFiltrados.map((item) => (
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
  filtrosWrap: {
    backgroundColor: COLORS.surfaceVariant,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chipsScroll: {
    paddingHorizontal: 12,
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    cursor: 'pointer' as any,
  },
  chipAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chipTextAtivo: {
    color: COLORS.white,
    fontWeight: 'bold',
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
    alignItems: 'flex-end',
    gap: 8,
  },
  colFlex: {
    flex: 1,
  },
  btnRemove: {
    marginBottom: 8,
    width: 38,
    height: 42,
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

