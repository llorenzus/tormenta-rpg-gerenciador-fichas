import React, { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { armasMagicas, RegraData } from '../data';
import { COLORS } from '../theme/colors';
import { CampoTexto } from './CommonInput';

export interface PoderArmaSelecionado {
  nome: string;
  descricao: string;
  bonusEquivalente: string;
}

interface Props {
  visivel: boolean;
  armaNome: string;
  onSelecionarPoder: (poder: PoderArmaSelecionado) => void;
  onFechar: () => void;
}

export const ModalPoderesArma: React.FC<Props> = ({
  visivel,
  armaNome,
  onSelecionarPoder,
  onFechar,
}) => {
  const [busca, setBusca] = useState('');
  const [abaModo, setAbaModo] = useState<'oficial' | 'personalizado'>('oficial');
  const [bonusFiltro, setBonusFiltro] = useState<string>('Todos');

  // Campos para poder personalizado
  const [customNome, setCustomNome] = useState('');
  const [customBonus, setCustomBonus] = useState('+1');
  const [customDesc, setCustomDesc] = useState('');

  // Poderes oficiais do TRPG extraídos do compêndio
  const poderesOficiais = useMemo(() => {
    return armasMagicas.filter((r) => r.id.startsWith('poder_arma_'));
  }, []);

  const poderesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    let lista = poderesOficiais;
    if (bonusFiltro !== 'Todos') {
      lista = lista.filter((p) => (p.bonusEquivalente || '').includes(bonusFiltro));
    }
    if (termo) {
      lista = lista.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          (p.descricao && p.descricao.toLowerCase().includes(termo)) ||
          (p.subtipo && p.subtipo.toLowerCase().includes(termo)) ||
          (p.bonusEquivalente && p.bonusEquivalente.toLowerCase().includes(termo))
      );
    }
    return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }, [busca, bonusFiltro, poderesOficiais]);

  const handleEscolherOficial = (poder: RegraData) => {
    // Normaliza nome removendo "Poder Especial: " se presente
    const nomeLimpo = poder.nome.replace(/^Poder Especial:\s*/i, '').trim();
    onSelecionarPoder({
      nome: nomeLimpo,
      descricao: poder.descricao || '',
      bonusEquivalente: poder.bonusEquivalente || '',
    });
    onFechar();
  };

  const handleAdicionarCustomizado = () => {
    const nomeTrim = customNome.trim();
    if (!nomeTrim) return;
    onSelecionarPoder({
      nome: nomeTrim,
      descricao: customDesc.trim(),
      bonusEquivalente: customBonus.trim(),
    });
    setCustomNome('');
    setCustomDesc('');
    setCustomBonus('+1');
    onFechar();
  };

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
    >
      <TouchableWithoutFeedback onPress={onFechar}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTitleWrap}>
                  <Text style={styles.title}>✨ Habilidades Especiais Mágicas</Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    Encantamento para: {armaNome || 'Arma'}
                  </Text>
                </View>
                <TouchableOpacity onPress={onFechar} style={styles.btnClose}>
                  <Text style={styles.btnCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Seletor de Modo: Lista Oficial vs Personalizado */}
              <View style={styles.tabsRow}>
                <TouchableOpacity
                  style={[styles.tabBtn, abaModo === 'oficial' && styles.tabBtnAtivo]}
                  onPress={() => setAbaModo('oficial')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabBtnText,
                      abaModo === 'oficial' && styles.tabBtnTextAtivo,
                    ]}
                  >
                    📜 Lista Oficial TRPG ({poderesOficiais.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, abaModo === 'personalizado' && styles.tabBtnAtivo]}
                  onPress={() => setAbaModo('personalizado')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabBtnText,
                      abaModo === 'personalizado' && styles.tabBtnTextAtivo,
                    ]}
                  >
                    ✏️ Personalizado
                  </Text>
                </TouchableOpacity>
              </View>

              {abaModo === 'oficial' ? (
                <>
                  {/* Campo de Busca */}
                  <View style={styles.searchWrap}>
                    <TextInput
                      style={styles.searchInput}
                      value={busca}
                      onChangeText={setBusca}
                      placeholder="🔍 Buscar poder mágico (ex: Flamejante, Afiada, Sagrada...)"
                      placeholderTextColor="#9D8E80"
                    />
                    {!!busca && (
                      <TouchableOpacity
                        style={styles.btnClearSearch}
                        onPress={() => setBusca('')}
                      >
                        <Text style={styles.btnClearSearchText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Filtro por Nível de Bônus Mágico */}
                  <View style={styles.bonusChipsWrap}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.bonusChipsScroll}
                    >
                      {(['Todos', '+1', '+2', '+3', '+4', '+5'] as const).map((b) => (
                        <TouchableOpacity
                          key={b}
                          style={[
                            styles.chipBonus,
                            bonusFiltro === b && styles.chipBonusAtivo,
                          ]}
                          onPress={() => setBonusFiltro(b)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.chipBonusText,
                              bonusFiltro === b && styles.chipBonusTextAtivo,
                            ]}
                          >
                            {b === 'Todos' ? 'Todos os Bônus' : `Bônus ${b}`}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Lista de Poderes Oficiais */}
                  <ScrollView
                    style={styles.scrollList}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                  >
                    {poderesFiltrados.length === 0 ? (
                      <View style={styles.emptyWrap}>
                        <Text style={styles.emptyText}>
                          Nenhum poder especial mágico encontrado para "{busca}".
                        </Text>
                      </View>
                    ) : (
                      poderesFiltrados.map((poder) => {
                        const nomeFormatado = poder.nome.replace(/^Poder Especial:\s*/i, '');
                        return (
                          <View key={poder.id} style={styles.poderItemCard}>
                            <View style={styles.poderItemHeader}>
                              <View style={styles.poderItemNomeRow}>
                                <Text style={styles.poderItemNome}>
                                  {nomeFormatado}
                                </Text>
                                {!!poder.bonusEquivalente && (
                                  <View style={styles.badgeBonus}>
                                    <Text style={styles.badgeBonusText}>
                                      {poder.bonusEquivalente}
                                    </Text>
                                  </View>
                                )}
                                {!!poder.subtipo && (
                                  <View style={styles.badgeSubtipo}>
                                    <Text style={styles.badgeSubtipoText}>
                                      {poder.subtipo}
                                    </Text>
                                  </View>
                                )}
                              </View>

                              <TouchableOpacity
                                style={styles.btnAdicionarPoder}
                                onPress={() => handleEscolherOficial(poder)}
                                activeOpacity={0.8}
                              >
                                <Text style={styles.btnAdicionarPoderText}>
                                  + Adicionar
                                </Text>
                              </TouchableOpacity>
                            </View>

                            <Text style={styles.poderItemDesc}>
                              {poder.descricao}
                            </Text>

                            {!!poder.detalhes && (
                              <Text style={styles.poderItemDetalhes}>
                                {poder.detalhes}
                              </Text>
                            )}
                          </View>
                        );
                      })
                    )}
                  </ScrollView>
                </>
              ) : (
                /* Modo Personalizado */
                <ScrollView
                  style={styles.scrollList}
                  contentContainerStyle={styles.scrollCustomContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.customBox}>
                    <Text style={styles.customBoxTitle}>Criar Habilidade Especial Própria</Text>
                    <Text style={styles.customBoxSub}>
                      Ideal para armas de mestre, relíquias divinas ou poderes customizados do seu cenário.
                    </Text>

                    <CampoTexto
                      label="Nome da Habilidade Mágica *"
                      value={customNome}
                      onChangeText={setCustomNome}
                      placeholder="Ex: Matadora de Aberrações, Lâmina Sombria..."
                    />

                    <CampoTexto
                      label="Bônus Equivalente ou Custo (Opcional)"
                      value={customBonus}
                      onChangeText={setCustomBonus}
                      placeholder="Ex: +1, +2, +3 ou Fixo"
                    />

                    <CampoTexto
                      label="Efeito Mecânico / Descrição"
                      value={customDesc}
                      onChangeText={setCustomDesc}
                      placeholder="Ex: Causa +2d6 de dano contra licantropos e emana uma luz prateada a até 9m."
                      multiline
                      minHeight={80}
                      numberOfLines={3}
                    />

                    <TouchableOpacity
                      style={[
                        styles.btnSalvarCustom,
                        !customNome.trim() && styles.btnSalvarCustomDisabled,
                      ]}
                      onPress={handleAdicionarCustomizado}
                      disabled={!customNome.trim()}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.btnSalvarCustomText}>
                        + Adicionar Esta Habilidade à Arma
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 620,
    height: Platform.OS === 'web' ? 'auto' : '88%',
    maxHeight: '92%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surfaceVariant,
  },
  headerTitleWrap: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  subtitle: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  btnClose: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    cursor: 'pointer' as any,
  },
  btnCloseText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    cursor: 'pointer' as any,
  },
  tabBtnAtivo: {
    borderBottomColor: COLORS.primary,
    backgroundColor: 'rgba(139,30,30,0.04)',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabBtnTextAtivo: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: COLORS.text,
  },
  btnClearSearch: {
    marginLeft: 6,
    padding: 6,
    cursor: 'pointer' as any,
  },
  btnClearSearchText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  bonusChipsWrap: {
    backgroundColor: COLORS.surfaceVariant,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bonusChipsScroll: {
    paddingHorizontal: 12,
    gap: 6,
  },
  chipBonus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    cursor: 'pointer' as any,
  },
  chipBonusAtivo: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipBonusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chipBonusTextAtivo: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    gap: 8,
  },
  scrollCustomContent: {
    padding: 14,
  },
  emptyWrap: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  poderItemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
  },
  poderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  poderItemNomeRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  poderItemNome: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  badgeBonus: {
    backgroundColor: 'rgba(200,157,60,0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeBonusText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#8A6414',
  },
  badgeSubtipo: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeSubtipoText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  btnAdicionarPoder: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    cursor: 'pointer' as any,
  },
  btnAdicionarPoderText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  poderItemDesc: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16.5,
  },
  poderItemDetalhes: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 15,
    fontStyle: 'italic',
  },
  customBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  customBoxTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  customBoxSub: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 16,
  },
  btnSalvarCustom: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.gold,
    cursor: 'pointer' as any,
  },
  btnSalvarCustomDisabled: {
    opacity: 0.5,
  },
  btnSalvarCustomText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
