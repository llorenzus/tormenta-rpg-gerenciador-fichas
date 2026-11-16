import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  ATRIBUTOS_LISTA,
  calcularCaTotal,
  calcularModificador,
  FichaPersonagem,
  formatarModificador,
  obterBonusArmaduraEquipada,
  obterBonusEscudoEquipado,
  obterMeioNivel,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { BarraDeProgressoRecurso } from './BarraDeProgressoRecurso';
import { CampoInteiro, SecaoHeader, StepperValor } from './CommonInput';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaAtributos: React.FC<Props> = ({ ficha, onChange }) => {
  const meioNivel = obterMeioNivel(ficha.nivel);
  const modDes = calcularModificador(ficha.destreza);
  const modCon = calcularModificador(ficha.constituicao);
  const modSab = calcularModificador(ficha.sabedoria);
  const bonusArmadura = obterBonusArmaduraEquipada(ficha);
  const bonusEscudo = obterBonusEscudoEquipado(ficha);
  const caTotal = calcularCaTotal(ficha);

  const fortOutros = Number(ficha.fortitudeOutros) || 0;
  const refOutros = Number(ficha.reflexosOutros) || 0;
  const vonOutros = Number(ficha.vontadeOutros) || 0;

  const fortTotal = meioNivel + modCon + fortOutros;
  const refTotal = meioNivel + modDes + refOutros;
  const vonTotal = meioNivel + modSab + vonOutros;

  const handleDescansoPleno = () => {
    onChange({
      ...ficha,
      pvAtual: ficha.pvTotal,
      pmAtual: ficha.pmTotal,
      peAtual: ficha.peTotal ?? 0,
      pontosAcao: 1,
    });
    Alert.alert(
      'Descanso Pleno',
      'Todos os seus recursos atuais (PV, PM, PE e Pontos de Ação) foram restaurados aos valores padrão!'
    );
  };

  const resistencias = [
    {
      chave: 'fortitudeOutros' as const,
      nome: 'Fortitude',
      atrib: 'CON',
      mod: modCon,
      outros: fortOutros,
      total: fortTotal,
    },
    {
      chave: 'reflexosOutros' as const,
      nome: 'Reflexos',
      atrib: 'DES',
      mod: modDes,
      outros: refOutros,
      total: refTotal,
    },
    {
      chave: 'vontadeOutros' as const,
      nome: 'Vontade',
      atrib: 'SAB',
      mod: modSab,
      outros: vonOutros,
      total: vonTotal,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. ATRIBUTOS BÁSICOS E MODIFICADORES */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Atributos Básicos"
          subtitulo="Valores de atributos e seus respectivos modificadores"
        />
        <View style={styles.cardBody}>
          {ATRIBUTOS_LISTA.map((atrib, idx) => {
            const valor = ficha[atrib.campo];
            const mod = calcularModificador(valor);
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
                </View>

                <StepperValor
                  valor={valor}
                  onValorChange={(novo) => onChange({ ...ficha, [atrib.campo]: novo })}
                  min={1}
                  max={50}
                />

                <View style={styles.modBadge}>
                  <Text style={styles.modBadgeLabel}>MOD</Text>
                  <Text style={styles.modBadgeValue}>{formatarModificador(mod)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* 2. PONTOS DE VIDA, MAGIA, BBA, CA E RESISTÊNCIAS */}
      <View style={styles.card}>
        <SecaoHeader
          titulo="Combate & Resistências"
          subtitulo="PV, PM, BBA, Classe de Armadura (CA) e Testes de Resistência"
        />
        <View style={styles.cardBody}>
          <TouchableOpacity
            style={styles.btnDescansoPleno}
            onPress={handleDescansoPleno}
            activeOpacity={0.85}
          >
            <Text style={styles.btnDescansoPlenoText}>Descanso Pleno</Text>
            <Text style={styles.btnDescansoPlenoSub}>
              Recuperar PV, PM e PE atuais para os valores máximos
            </Text>
          </TouchableOpacity>

          {/* PV - Vermelho */}
          <View style={[styles.statusSubBox, styles.statusSubBoxPv]}>
            <View style={styles.statusHeaderRow}>
              <Text style={[styles.statusGroupTitle, styles.statusTitlePv]}>❤️ PONTOS DE VIDA (PV)</Text>
              <Text style={[styles.statusValDestaque, { color: '#C62828' }]}>
                {ficha.pvAtual} / {ficha.pvTotal}
              </Text>
            </View>
            <BarraDeProgressoRecurso
              atual={ficha.pvAtual}
              max={ficha.pvTotal}
              cor="#C62828"
              corFundo="rgba(198,40,40,0.12)"
              unidade="PV"
            />
            <View style={styles.row}>
              <CampoInteiro
                label="PV Atuais"
                valor={ficha.pvAtual}
                onValorChange={(v) => onChange({ ...ficha, pvAtual: v })}
                min={-999}
                max={9999}
                style={styles.col}
              />
              <CampoInteiro
                label="PV Totais"
                valor={ficha.pvTotal}
                onValorChange={(v) => onChange({ ...ficha, pvTotal: v })}
                min={1}
                max={9999}
                style={styles.col}
              />
            </View>
          </View>

          {/* PM - Azul */}
          <View style={[styles.statusSubBox, styles.statusSubBoxPm]}>
            <View style={styles.statusHeaderRow}>
              <Text style={[styles.statusGroupTitle, styles.statusTitlePm]}>✨ PONTOS DE MAGIA (PM)</Text>
              <Text style={[styles.statusValDestaque, { color: '#1565C0' }]}>
                {ficha.pmAtual} / {ficha.pmTotal}
              </Text>
            </View>
            <BarraDeProgressoRecurso
              atual={ficha.pmAtual}
              max={ficha.pmTotal}
              cor="#1565C0"
              corFundo="rgba(21,101,192,0.12)"
              unidade="PM"
            />
            <View style={styles.row}>
              <CampoInteiro
                label="PM Atuais"
                valor={ficha.pmAtual}
                onValorChange={(v) => onChange({ ...ficha, pmAtual: v })}
                min={0}
                max={9999}
                style={styles.col}
              />
              <CampoInteiro
                label="PM Totais"
                valor={ficha.pmTotal}
                onValorChange={(v) => onChange({ ...ficha, pmTotal: v })}
                min={0}
                max={9999}
                style={styles.col}
              />
            </View>
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
                style={styles.col}
              />
              <CampoInteiro
                label="PE Totais"
                valor={ficha.peTotal ?? 0}
                onValorChange={(v) => onChange({ ...ficha, peTotal: v })}
                min={0}
                max={9999}
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
              label="BBA (Bônus Base de Ataque)"
              valor={ficha.bba}
              onValorChange={(v) => onChange({ ...ficha, bba: v })}
              min={-20}
              max={99}
              style={styles.col}
            />
          </View>
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
                </View>

                <View style={styles.resTotalBadge}>
                  <Text style={styles.resTotalText}>
                    {formatarModificador(res.total)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
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
  btnDescansoPleno: {
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDescansoPlenoText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnDescansoPlenoSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2,
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
});

