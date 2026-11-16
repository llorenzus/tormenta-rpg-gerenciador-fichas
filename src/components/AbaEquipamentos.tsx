import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  converterArmaParaItem,
  converterArmaduraParaItem,
  converterItemGeralParaItem,
  EquipamentoData,
} from '../data';
import {
  ArmaItem,
  ArmaduraEquipamento,
  calcularAtaqueArma,
  calcularCaTotal,
  FichaPersonagem,
  formatarModificador,
  gerarId,
  ItemGeral,
  obterBonusArmaduraEquipada,
  obterBonusEscudoEquipado,
  obterModAtributo,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoInteiro, CampoTexto, SecaoHeader } from './CommonInput';
import { CompendioModal } from './CompendioModal';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaEquipamentos: React.FC<Props> = ({ ficha, onChange }) => {
  const [compendioAberto, setCompendioAberto] = useState(false);

  const handleAdicionarEquipamentoCompendio = (equip: EquipamentoData) => {
    if (equip.tipo === 'Arma') {
      const novaArma = converterArmaParaItem(equip);
      onChange({ ...ficha, armas: [...ficha.armas, novaArma] });
    } else if (equip.tipo === 'Armadura' || equip.tipo === 'Escudo') {
      const novaArmadura = converterArmaduraParaItem(equip);
      onChange({ ...ficha, armaduras: [...ficha.armaduras, novaArmadura] });
    } else {
      const novoItem = converterItemGeralParaItem(equip);
      onChange({ ...ficha, itensGerais: [...ficha.itensGerais, novoItem] });
    }
  };

  const adicionarArma = () => {
    const nova: ArmaItem = {
      id: gerarId(),
      nome: '',
      bonusAtaque: '',
      dano: '',
      critico: '',
      distancia: '',
      tipoDano: '',
      usaDestreza: false,
      outrosBonus: 0,
    };
    const totalInicial = calcularAtaqueArma(ficha, nova);
    nova.bonusAtaque = formatarModificador(totalInicial);
    onChange({ ...ficha, armas: [...ficha.armas, nova] });
  };

  const atualizarArma = (armaEditada: ArmaItem) => {
    onChange({
      ...ficha,
      armas: ficha.armas.map((a) => (a.id === armaEditada.id ? armaEditada : a)),
    });
  };

  const removerArma = (id: string) => {
    onChange({
      ...ficha,
      armas: ficha.armas.filter((a) => a.id !== id),
    });
  };

  const adicionarArmadura = () => {
    const nova: ArmaduraEquipamento = {
      id: gerarId(),
      nome: '',
      tipo: 'ARMADURA',
      bonusCa: 0,
      equipada: true,
    };
    onChange({ ...ficha, armaduras: [...ficha.armaduras, nova] });
  };

  const atualizarArmadura = (editada: ArmaduraEquipamento) => {
    onChange({
      ...ficha,
      armaduras: ficha.armaduras.map((a) => (a.id === editada.id ? editada : a)),
    });
  };

  const removerArmadura = (id: string) => {
    onChange({
      ...ficha,
      armaduras: ficha.armaduras.filter((a) => a.id !== id),
    });
  };

  const adicionarItemGeral = () => {
    const novo: ItemGeral = {
      id: gerarId(),
      nome: '',
      quantidade: '1',
    };
    onChange({ ...ficha, itensGerais: [...ficha.itensGerais, novo] });
  };

  const atualizarItemGeral = (editado: ItemGeral) => {
    onChange({
      ...ficha,
      itensGerais: ficha.itensGerais.map((i) =>
        i.id === editado.id ? editado : i
      ),
    });
  };

  const removerItemGeral = (id: string) => {
    onChange({
      ...ficha,
      itensGerais: ficha.itensGerais.filter((i) => i.id !== id),
    });
  };

  const bonusArmadura = obterBonusArmaduraEquipada(ficha);
  const bonusEscudo = obterBonusEscudoEquipado(ficha);
  const caTotal = calcularCaTotal(ficha);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Banner de Atalho para o Compêndio de Equipamentos */}
      <View style={styles.compendioBanner}>
        <View style={styles.compendioBannerTextCol}>
          <Text style={styles.compendioBannerTitle}>Compêndio de Equipamentos</Text>
          <Text style={styles.compendioBannerSubtitle}>
            Consulte armas, armaduras, escudos e itens oficiais dos livros
          </Text>
        </View>
        <TouchableOpacity
          style={styles.btnCompendioEquip}
          onPress={() => setCompendioAberto(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnCompendioEquipText}>📖 Buscar Itens</Text>
        </TouchableOpacity>
      </View>

      {/* 1. ARMAS */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Armas"
          subtitulo="Ataques corpo-a-corpo e à distância"
          acaoTexto="Nova Arma"
          onAcaoPress={adicionarArma}
        />
        <View style={styles.cardBody}>
          {ficha.armas.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma arma cadastrada. Toque em "+ Nova Arma" para adicionar.
            </Text>
          ) : (
            ficha.armas.map((arma) => {
              const bba = Number(ficha.bba) || 0;
              const modFor = obterModAtributo(ficha, 'FOR');
              const modDes = obterModAtributo(ficha, 'DES');
              const modAtrib = arma.usaDestreza ? modDes : modFor;
              const bonusTam = Number(ficha.caBonusTamanho) || 0;
              const outros = Number(arma.outrosBonus) || 0;
              const totalCalculado = bba + modAtrib + bonusTam + outros;

              const selecionarForca = () => {
                if (arma.usaDestreza) {
                  const novoTotal = calcularAtaqueArma(ficha, {
                    ...arma,
                    usaDestreza: false,
                  });
                  atualizarArma({
                    ...arma,
                    usaDestreza: false,
                    bonusAtaque: formatarModificador(novoTotal),
                  });
                }
              };

              const selecionarDestreza = () => {
                if (!arma.usaDestreza) {
                  const novoTotal = calcularAtaqueArma(ficha, {
                    ...arma,
                    usaDestreza: true,
                  });
                  atualizarArma({
                    ...arma,
                    usaDestreza: true,
                    bonusAtaque: formatarModificador(novoTotal),
                  });
                }
              };

              const atualizarOutrosBonus = (novoOutros: number) => {
                const novoTotal = calcularAtaqueArma(ficha, {
                  ...arma,
                  outrosBonus: novoOutros,
                });
                atualizarArma({
                  ...arma,
                  outrosBonus: novoOutros,
                  bonusAtaque: formatarModificador(novoTotal),
                });
              };

              return (
                <View key={arma.id} style={styles.subCard}>
                  {/* Linha superior: Nome e Excluir */}
                  <View style={styles.rowTop}>
                    <CampoTexto
                      label="Nome da Arma"
                      value={arma.nome}
                      onChangeText={(v) => atualizarArma({ ...arma, nome: v })}
                      placeholder="Ex: Espada Longa"
                      style={styles.colFlex}
                    />
                    <TouchableOpacity
                      style={styles.btnRemove}
                      onPress={() => removerArma(arma.id)}
                    >
                      <Text style={styles.btnRemoveText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Seletor Radio: Força vs Destreza */}
                  <View style={styles.radioGroupWrap}>
                    <Text style={styles.radioGroupLabel}>Atributo Chave do Ataque:</Text>
                    <View style={styles.radioOptionsRow}>
                      {/* Opção Força */}
                      <TouchableOpacity
                        style={[
                          styles.radioOptionBtn,
                          !arma.usaDestreza && styles.radioOptionBtnSelected,
                        ]}
                        onPress={selecionarForca}
                        activeOpacity={0.8}
                      >
                        <View style={styles.radioCircleOuter}>
                          {!arma.usaDestreza && <View style={styles.radioCircleInner} />}
                        </View>
                        <View style={styles.radioOptionContent}>
                          <Text
                            style={[
                              styles.radioOptionTitle,
                              !arma.usaDestreza && styles.radioOptionTitleSelected,
                            ]}
                          >
                            Força (FOR)
                          </Text>
                          <Text style={styles.radioOptionSub}>Corpo a corpo padrão</Text>
                        </View>
                        <View
                          style={[
                            styles.radioOptionBadge,
                            !arma.usaDestreza && styles.radioOptionBadgeSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.radioOptionBadgeText,
                              !arma.usaDestreza && styles.radioOptionBadgeTextSelected,
                            ]}
                          >
                            {formatarModificador(modFor)}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Opção Destreza */}
                      <TouchableOpacity
                        style={[
                          styles.radioOptionBtn,
                          arma.usaDestreza && styles.radioOptionBtnSelected,
                        ]}
                        onPress={selecionarDestreza}
                        activeOpacity={0.8}
                      >
                        <View style={styles.radioCircleOuter}>
                          {arma.usaDestreza && <View style={styles.radioCircleInner} />}
                        </View>
                        <View style={styles.radioOptionContent}>
                          <Text
                            style={[
                              styles.radioOptionTitle,
                              arma.usaDestreza && styles.radioOptionTitleSelected,
                            ]}
                          >
                            Destreza (DES)
                          </Text>
                          <Text style={styles.radioOptionSub}>Distância / Acuidade</Text>
                        </View>
                        <View
                          style={[
                            styles.radioOptionBadge,
                            arma.usaDestreza && styles.radioOptionBadgeSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.radioOptionBadgeText,
                              arma.usaDestreza && styles.radioOptionBadgeTextSelected,
                            ]}
                          >
                            {formatarModificador(modDes)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* CARD EXALTADO DO ACERTO TOTAL DA ARMA */}
                  <View style={styles.acertoExaltadoCard}>
                    <View style={styles.acertoExaltadoTop}>
                      <View style={styles.acertoExaltadoIconBadge}>
                        <Text style={styles.acertoExaltadoIcon}>⚔️</Text>
                      </View>
                      <View style={styles.acertoExaltadoTituloCol}>
                        <Text style={styles.acertoExaltadoSubtitulo}>BÔNUS FINAL DE ATAQUE NO D20</Text>
                        <Text style={styles.acertoExaltadoTitulo}>ACERTO TOTAL</Text>
                      </View>
                      <View style={styles.acertoExaltadoValorBadge}>
                        <Text style={styles.acertoExaltadoValor}>
                          {formatarModificador(totalCalculado)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.acertoExaltadoFormulaBox}>
                      <Text style={styles.acertoExaltadoFormula}>
                        BBA ({formatarModificador(bba)}) + {arma.usaDestreza ? 'DES' : 'FOR'} ({formatarModificador(modAtrib)})
                        {bonusTam !== 0 ? ` + Tamanho (${formatarModificador(bonusTam)})` : ''}
                        {outros !== 0 ? ` + Outros (${formatarModificador(outros)})` : ''}
                        {` = ${formatarModificador(totalCalculado)} no Ataque`}
                      </Text>
                    </View>
                  </View>

                  {/* Outros Bônus e Dano */}
                  <View style={styles.row}>
                    <CampoInteiro
                      label="Outros Bônus (Magia / Talentos)"
                      valor={Number(arma.outrosBonus) || 0}
                      onValorChange={atualizarOutrosBonus}
                      min={-99}
                      max={99}
                      style={styles.col}
                    />
                    <CampoTexto
                      label="Dano"
                      value={arma.dano}
                      onChangeText={(v) => atualizarArma({ ...arma, dano: v })}
                      placeholder="Ex: 1d8+4"
                      style={styles.col}
                    />
                  </View>

                  {/* Crítico, Distância e Tipo */}
                  <View style={styles.row}>
                    <CampoTexto
                      label="Crítico"
                      value={arma.critico}
                      onChangeText={(v) =>
                        atualizarArma({ ...arma, critico: v })
                      }
                      placeholder="Ex: 19-20/x2"
                      style={styles.col}
                    />
                    <CampoTexto
                      label="Distância"
                      value={arma.distancia}
                      onChangeText={(v) =>
                        atualizarArma({ ...arma, distancia: v })
                      }
                      placeholder="Ex: — ou 9m"
                      style={styles.col}
                    />
                    <CampoTexto
                      label="Tipo"
                      value={arma.tipoDano}
                      onChangeText={(v) =>
                        atualizarArma({ ...arma, tipoDano: v })
                      }
                      placeholder="Corte"
                      style={styles.col}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* 2. ARMADURAS E ESCUDOS EQUIPADOS (CÁLCULO DA CA) */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Armaduras e Escudos Equipados"
          subtitulo="Seus bônus entram automaticamente no cálculo da CA"
          acaoTexto="Adicionar"
          onAcaoPress={adicionarArmadura}
        />
        <View style={styles.cardBody}>
          <View style={styles.caSummaryBar}>
            <Text style={styles.caSummaryText}>
              Armadura: +{bonusArmadura} | Escudo: +{bonusEscudo}
            </Text>
            <Text style={styles.caSummaryTotal}>CA Atual: {caTotal}</Text>
          </View>

          {ficha.armaduras.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma armadura ou escudo cadastrado. Toque em "+ Adicionar" para incluir.
            </Text>
          ) : (
            ficha.armaduras.map((armadura) => (
              <View key={armadura.id} style={styles.subCard}>
                <View style={styles.armaduraTopRow}>
                  <View style={styles.tipoSelectorRow}>
                    <TouchableOpacity
                      style={[
                        styles.tipoChip,
                        armadura.tipo === 'ARMADURA' && styles.tipoChipSelected,
                      ]}
                      onPress={() =>
                        atualizarArmadura({ ...armadura, tipo: 'ARMADURA' })
                      }
                    >
                      <Text
                        style={[
                          styles.tipoChipText,
                          armadura.tipo === 'ARMADURA' &&
                          styles.tipoChipTextSelected,
                        ]}
                      >
                        Armadura
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tipoChip,
                        armadura.tipo === 'ESCUDO' && styles.tipoChipSelected,
                      ]}
                      onPress={() =>
                        atualizarArmadura({ ...armadura, tipo: 'ESCUDO' })
                      }
                    >
                      <Text
                        style={[
                          styles.tipoChipText,
                          armadura.tipo === 'ESCUDO' &&
                          styles.tipoChipTextSelected,
                        ]}
                      >
                        Escudo
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.equipadaRightRow}>
                    <TouchableOpacity
                      style={styles.equipadaToggle}
                      onPress={() =>
                        atualizarArmadura({
                          ...armadura,
                          equipada: !armadura.equipada,
                        })
                      }
                    >
                      <View
                        style={[
                          styles.checkbox,
                          armadura.equipada && styles.checkboxChecked,
                        ]}
                      >
                        {armadura.equipada && (
                          <Text style={styles.checkMark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.equipadaLabel}>Equipada</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnRemoveSmall}
                      onPress={() => removerArmadura(armadura.id)}
                    >
                      <Text style={styles.btnRemoveText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.row}>
                  <CampoTexto
                    label={
                      armadura.tipo === 'ARMADURA'
                        ? 'Nome da Armadura'
                        : 'Nome do Escudo'
                    }
                    value={armadura.nome}
                    onChangeText={(v) =>
                      atualizarArmadura({ ...armadura, nome: v })
                    }
                    placeholder={
                      armadura.tipo === 'ARMADURA'
                        ? 'Ex: Cota de Malha'
                        : 'Ex: Escudo Pesado'
                    }
                    style={styles.colWide}
                  />
                  <CampoInteiro
                    label="Bônus na CA"
                    valor={armadura.bonusCa}
                    onValorChange={(v) =>
                      atualizarArmadura({ ...armadura, bonusCa: v })
                    }
                    min={0}
                    max={50}
                    style={styles.colSmall}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* 3. OUTROS EQUIPAMENTOS E TIBARES */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Mochila e Tibares"
          subtitulo="Itens gerais, consumíveis e dinheiro"
          acaoTexto="Item"
          onAcaoPress={adicionarItemGeral}
        />
        <View style={styles.cardBody}>
          <CampoTexto
            label="Tibares / Riqueza (TO, TP, TC)"
            value={ficha.tibares}
            onChangeText={(v) => onChange({ ...ficha, tibares: v })}
            placeholder="Ex: 150 TO, 20 TP, 5 TC"
          />

          {ficha.itensGerais.map((item) => (
            <View key={item.id} style={styles.rowTop}>
              <CampoTexto
                label="Item"
                value={item.nome}
                onChangeText={(v) => atualizarItemGeral({ ...item, nome: v })}
                style={styles.colWide}
              />
              <CampoTexto
                label="Qtd"
                value={item.quantidade}
                onChangeText={(v) =>
                  atualizarItemGeral({ ...item, quantidade: v })
                }
                style={styles.colSmall}
              />
              <TouchableOpacity
                style={styles.btnRemove}
                onPress={() => removerItemGeral(item.id)}
              >
                <Text style={styles.btnRemoveText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Modal do Compêndio */}
      <CompendioModal
        visivel={compendioAberto}
        onFechar={() => setCompendioAberto(false)}
        abaInicial="equipamentos"
        fichaAtual={ficha}
        onAdicionarEquipamentoAFicha={handleAdicionarEquipamentoCompendio}
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
  compendioBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  compendioBannerTextCol: {
    flex: 1,
  },
  compendioBannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  compendioBannerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  btnCompendioEquip: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnCompendioEquipText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardBody: {
    padding: 12,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  subCard: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  col: {
    flex: 1,
  },
  colFlex: {
    flex: 1,
  },
  colWide: {
    flex: 1.7,
  },
  colSmall: {
    flex: 0.8,
  },
  btnRemove: {
    marginTop: 14,
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(179,38,30,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRemoveSmall: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'rgba(179,38,30,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  btnRemoveText: {
    color: COLORS.danger,
    fontWeight: 'bold',
    fontSize: 14,
  },
  caSummaryBar: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caSummaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  caSummaryTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  armaduraTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tipoSelectorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tipoChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tipoChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tipoChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tipoChipTextSelected: {
    color: COLORS.white,
  },
  equipadaRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equipadaToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkMark: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  equipadaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  // Radio Buttons Força vs Destreza
  radioGroupWrap: {
    marginTop: 8,
    marginBottom: 4,
  },
  radioGroupLabel: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  radioOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  radioOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 6,
  },
  radioOptionBtnSelected: {
    backgroundColor: '#FFF9ED',
    borderColor: COLORS.gold,
  },
  radioCircleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioOptionContent: {
    flex: 1,
  },
  radioOptionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  radioOptionTitleSelected: {
    color: COLORS.primaryDark,
  },
  radioOptionSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  radioOptionBadge: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  radioOptionBadgeSelected: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  radioOptionBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  radioOptionBadgeTextSelected: {
    color: '#3B2900',
  },

  // Acerto Exaltado Card
  acertoExaltadoCard: {
    backgroundColor: '#FFFDF5',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: COLORS.gold,
    elevation: 2,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  acertoExaltadoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  acertoExaltadoIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(200, 157, 60, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  acertoExaltadoIcon: {
    fontSize: 20,
  },
  acertoExaltadoTituloCol: {
    flex: 1,
  },
  acertoExaltadoSubtitulo: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#8A6414',
    letterSpacing: 0.5,
  },
  acertoExaltadoTitulo: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  acertoExaltadoValorBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    minWidth: 64,
    alignItems: 'center',
  },
  acertoExaltadoValor: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
  },
  acertoExaltadoFormulaBox: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200, 157, 60, 0.3)',
  },
  acertoExaltadoFormula: {
    fontSize: 11,
    fontWeight: '600',
    color: '#654B0E',
    textAlign: 'center',
  },
});

