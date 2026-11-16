import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  converterMagiaParaItem,
  formatarDescricaoMagia,
  MagiaData,
} from '../data';
import { FichaPersonagem, gerarId, MagiaItem } from '../models/ficha';
import { COLORS } from '../theme/colors';
import { BarraDeProgressoRecurso } from './BarraDeProgressoRecurso';
import { CampoComSugestoes } from './CampoComSugestoes';
import { CampoTexto } from './CommonInput';
import { CompendioModal } from './CompendioModal';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

const NIVEIS_MAGIA = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const AbaMagias: React.FC<Props> = ({ ficha, onChange }) => {
  const [compendioVisivel, setCompendioVisivel] = useState(false);
  const [compendioNivelFiltro, setCompendioNivelFiltro] = useState<number | null>(null);

  const abrirCompendioMagias = (nivel?: number | null) => {
    setCompendioNivelFiltro(nivel !== undefined ? nivel : null);
    setCompendioVisivel(true);
  };

  const adicionarMagia = (nivelMagia: number) => {
    const nova: MagiaItem = {
      id: gerarId(),
      nivelCirculo: nivelMagia,
      nome: '',
      custoPm: nivelMagia === 0 ? '0' : String(nivelMagia),
      descricao: '',
    };
    onChange({ ...ficha, magias: [...ficha.magias, nova] });
  };

  const atualizarMagia = (magiaEditada: MagiaItem) => {
    onChange({
      ...ficha,
      magias: ficha.magias.map((m) =>
        m.id === magiaEditada.id ? magiaEditada : m
      ),
    });
  };

  const removerMagia = (id: string) => {
    onChange({
      ...ficha,
      magias: ficha.magias.filter((m) => m.id !== id),
    });
  };

  const handleAdicionarMagiaCompendio = (magia: MagiaData) => {
    const nova = converterMagiaParaItem(magia);
    onChange({
      ...ficha,
      magias: [...ficha.magias, nova],
    });
  };

  const handlePreencherMagiaExistente = (
    magiaAntiga: MagiaItem,
    magia: MagiaData
  ) => {
    const atualizada: MagiaItem = {
      ...magiaAntiga,
      nome: magia.nome,
      nivelCirculo: magia.nivel,
      custoPm: magia.nivel === 0 ? '0' : String(magia.nivel),
      descricao: formatarDescricaoMagia(magia),
    };
    atualizarMagia(atualizada);
  };

  const alterarPmAtual = (delta: number) => {
    const novo = Math.max(0, (ficha.pmAtual || 0) + delta);
    onChange({ ...ficha, pmAtual: novo });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. PAINEL DE CONTROLE DE PONTOS DE MAGIA (PM) */}
      <View style={styles.cardPm}>
        <View style={styles.pmInfoCol}>
          <Text style={styles.pmLabel}>✨ Pontos de Magia (PM)</Text>
          <View style={styles.pmValoresRow}>
            <Text style={styles.pmAtualText}>{ficha.pmAtual ?? 0}</Text>
            <Text style={styles.pmDivisorText}>/</Text>
            <Text style={styles.pmTotalText}>{ficha.pmTotal ?? 0}</Text>
            <Text style={styles.pmUnidadeText}>PM</Text>
          </View>
        </View>

        <View style={styles.pmControlesRow}>
          <TouchableOpacity
            style={[styles.btnPm, styles.btnPmSub]}
            onPress={() => alterarPmAtual(-1)}
          >
            <Text style={styles.btnPmText}>-1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnPm, styles.btnPmSub]}
            onPress={() => alterarPmAtual(-5)}
          >
            <Text style={styles.btnPmText}>-5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnPm, styles.btnPmAdd]}
            onPress={() => alterarPmAtual(+1)}
          >
            <Text style={styles.btnPmText}>+1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnPm, styles.btnPmAdd]}
            onPress={() => alterarPmAtual(+5)}
          >
            <Text style={styles.btnPmText}>+5</Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: '100%', marginTop: 8 }}>
          <BarraDeProgressoRecurso
            atual={ficha.pmAtual ?? 0}
            max={ficha.pmTotal ?? 0}
            cor="#1565C0"
            corFundo="rgba(21,101,192,0.14)"
            unidade="PM"
          />
        </View>
      </View>

      {/* 2. GRIMÓRIO DE MAGIAS POR NÍVEL */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithAction}>
          <View style={styles.cardHeaderTitleCol}>
            <Text style={styles.cardHeaderTitle}>Grimório de Magias</Text>
            <Text style={styles.cardHeaderSubtitle}>
              {ficha.magias.length} magias registradas • Magias do 0 ao 9º nível
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnCompendio}
            onPress={() => abrirCompendioMagias(null)}
          >
            <Text style={styles.btnCompendioText}>📖 Grimório Geral</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          {NIVEIS_MAGIA.map((nivel) => {
            const magiasNivel = ficha.magias.filter(
              (m) => m.nivelCirculo === nivel
            );
            return (
              <View key={nivel} style={styles.nivelMagiaBox}>
                <View style={styles.nivelMagiaHeader}>
                  <View style={styles.nivelMagiaTituloRow}>
                    <Text style={styles.nivelMagiaTitulo}>
                      {nivel === 0
                        ? 'Nível 0 (Truques / Preces)'
                        : `Magias de ${nivel}º Nível`}
                    </Text>
                    <View style={styles.badgeCustoPmFixo}>
                      <Text style={styles.badgeCustoPmFixoText}>
                        {nivel === 0 ? '0 PM' : `${nivel} PM`}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.nivelMagiaActions}>
                    <TouchableOpacity
                      style={styles.btnBuscarNivel}
                      onPress={() => abrirCompendioMagias(nivel)}
                    >
                      <Text style={styles.btnBuscarNivelText}>📖 Buscar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnAddMagia}
                      onPress={() => adicionarMagia(nivel)}
                    >
                      <Text style={styles.btnAddMagiaText}>+ Manual</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {magiasNivel.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Espaço livre — toque em "📖 Buscar" ou "+ Manual" para adicionar.
                  </Text>
                ) : (
                  magiasNivel.map((magia) => (
                    <View key={magia.id} style={styles.itemSubCard}>
                      <View style={styles.rowTop}>
                        <View style={styles.colNomeMagia}>
                          <CampoComSugestoes
                            label="Nome da Magia"
                            value={magia.nome}
                            onChangeText={(v) =>
                              atualizarMagia({ ...magia, nome: v })
                            }
                            tipo="magia"
                            nivelMagia={nivel}
                            placeholder="Ex: Bola de Fogo, Curar Ferimentos..."
                            onSelecionarSugestao={(m) =>
                              handlePreencherMagiaExistente(magia, m as MagiaData)
                            }
                            onAbrirCompendio={() => abrirCompendioMagias(nivel)}
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.btnRemove}
                          onPress={() => removerMagia(magia.id)}
                        >
                          <Text style={styles.btnRemoveText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                      <CampoTexto
                        label="Efeito / Alcance / Duração / Resistência"
                        value={magia.descricao}
                        onChangeText={(v) =>
                          atualizarMagia({ ...magia, descricao: v })
                        }
                        multiline
                      />
                    </View>
                  ))
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Modal do Compêndio */}
      <CompendioModal
        visivel={compendioVisivel}
        onFechar={() => setCompendioVisivel(false)}
        abaInicial="magias"
        nivelFiltroInicial={compendioNivelFiltro}
        fichaAtual={ficha}
        onAdicionarMagiaAFicha={handleAdicionarMagiaCompendio}
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
  cardPm: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  pmInfoCol: {
    minWidth: 140,
  },
  pmLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
  },
  pmValoresRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  pmAtualText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B609E',
  },
  pmDivisorText: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  pmTotalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  pmUnidadeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  pmControlesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  btnPm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPmSub: {
    backgroundColor: 'rgba(179,38,30,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(179,38,30,0.3)',
  },
  btnPmAdd: {
    backgroundColor: 'rgba(46,125,50,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(46,125,50,0.3)',
  },
  btnPmText: {
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
  cardBody: {
    padding: 12,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  nivelMagiaBox: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  nivelMagiaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  nivelMagiaTituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nivelMagiaTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  badgeCustoPmFixo: {
    backgroundColor: 'rgba(30,136,229,0.14)',
    borderColor: '#1E88E5',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeCustoPmFixoText: {
    color: '#1565C0',
    fontSize: 11,
    fontWeight: 'bold',
  },
  nivelMagiaActions: {
    flexDirection: 'row',
    gap: 6,
  },
  btnBuscarNivel: {
    backgroundColor: 'rgba(200,157,60,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  btnBuscarNivelText: {
    color: '#8A6414',
    fontWeight: 'bold',
    fontSize: 11,
  },
  btnAddMagia: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnAddMagiaText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 11,
  },
  itemSubCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  colNomeMagia: {
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

