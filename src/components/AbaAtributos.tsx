import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  ATRIBUTOS_LISTA,
  calcularCaTotal,
  calcularModificador,
  calcularResistencia,
  contarBuffsAtivos,
  FichaPersonagem,
  formatarModificador,
  obterBonusArmaduraEquipada,
  obterBonusEscudoEquipado,
  obterBuffsTemporarios,
  obterBbaTotal,
  obterMeioNivel,
  obterModAtributo,
  obterPvMaxEfetivo,
  obterPmMaxEfetivo,
  temBuffsAtivos,
} from '../models/ficha';
import { calcularSugestoesClasses } from '../data';
import { COLORS } from '../theme/colors';
import { BarraDeProgressoRecurso } from './BarraDeProgressoRecurso';
import { CampoInteiro, SecaoHeader, StepperValor } from './CommonInput';
import { ModalBuffsTemporarios } from './ModalBuffsTemporarios';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaAtributos: React.FC<Props> = ({ ficha, onChange }) => {
  const [modalBuffsAberto, setModalBuffsAberto] = useState(false);

  const buffs = obterBuffsTemporarios(ficha);
  const temBuffs = temBuffsAtivos(ficha);
  const qtdBuffs = contarBuffsAtivos(ficha);

  const sugestao = React.useMemo(() => calcularSugestoesClasses(ficha), [ficha]);

  const pvMaxEfetivo = obterPvMaxEfetivo(ficha);
  const pmMaxEfetivo = obterPmMaxEfetivo(ficha);

  const meioNivel = obterMeioNivel(ficha.nivel);
  const modDes = obterModAtributo(ficha, 'DES');
  const modCon = obterModAtributo(ficha, 'CON');
  const modSab = obterModAtributo(ficha, 'SAB');
  const bonusArmadura = obterBonusArmaduraEquipada(ficha);
  const bonusEscudo = obterBonusEscudoEquipado(ficha);
  const caTotal = calcularCaTotal(ficha);

  const fortOutros = Number(ficha.fortitudeOutros) || 0;
  const refOutros = Number(ficha.reflexosOutros) || 0;
  const vonOutros = Number(ficha.vontadeOutros) || 0;

  const fortTotal = calcularResistencia(ficha, 'fortitude');
  const refTotal = calcularResistencia(ficha, 'reflexos');
  const vonTotal = calcularResistencia(ficha, 'vontade');

  const handleDescansoPleno = () => {
    onChange({
      ...ficha,
      pvAtual: ficha.pvTotal,
      pmAtual: ficha.pmTotal,
      peAtual: ficha.peTotal ?? 0,
      pontosAcao: 1,
      buffsTemporarios: {
        forca: 0,
        destreza: 0,
        constituicao: 0,
        inteligencia: 0,
        sabedoria: 0,
        carisma: 0,
        fortitude: 0,
        reflexos: 0,
        vontade: 0,
        ca: 0,
        pvTemporario: 0,
        pvMax: 0,
        pmMax: 0,
      },
    });
    Alert.alert(
      'Resetar Atributos',
      'Todos os seus recursos atuais (PV, PM, PE e Pontos de Ação) foram restaurados aos valores padrão e todos os buffs temporários foram zerados!'
    );
  };

  const resistencias = [
    {
      chave: 'fortitudeOutros' as const,
      chaveBuff: 'fortitude' as const,
      nome: 'Fortitude',
      atrib: 'CON',
      mod: modCon,
      outros: fortOutros,
      buff: buffs.fortitude,
      total: fortTotal,
    },
    {
      chave: 'reflexosOutros' as const,
      chaveBuff: 'reflexos' as const,
      nome: 'Reflexos',
      atrib: 'DES',
      mod: modDes,
      outros: refOutros,
      buff: buffs.reflexos,
      total: refTotal,
    },
    {
      chave: 'vontadeOutros' as const,
      chaveBuff: 'vontade' as const,
      nome: 'Vontade',
      atrib: 'SAB',
      mod: modSab,
      outros: vonOutros,
      buff: buffs.vontade,
      total: vonTotal,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* BANNER DE ACESSO AOS BUFFS TEMPORÁRIOS */}
      <TouchableOpacity
        style={[styles.bannerBuffs, temBuffs && styles.bannerBuffsAtivo]}
        onPress={() => setModalBuffsAberto(true)}
        activeOpacity={0.8}
        accessibilityLabel="Gerenciar Buffs e Efeitos Temporários"
      >
        <View style={styles.bannerBuffsLeft}>
          <Text style={styles.bannerBuffsIcon}>⚡</Text>
          <View style={styles.bannerBuffsTextCol}>
            <View style={styles.bannerBuffsTitleRow}>
              <Text style={styles.bannerBuffsTitle}>Buffs & Efeitos Temporários</Text>
              {temBuffs && (
                <View style={styles.badgeBuffsContador}>
                  <Text style={styles.badgeBuffsContadorText}>{qtdBuffs} ATIVO(S)</Text>
                </View>
              )}
            </View>
            <Text style={styles.bannerBuffsSubtitle}>
              {temBuffs
                ? 'Toque para visualizar ou editar bônus temporários'
                : 'Toque para adicionar bônus temporários de atributos, resistências ou PV'}
            </Text>
          </View>
        </View>
        <Text style={styles.bannerBuffsActionText}>Configurar ❯</Text>
      </TouchableOpacity>

      {/* 2. PONTOS DE VIDA, MAGIA, BBA, CA E RESISTÊNCIAS */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Combate & Resistências"
          subtitulo="PV, PM, BBA, Classe de Armadura (CA) e Testes de Resistência"
        />
        <View style={styles.cardBody}>
          <TouchableOpacity
            style={styles.btnResetarAtributos}
            onPress={handleDescansoPleno}
            activeOpacity={0.8}
            accessibilityLabel="Resetar Atributos"
          >
            <Text style={styles.btnResetarAtributosIcon}>🔄</Text>
            <View style={styles.btnResetarAtributosTextCol}>
              <Text style={styles.btnResetarAtributosText}>Resetar Atributos</Text>
              <Text style={styles.btnResetarAtributosSub}>
                Restaura PV, PM, PE, PA e zera buffs temporários
              </Text>
            </View>
          </TouchableOpacity>

          {/* PV - Vermelho */}
          <View style={[styles.statusSubBox, styles.statusSubBoxPv]}>
            <View style={styles.statusHeaderRow}>
              <Text style={[styles.statusGroupTitle, styles.statusTitlePv]}>❤️ PONTOS DE VIDA (PV)</Text>
              <Text style={[styles.statusValDestaque, { color: '#C62828' }]}>
                {ficha.pvAtual}
                {buffs.pvTemporario > 0 ? ` (+${buffs.pvTemporario} temp)` : ''} / {pvMaxEfetivo}
                {buffs.pvMax !== 0 ? ` (${formatarModificador(buffs.pvMax)} buff)` : ''}
              </Text>
            </View>
            <BarraDeProgressoRecurso
              atual={ficha.pvAtual}
              max={pvMaxEfetivo}
              cor="#C62828"
              corFundo="rgba(198,40,40,0.12)"
              unidade="PV"
            />
            {buffs.pvMax !== 0 && (
              <View style={styles.pvMaxBuffBadge}>
                <Text style={styles.pvMaxBuffBadgeText}>
                  ✨ {formatarModificador(buffs.pvMax)} PV Máximo temporário ativo (Base: {ficha.pvTotal} → Máx: {pvMaxEfetivo})
                </Text>
              </View>
            )}
            {buffs.pvTemporario > 0 && (
              <View style={styles.pvTempBadge}>
                <Text style={styles.pvTempBadgeText}>
                  🛡️ +{buffs.pvTemporario} PV Temporário ativo (absorve dano antes do PV real)
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <CampoInteiro
                label="PV Atuais"
                valor={ficha.pvAtual}
                onValorChange={(v) => onChange({ ...ficha, pvAtual: v })}
                min={-999}
                max={9999}
                comStepper
                style={styles.colDestaque}
              />
              <CampoInteiro
                label="Bônus"
                valor={Number(ficha.pvBonus) || 0}
                onValorChange={(novoBonus) => {
                  const antigoBonus = Number(ficha.pvBonus) || 0;
                  const delta = novoBonus - antigoBonus;
                  const novoTotal = Math.max(1, (ficha.pvTotal || 10) + delta);
                  const novoAtual =
                    ficha.pvAtual === ficha.pvTotal
                      ? novoTotal
                      : Math.max(0, ficha.pvAtual + delta);
                  onChange({
                    ...ficha,
                    pvBonus: novoBonus,
                    pvTotal: novoTotal,
                    pvAtual: novoAtual,
                  });
                }}
                min={-999}
                max={9999}
                style={styles.colSmall}
              />
              <CampoInteiro
                label="PV Totais"
                valor={ficha.pvTotal}
                onValorChange={(v) => onChange({ ...ficha, pvTotal: v })}
                min={1}
                max={9999}
                comStepper
                style={styles.colDestaque}
              />
            </View>
            {sugestao && (() => {
              const pvBonus = Number(ficha.pvBonus) || 0;
              const pvTotalSugerido = Math.max(1, sugestao.pvTotal + pvBonus);
              const explicacaoFormatada =
                pvBonus !== 0
                  ? `${sugestao.explicacaoPv} + ${pvBonus > 0 ? `+${pvBonus}` : pvBonus} bônus`
                  : sugestao.explicacaoPv;

              return (
                <View style={styles.sugestaoRow}>
                  <Text style={styles.sugestaoTexto} numberOfLines={2}>
                    💡 Sugerido por classe: <Text style={styles.sugestaoValor}>{pvTotalSugerido} PV</Text>{' '}
                    ({explicacaoFormatada})
                  </Text>
                  {ficha.pvTotal !== pvTotalSugerido && (
                    <TouchableOpacity
                      style={styles.btnAplicarSugestao}
                      onPress={() =>
                        onChange({
                          ...ficha,
                          pvTotal: pvTotalSugerido,
                          pvAtual:
                            ficha.pvAtual === ficha.pvTotal
                              ? pvTotalSugerido
                              : Math.min(ficha.pvAtual, pvTotalSugerido),
                        })
                      }
                    >
                      <Text style={styles.btnAplicarSugestaoTexto}>Aplicar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })()}
          </View>

          {/* PM - Azul */}
          <View style={[styles.statusSubBox, styles.statusSubBoxPm]}>
            <View style={styles.statusHeaderRow}>
              <Text style={[styles.statusGroupTitle, styles.statusTitlePm]}>✨ PONTOS DE MAGIA (PM)</Text>
              <Text style={[styles.statusValDestaque, { color: '#1565C0' }]}>
                {ficha.pmAtual} / {pmMaxEfetivo}
                {buffs.pmMax !== 0 ? ` (${formatarModificador(buffs.pmMax)} buff)` : ''}
              </Text>
            </View>
            <BarraDeProgressoRecurso
              atual={ficha.pmAtual}
              max={pmMaxEfetivo}
              cor="#1565C0"
              corFundo="rgba(21,101,192,0.12)"
              unidade="PM"
            />
            {buffs.pmMax !== 0 && (
              <View style={styles.pmMaxBuffBadge}>
                <Text style={styles.pmMaxBuffBadgeText}>
                  ✨ {formatarModificador(buffs.pmMax)} PM Máximo temporário ativo (Base: {ficha.pmTotal} → Máx: {pmMaxEfetivo})
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <CampoInteiro
                label="PM Atuais"
                valor={ficha.pmAtual}
                onValorChange={(v) => onChange({ ...ficha, pmAtual: v })}
                min={0}
                max={9999}
                comStepper
                style={styles.colDestaque}
              />
              <CampoInteiro
                label="Bônus"
                valor={Number(ficha.pmBonus) || 0}
                onValorChange={(novoBonus) => {
                  const antigoBonus = Number(ficha.pmBonus) || 0;
                  const delta = novoBonus - antigoBonus;
                  const novoTotal = Math.max(0, (ficha.pmTotal || 0) + delta);
                  const novoAtual =
                    ficha.pmAtual === ficha.pmTotal
                      ? novoTotal
                      : Math.max(0, ficha.pmAtual + delta);
                  onChange({
                    ...ficha,
                    pmBonus: novoBonus,
                    pmTotal: novoTotal,
                    pmAtual: novoAtual,
                  });
                }}
                min={-999}
                max={9999}
                style={styles.colSmall}
              />
              <CampoInteiro
                label="PM Totais"
                valor={ficha.pmTotal}
                onValorChange={(v) => onChange({ ...ficha, pmTotal: v })}
                min={0}
                max={9999}
                comStepper
                style={styles.colDestaque}
              />
            </View>
            {sugestao && (() => {
              const pmBonus = Number(ficha.pmBonus) || 0;
              const pmTotalSugerido = Math.max(0, sugestao.pmTotal + pmBonus);
              const explicacaoFormatada =
                pmBonus !== 0
                  ? `${sugestao.explicacaoPm} + ${pmBonus > 0 ? `+${pmBonus}` : pmBonus} bônus`
                  : sugestao.explicacaoPm;

              return (
                <View style={styles.sugestaoRow}>
                  <Text style={styles.sugestaoTexto} numberOfLines={2}>
                    💡 Sugerido por classe: <Text style={styles.sugestaoValor}>{pmTotalSugerido} PM</Text>{' '}
                    ({explicacaoFormatada})
                  </Text>
                  {ficha.pmTotal !== pmTotalSugerido && (
                    <TouchableOpacity
                      style={styles.btnAplicarSugestao}
                      onPress={() =>
                        onChange({
                          ...ficha,
                          pmTotal: pmTotalSugerido,
                          pmAtual:
                            ficha.pmAtual === ficha.pmTotal
                              ? pmTotalSugerido
                              : Math.min(ficha.pmAtual, pmTotalSugerido),
                        })
                      }
                    >
                      <Text style={styles.btnAplicarSugestaoTexto}>Aplicar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })()}
          </View>

          {/* PE - Amarelo */}
          <View style={[styles.statusSubBox, styles.statusSubBoxPe]}>
            <View style={styles.statusHeaderRow}>
              <Text style={[styles.statusGroupTitle, styles.statusTitlePe]}>⚡ PONTOS DE ENERGIA (PE)</Text>
              <Text style={[styles.statusValDestaque, { color: '#E69500' }]}>
                {ficha.peAtual ?? 0} / {ficha.peTotal ?? 0}
              </Text>
            </View>
            <BarraDeProgressoRecurso
              atual={ficha.peAtual ?? 0}
              max={ficha.peTotal ?? 0}
              cor="#E69500"
              corFundo="rgba(230,149,0,0.14)"
              unidade="PE"
            />
            <View style={styles.row}>
              <CampoInteiro
                label="PE Atuais"
                valor={ficha.peAtual ?? 0}
                onValorChange={(v) => onChange({ ...ficha, peAtual: v })}
                min={0}
                max={9999}
                comStepper
                style={styles.col}
              />
              <CampoInteiro
                label="PE Totais"
                valor={ficha.peTotal ?? 0}
                onValorChange={(v) => onChange({ ...ficha, peTotal: v })}
                min={0}
                max={9999}
                comStepper
                style={styles.col}
              />
            </View>
          </View>

          {/* PONTOS DE AÇÃO (PA) */}
          <View style={styles.statusSubBox}>
            <Text style={styles.statusGroupTitle}>PONTOS DE AÇÃO (PA)</Text>
            <View style={styles.row}>
              <CampoInteiro
                label="Pontos de Ação Disponíveis"
                valor={ficha.pontosAcao ?? 1}
                onValorChange={(v) => onChange({ ...ficha, pontosAcao: Math.max(0, v) })}
                min={0}
                max={99}
                style={styles.col}
              />
            </View>
            <Text style={styles.helperText}>
              Inicia cada sessão com 1 PA. Permite dados extras no d20, bônus na CA, ação extra ou cura rápida.
            </Text>
          </View>

          {/* BBA */}
          <View style={styles.row}>
            <CampoInteiro
              label="BBA (Base)"
              valor={ficha.bba}
              onValorChange={(v) => onChange({ ...ficha, bba: v })}
              min={-20}
              max={99}
              style={styles.col}
            />
            <CampoInteiro
              label="Outros (BBA)"
              valor={Number(ficha.bbaOutros) || 0}
              onValorChange={(v) => onChange({ ...ficha, bbaOutros: v })}
              min={-99}
              max={99}
              style={styles.col}
            />
            <View style={[styles.col, styles.bbaTotalCol]}>
              <Text style={styles.bbaTotalLabel}>BBA TOTAL</Text>
              <View style={styles.bbaTotalBadge}>
                <Text style={styles.bbaTotalText}>
                  {formatarModificador(obterBbaTotal(ficha))}
                </Text>
              </View>
            </View>
          </View>
          {sugestao && (
            <View style={styles.sugestaoRow}>
              <Text style={styles.sugestaoTexto} numberOfLines={2}>
                💡 Sugerido por classe: <Text style={styles.sugestaoValor}>+{sugestao.bba}</Text> ({sugestao.explicacaoBba})
              </Text>
              {ficha.bba !== sugestao.bba && (
                <TouchableOpacity
                  style={styles.btnAplicarSugestao}
                  onPress={() => onChange({ ...ficha, bba: sugestao.bba })}
                >
                  <Text style={styles.btnAplicarSugestaoTexto}>Aplicar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <Text style={styles.helperText}>
            Metade do Nível (1/2 nível) = +{meioNivel}
          </Text>

          <View style={styles.sectionDivider} />

          {/* CLASSE DE ARMADURA (CA) */}
          <Text style={styles.subSectionHeaderTitle}>CLASSE DE ARMADURA (CA)</Text>
          <View style={styles.caBanner}>
            <View style={styles.caBannerLeft}>
              <Text style={styles.caBannerTitle}>CA TOTAL</Text>
              <Text style={styles.caFormulaText}>
                10 + {meioNivel} (1/2 Nív) + {modDes} (DES) + {bonusArmadura} (Arm.) +{' '}
                {bonusEscudo} (Esc.) + {ficha.caBonusTamanho} (Tam.) + {ficha.caOutrosBonus}{' '}
                (Outros)
              </Text>
            </View>
            <View style={styles.caTotalBadge}>
              <Text style={styles.caTotalText}>{caTotal}</Text>
            </View>
          </View>

          <View style={styles.caPillsRow}>
            <View style={styles.caPill}>
              <Text style={styles.caPillLabel}>Base</Text>
              <Text style={styles.caPillValue}>10</Text>
            </View>
            <View style={styles.caPill}>
              <Text style={styles.caPillLabel}>1/2 Nív</Text>
              <Text style={styles.caPillValue}>+{meioNivel}</Text>
            </View>
            <View style={styles.caPill}>
              <Text style={styles.caPillLabel}>Mod DES</Text>
              <Text style={styles.caPillValue}>{formatarModificador(modDes)}</Text>
            </View>
            <View style={styles.caPill}>
              <Text style={styles.caPillLabel}>Armadura</Text>
              <Text style={styles.caPillValue}>+{bonusArmadura}</Text>
            </View>
            <View style={styles.caPill}>
              <Text style={styles.caPillLabel}>Escudo</Text>
              <Text style={styles.caPillValue}>+{bonusEscudo}</Text>
            </View>
            {buffs.ca !== 0 && (
              <View style={[styles.caPill, styles.caPillBuff]}>
                <Text style={[styles.caPillLabel, { color: '#2E6B3E' }]}>Buff CA</Text>
                <Text style={[styles.caPillValue, { color: '#2E6B3E', fontWeight: 'bold' }]}>
                  {formatarModificador(buffs.ca)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.row}>
            <CampoInteiro
              label="Bônus de Tamanho (CA)"
              valor={ficha.caBonusTamanho}
              onValorChange={(v) => onChange({ ...ficha, caBonusTamanho: v })}
              min={-20}
              max={20}
              style={styles.col}
            />
            <CampoInteiro
              label="Outros Bônus (CA)"
              valor={ficha.caOutrosBonus}
              onValorChange={(v) => onChange({ ...ficha, caOutrosBonus: v })}
              min={-50}
              max={99}
              style={styles.col}
            />
          </View>

          <View style={styles.sectionDivider} />

          {/* RESISTÊNCIAS */}
          <Text style={styles.subSectionHeaderTitle}>
            RESISTÊNCIAS (1/2 NÍVEL + MOD. HABILIDADE + OUTROS)
          </Text>

          <View style={styles.resTable}>
            <View style={styles.resHeaderRow}>
              <Text style={[styles.resTh, styles.resColNome]}>Resistência</Text>
              <Text style={[styles.resTh, styles.resColNum]}>1/2 Nív</Text>
              <Text style={[styles.resTh, styles.resColNum]}>Mod.</Text>
              <Text style={[styles.resTh, styles.resColOutros]}>Outros</Text>
              <Text style={[styles.resTh, styles.resColTotal]}>Total</Text>
            </View>

            {resistencias.map((res, idx) => (
              <View
                key={res.chave}
                style={[
                  styles.resRow,
                  idx < resistencias.length - 1 && styles.atributoDivider,
                ]}
              >
                <View style={styles.resColNome}>
                  <Text style={styles.resNomeText}>{res.nome}</Text>
                  <Text style={styles.resAtribText}>{res.atrib}</Text>
                </View>

                <Text style={[styles.resCellText, styles.resColNum]}>
                  +{meioNivel}
                </Text>

                <Text style={[styles.resCellText, styles.resColNum]}>
                  {formatarModificador(res.mod)}
                </Text>

                <View style={styles.resColOutros}>
                  <CampoInteiro
                    valor={res.outros}
                    onValorChange={(novo) =>
                      onChange({ ...ficha, [res.chave]: novo })
                    }
                    min={-99}
                    max={99}
                    compact
                  />
                  {res.buff !== 0 && (
                    <Text style={styles.resBuffNota}>
                      {formatarModificador(res.buff)} temp
                    </Text>
                  )}
                </View>

                <View style={[styles.resTotalBadge, res.buff !== 0 && styles.resTotalBadgeBuff]}>
                  <Text style={styles.resTotalText}>
                    {formatarModificador(res.total)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 1. ATRIBUTOS BÁSICOS E MODIFICADORES */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Atributos Básicos"
          subtitulo="Valores de atributos e seus respectivos modificadores"
        />
        <View style={styles.cardBody}>
          {ATRIBUTOS_LISTA.map((atrib, idx) => {
            const valorBase = ficha[atrib.campo];
            const buff = buffs[atrib.campo];
            const valorTotal = valorBase + buff;
            const modTotal = calcularModificador(valorTotal);
            const temBuff = buff !== 0;

            return (
              <View
                key={atrib.sigla}
                style={[
                  styles.atributoRow,
                  idx < ATRIBUTOS_LISTA.length - 1 && styles.atributoDivider,
                ]}
              >
                <View style={styles.atributoLabelCol}>
                  <Text style={styles.atributoSigla}>{atrib.sigla}</Text>
                  <Text style={styles.atributoNome}>{atrib.nome}</Text>
                  {temBuff && (
                    <Text style={styles.atributoBaseNota}>Base: {valorBase}</Text>
                  )}
                </View>

                <StepperValor
                  valor={valorBase}
                  onValorChange={(novo) => onChange({ ...ficha, [atrib.campo]: novo })}
                  min={1}
                  max={50}
                />

                <View style={[styles.modBadge, temBuff && styles.modBadgeAtivo]}>
                  {temBuff ? (
                    <>
                      <Text style={styles.modBadgeLabelTotal}>
                        TOTAL {valorTotal} ({formatarModificador(buff)})
                      </Text>
                      <Text style={styles.modBadgeValue}>{formatarModificador(modTotal)}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.modBadgeLabel}>MOD</Text>
                      <Text style={styles.modBadgeValue}>{formatarModificador(modTotal)}</Text>
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <ModalBuffsTemporarios
        visivel={modalBuffsAberto}
        ficha={ficha}
        onChange={onChange}
        onFechar={() => setModalBuffsAberto(false)}
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
  cardBody: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  col: {
    flex: 1,
  },
  colWide: {
    flex: 1.6,
  },
  colSmall: {
    flex: 0.8,
  },
  atributoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  atributoDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceVariant,
  },
  atributoLabelCol: {
    flex: 1,
  },
  atributoSigla: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  atributoNome: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  modBadge: {
    width: 62,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  modBadgeLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
  },
  modBadgeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statusSubBox: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusSubBoxPv: {
    borderLeftWidth: 4,
    borderLeftColor: '#C62828',
    backgroundColor: 'rgba(198,40,40,0.04)',
  },
  statusSubBoxPm: {
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
    backgroundColor: 'rgba(21,101,192,0.04)',
  },
  statusSubBoxPe: {
    borderLeftWidth: 4,
    borderLeftColor: '#E69500',
    backgroundColor: 'rgba(230,149,0,0.05)',
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusGroupTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusTitlePv: {
    color: '#C62828',
  },
  statusTitlePm: {
    color: '#1565C0',
  },
  statusTitlePe: {
    color: '#D87A00',
  },
  statusValDestaque: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  btnResetarAtributos: {
    backgroundColor: '#FDFBF7',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  btnResetarAtributosIcon: {
    fontSize: 20,
  },
  btnResetarAtributosTextCol: {
    alignItems: 'center',
  },
  btnResetarAtributosText: {
    color: COLORS.primaryDark,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  btnResetarAtributosSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  caPillBuff: {
    backgroundColor: 'rgba(46, 107, 62, 0.12)',
    borderColor: '#2E6B3E',
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
    marginBottom: 4,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  subSectionHeaderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  caBanner: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  caBannerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  caBannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  caFormulaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  caTotalBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  caTotalText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  caPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 4,
  },
  caPill: {
    flex: 1,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  caPillLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  caPillValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  resTable: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  resHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resTh: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  resRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  resColNome: {
    flex: 1,
    textAlign: 'left',
  },
  resColNum: {
    width: 44,
    textAlign: 'center',
  },
  resColOutros: {
    width: 64,
    paddingHorizontal: 4,
  },
  resColTotal: {
    width: 52,
    textAlign: 'center',
  },
  resNomeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  resAtribText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  resCellText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  resTotalBadge: {
    width: 48,
    marginLeft: 4,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resTotalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  bannerBuffs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bannerBuffsAtivo: {
    backgroundColor: 'rgba(200, 157, 60, 0.12)',
    borderColor: COLORS.gold,
    borderWidth: 1.5,
  },
  bannerBuffsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  bannerBuffsIcon: {
    fontSize: 22,
  },
  bannerBuffsTextCol: {
    flex: 1,
  },
  bannerBuffsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerBuffsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  bannerBuffsSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  badgeBuffsContador: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeBuffsContadorText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  bannerBuffsActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
  atributoBaseNota: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  modBadgeAtivo: {
    backgroundColor: 'rgba(46, 107, 62, 0.12)',
    borderColor: 'rgba(46, 107, 62, 0.4)',
    borderWidth: 1,
  },
  modBadgeLabelTotal: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#2E6B3E',
  },
  pvMaxBuffBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(198, 40, 40, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(198, 40, 40, 0.25)',
    padding: 6,
    borderRadius: 6,
  },
  pvMaxBuffBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C62828',
    textAlign: 'center',
  },
  pmMaxBuffBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(21, 101, 192, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(21, 101, 192, 0.25)',
    padding: 6,
    borderRadius: 6,
  },
  pmMaxBuffBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1565C0',
    textAlign: 'center',
  },
  pvTempBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(198, 40, 40, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(198, 40, 40, 0.25)',
    padding: 6,
    borderRadius: 6,
  },
  pvTempBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C62828',
    textAlign: 'center',
  },
  resBuffNota: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#2E6B3E',
    marginTop: 2,
    textAlign: 'center',
  },
  resTotalBadgeBuff: {
    backgroundColor: 'rgba(46, 107, 62, 0.2)',
    borderColor: 'rgba(46, 107, 62, 0.4)',
    borderWidth: 1,
  },
  sugestaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 6,
    gap: 8,
  },
  sugestaoTexto: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  sugestaoValor: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  btnAplicarSugestao: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  colDestaque: {
    flex: 1.25,
  },
  bbaTotalCol: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  bbaTotalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  bbaTotalBadge: {
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    minWidth: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bbaTotalText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  btnAplicarSugestaoTexto: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

