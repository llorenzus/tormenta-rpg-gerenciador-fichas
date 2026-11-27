import React from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  calcularCaTotal,
  calcularModificador,
  calcularResistencia,
  FichaPersonagem,
  formatarModificador,
  obterBuffsTemporarios,
  obterValorAtributoBase,
  obterPvMaxEfetivo,
  obterPmMaxEfetivo,
  temBuffsAtivos,
  zerarBuffsTemporarios,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoInteiro, StepperValor } from './CommonInput';

interface Props {
  visivel: boolean;
  ficha: FichaPersonagem;
  onChange: (novaFicha: FichaPersonagem) => void;
  onFechar: () => void;
}

const ATRIBUTOS_CONFIG = [
  { chave: 'forca' as const, sigla: 'FOR' as const, nome: 'Força' },
  { chave: 'destreza' as const, sigla: 'DES' as const, nome: 'Destreza' },
  { chave: 'constituicao' as const, sigla: 'CON' as const, nome: 'Constituição' },
  { chave: 'inteligencia' as const, sigla: 'INT' as const, nome: 'Inteligência' },
  { chave: 'sabedoria' as const, sigla: 'SAB' as const, nome: 'Sabedoria' },
  { chave: 'carisma' as const, sigla: 'CAR' as const, nome: 'Carisma' },
];

const RESISTENCIAS_CONFIG = [
  { chave: 'fortitude' as const, tipo: 'fortitude' as const, nome: 'Fortitude' },
  { chave: 'reflexos' as const, tipo: 'reflexos' as const, nome: 'Reflexos' },
  { chave: 'vontade' as const, tipo: 'vontade' as const, nome: 'Vontade' },
];

export const ModalBuffsTemporarios: React.FC<Props> = ({
  visivel,
  ficha,
  onChange,
  onFechar,
}) => {
  const buffs = obterBuffsTemporarios(ficha);
  const temAtivos = temBuffsAtivos(ficha);

  const atualizarBuff = (campo: keyof typeof buffs, valor: number) => {
    const novosBuffs = {
      ...buffs,
      [campo]: valor,
    };
    onChange({
      ...ficha,
      buffsTemporarios: novosBuffs,
    });
  };

  const handleZerarTodos = () => {
    onChange(zerarBuffsTemporarios(ficha));
  };

  const adicionarPvTemp = (qtd: number) => {
    const atual = buffs.pvTemporario || 0;
    atualizarBuff('pvTemporario', Math.max(0, atual + qtd));
  };

  const adicionarPvMaxBuff = (qtd: number) => {
    const atual = buffs.pvMax || 0;
    atualizarBuff('pvMax', Math.max(-999, atual + qtd));
  };

  const adicionarPmMaxBuff = (qtd: number) => {
    const atual = buffs.pmMax || 0;
    atualizarBuff('pmMax', Math.max(-999, atual + qtd));
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
                  <Text style={styles.title}>⚡ Buffs & Efeitos Temporários</Text>
                  <Text style={styles.subtitle}>
                    Valores temporários não alteram seus atributos base e são zerados no Descanso Pleno.
                  </Text>
                </View>
                <TouchableOpacity onPress={onFechar} style={styles.btnClose}>
                  <Text style={styles.btnCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
              >
                {/* 1. ATRIBUTOS PRINCIPAIS */}
                <View style={styles.secaoBox}>
                  <Text style={styles.secaoTitulo}>🏋️‍♂️ ATRIBUTOS PRINCIPAIS</Text>
                  <Text style={styles.secaoDesc}>
                    Bônus temporários afetam perícias, CA, ataques e resistências sem alterar a ficha base.
                  </Text>

                  <View style={styles.atributosGrid}>
                    {ATRIBUTOS_CONFIG.map((item) => {
                      const base = obterValorAtributoBase(ficha, item.sigla);
                      const bonus = buffs[item.chave];
                      const total = base + bonus;
                      const mod = calcularModificador(total);

                      return (
                        <View key={item.chave} style={styles.itemCard}>
                          <View style={styles.itemTopRow}>
                            <View style={styles.itemIdent}>
                              <Text style={styles.itemSigla}>{item.sigla}</Text>
                              <View style={styles.itemNomeCol}>
                                <Text style={styles.itemNome}>{item.nome}</Text>
                                <Text style={styles.itemBaseText}>Base: {base}</Text>
                              </View>
                            </View>

                            <View style={[styles.totalCol, bonus !== 0 && styles.totalColAtivo]}>
                              {bonus !== 0 && (
                                <Text style={styles.totalLabel}>
                                  {formatarModificador(bonus)} temp
                                </Text>
                              )}
                              <Text style={styles.totalValor}>
                                Total: {total} ({formatarModificador(mod)})
                              </Text>
                            </View>
                          </View>

                          <View style={styles.itemBottomRow}>
                            <Text style={styles.stepperDescLabel}>Bônus Temporário:</Text>
                            <StepperValor
                              valor={bonus}
                              onValorChange={(v) => atualizarBuff(item.chave, v)}
                              min={-20}
                              max={30}
                            />
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* 2. RESISTÊNCIAS */}
                <View style={styles.secaoBox}>
                  <Text style={styles.secaoTitulo}>🛡️ TESTES DE RESISTÊNCIA</Text>
                  <Text style={styles.secaoDesc}>
                    Bônus adicionais diretos aplicados às suas jogadas de resistência (Fortitude, Reflexos e Vontade).
                  </Text>

                  <View style={styles.atributosGrid}>
                    {RESISTENCIAS_CONFIG.map((item) => {
                      const bonus = buffs[item.chave];
                      const total = calcularResistencia(ficha, item.tipo);

                      return (
                        <View key={item.chave} style={styles.itemCard}>
                          <View style={styles.itemTopRow}>
                            <View style={styles.itemIdent}>
                              <Text style={styles.itemSigla}>{item.nome}</Text>
                              <View style={styles.itemNomeCol}>
                                <Text style={styles.itemBaseText}>Resistência</Text>
                              </View>
                            </View>

                            <View style={[styles.totalCol, bonus !== 0 && styles.totalColAtivo]}>
                              {bonus !== 0 && (
                                <Text style={styles.totalLabel}>
                                  {formatarModificador(bonus)} temp
                                </Text>
                              )}
                              <Text style={styles.totalValor}>
                                Total: {formatarModificador(total)}
                              </Text>
                            </View>
                          </View>

                          <View style={styles.itemBottomRow}>
                            <Text style={styles.stepperDescLabel}>Bônus Temporário:</Text>
                            <StepperValor
                              valor={bonus}
                              onValorChange={(v) => atualizarBuff(item.chave, v)}
                              min={-20}
                              max={30}
                            />
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* 3. CLASSE DE ARMADURA (CA) */}
                <View style={styles.secaoBox}>
                  <Text style={styles.secaoTitulo}>🛡️ CLASSE DE ARMADURA (CA) TEMPORÁRIA</Text>
                  <Text style={styles.secaoDesc}>
                    Bônus temporários que afetam sua defesa (ex: Armadura Arcana, Escudo da Fé, bônus de cobertura ou esquiva).
                  </Text>

                  <View style={styles.itemCard}>
                    <View style={styles.itemTopRow}>
                      <View style={styles.itemIdent}>
                        <Text style={styles.itemSigla}>CA</Text>
                        <View style={styles.itemNomeCol}>
                          <Text style={styles.itemNome}>Classe de Armadura</Text>
                          <Text style={styles.itemBaseText}>
                            Sem buff: {calcularCaTotal({ ...ficha, buffsTemporarios: { ...buffs, ca: 0 } })}
                          </Text>
                        </View>
                      </View>

                      <View style={[styles.totalCol, buffs.ca !== 0 && styles.totalColAtivo]}>
                        {buffs.ca !== 0 && (
                          <Text style={styles.totalLabel}>
                            {formatarModificador(buffs.ca)} temp
                          </Text>
                        )}
                        <Text style={styles.totalValor}>
                          CA Total: {calcularCaTotal(ficha)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.itemBottomRow}>
                      <Text style={styles.stepperDescLabel}>Bônus Temporário na CA:</Text>
                      <StepperValor
                        valor={buffs.ca}
                        onValorChange={(v) => atualizarBuff('ca', v)}
                        min={-20}
                        max={50}
                      />
                    </View>
                  </View>
                </View>

                {/* 4. VIDA E MANA MÁXIMAS TEMPORÁRIAS */}
                <View style={styles.secaoBox}>
                  <Text style={styles.secaoTitulo}>✨ VIDA E MANA MÁXIMAS TEMPORÁRIAS</Text>
                  <Text style={styles.secaoDesc}>
                    Bônus temporários que aumentam o limite máximo de PV e PM (ex: Fúria, Heroísmo, rituais ou poções).
                  </Text>

                  {/* Vida Máxima */}
                  <View style={styles.itemCard}>
                    <View style={styles.itemTopRow}>
                      <View style={styles.itemIdent}>
                        <Text style={[styles.itemSigla, { color: '#C62828' }]}>PV</Text>
                        <View style={styles.itemNomeCol}>
                          <Text style={styles.itemNome}>Vida Máxima (PV Máximo)</Text>
                          <Text style={styles.itemBaseText}>Base da Ficha: {ficha.pvTotal} PV</Text>
                        </View>
                      </View>

                      <View style={[styles.totalCol, buffs.pvMax !== 0 && styles.totalColAtivo]}>
                        {buffs.pvMax !== 0 && (
                          <Text style={styles.totalLabel}>
                            {formatarModificador(buffs.pvMax)} temp
                          </Text>
                        )}
                        <Text style={styles.totalValor}>
                          Máx: {obterPvMaxEfetivo(ficha)} PV
                        </Text>
                      </View>
                    </View>

                    <View style={styles.itemBottomRow}>
                      <Text style={styles.stepperDescLabel}>Bônus no PV Máximo:</Text>
                      <View style={styles.recursoBuffControlRow}>
                        <StepperValor
                          valor={buffs.pvMax}
                          onValorChange={(v) => atualizarBuff('pvMax', v)}
                          min={-50}
                          max={999}
                        />
                        <View style={styles.quickStepGroup}>
                          <TouchableOpacity
                            style={styles.btnPvQuick}
                            onPress={() => adicionarPvMaxBuff(5)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.btnPvQuickText}>+5</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.btnPvQuick}
                            onPress={() => adicionarPvMaxBuff(10)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.btnPvQuickText}>+10</Text>
                          </TouchableOpacity>
                          {buffs.pvMax !== 0 && (
                            <TouchableOpacity
                              style={[styles.btnPvQuick, styles.btnPvZerar]}
                              onPress={() => atualizarBuff('pvMax', 0)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.btnPvZerarText}>Zerar</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Mana Máxima */}
                  <View style={[styles.itemCard, { marginTop: 10 }]}>
                    <View style={styles.itemTopRow}>
                      <View style={styles.itemIdent}>
                        <Text style={[styles.itemSigla, { color: '#1565C0' }]}>PM</Text>
                        <View style={styles.itemNomeCol}>
                          <Text style={styles.itemNome}>Mana Máxima (PM Máximo)</Text>
                          <Text style={styles.itemBaseText}>Base da Ficha: {ficha.pmTotal} PM</Text>
                        </View>
                      </View>

                      <View style={[styles.totalCol, buffs.pmMax !== 0 && styles.totalColAtivo]}>
                        {buffs.pmMax !== 0 && (
                          <Text style={styles.totalLabel}>
                            {formatarModificador(buffs.pmMax)} temp
                          </Text>
                        )}
                        <Text style={styles.totalValor}>
                          Máx: {obterPmMaxEfetivo(ficha)} PM
                        </Text>
                      </View>
                    </View>

                    <View style={styles.itemBottomRow}>
                      <Text style={styles.stepperDescLabel}>Bônus no PM Máximo:</Text>
                      <View style={styles.recursoBuffControlRow}>
                        <StepperValor
                          valor={buffs.pmMax}
                          onValorChange={(v) => atualizarBuff('pmMax', v)}
                          min={-50}
                          max={999}
                        />
                        <View style={styles.quickStepGroup}>
                          <TouchableOpacity
                            style={styles.btnPvQuick}
                            onPress={() => adicionarPmMaxBuff(5)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.btnPvQuickText}>+5</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.btnPvQuick}
                            onPress={() => adicionarPmMaxBuff(10)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.btnPvQuickText}>+10</Text>
                          </TouchableOpacity>
                          {buffs.pmMax !== 0 && (
                            <TouchableOpacity
                              style={[styles.btnPvQuick, styles.btnPvZerar]}
                              onPress={() => atualizarBuff('pmMax', 0)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.btnPvZerarText}>Zerar</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* 5. PONTOS DE VIDA (PV) TEMPORÁRIOS */}
                <View style={[styles.secaoBox, styles.secaoBoxPv]}>
                  <Text style={[styles.secaoTitulo, { color: '#C62828' }]}>
                    🛡️ PONTOS DE VIDA (PV) TEMPORÁRIOS (ABSORÇÃO)
                  </Text>
                  <Text style={styles.secaoDesc}>
                    Pontos de vida extras (ex: Vitalidade Ilusória) que absorvem dano antes do seu PV real.
                  </Text>

                  <View style={styles.pvTempRow}>
                    <View style={styles.pvTempInputWrap}>
                      <CampoInteiro
                        label="PV Temporário Adicional"
                        valor={buffs.pvTemporario}
                        onValorChange={(v) => atualizarBuff('pvTemporario', Math.max(0, v))}
                        min={0}
                        max={9999}
                        style={{ flex: 1 }}
                      />
                    </View>

                    <View style={styles.pvQuickButtonsRow}>
                      <TouchableOpacity
                        style={styles.btnPvQuick}
                        onPress={() => adicionarPvTemp(5)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.btnPvQuickText}>+5</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.btnPvQuick}
                        onPress={() => adicionarPvTemp(10)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.btnPvQuickText}>+10</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.btnPvQuick}
                        onPress={() => adicionarPvTemp(20)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.btnPvQuickText}>+20</Text>
                      </TouchableOpacity>
                      {buffs.pvTemporario > 0 && (
                        <TouchableOpacity
                          style={[styles.btnPvQuick, styles.btnPvZerar]}
                          onPress={() => atualizarBuff('pvTemporario', 0)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.btnPvZerarText}>Zerar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {buffs.pvTemporario > 0 && (
                    <View style={styles.pvTempBadgeAlerta}>
                      <Text style={styles.pvTempBadgeAlertaText}>
                        🛡️ Você possui +{buffs.pvTemporario} PV temporários protegendo seus {ficha.pvAtual} PV atuais!
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                {temAtivos ? (
                  <TouchableOpacity
                    style={styles.btnZerar}
                    onPress={handleZerarTodos}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnZerarText}>🗑️ Zerar Todos os Buffs</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flex: 1 }} />
                )}

                <TouchableOpacity
                  style={styles.btnConcluir}
                  onPress={onFechar}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnConcluirText}>✓ Concluir</Text>
                </TouchableOpacity>
              </View>
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
    padding: Platform.OS === 'web' ? 16 : 8,
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surfaceVariant,
  },
  headerTitleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  subtitle: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  btnClose: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  btnCloseText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  secaoBox: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  secaoBoxPv: {
    borderLeftWidth: 4,
    borderLeftColor: '#C62828',
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  secaoDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 10,
    lineHeight: 15,
  },
  atributosGrid: {
    gap: 10,
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemIdent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  itemNomeCol: {
    flex: 1,
  },
  itemSigla: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    minWidth: 36,
  },
  itemNome: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemBaseText: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    gap: 8,
  },
  stepperDescLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  totalCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 110,
    flexShrink: 0,
  },
  totalColAtivo: {
    backgroundColor: 'rgba(46, 107, 62, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(46, 107, 62, 0.3)',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E6B3E',
  },
  totalValor: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 1,
  },
  recursoBuffControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickStepGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pvTempRow: {
    gap: 10,
  },
  pvTempInputWrap: {
    marginBottom: 4,
  },
  pvQuickButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  btnPvQuick: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(198, 40, 40, 0.12)',
    borderWidth: 1,
    borderColor: '#C62828',
  },
  btnPvQuickText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C62828',
  },
  btnPvZerar: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderColor: COLORS.border,
  },
  btnPvZerarText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  pvTempBadgeAlerta: {
    marginTop: 10,
    backgroundColor: 'rgba(198, 40, 40, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(198, 40, 40, 0.25)',
    padding: 8,
    borderRadius: 6,
  },
  pvTempBadgeAlertaText: {
    fontSize: 11.5,
    color: '#C62828',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surfaceVariant,
    gap: 10,
  },
  btnZerar: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(179, 38, 30, 0.12)',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  btnZerarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  btnConcluir: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  btnConcluirText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
