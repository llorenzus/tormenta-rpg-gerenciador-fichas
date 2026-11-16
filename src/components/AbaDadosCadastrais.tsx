import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ClasseData, RacaData } from '../data';
import {
  aplicarClasseNaFicha,
  atualizarClassesFicha,
  calcularNivelTotal,
  ClassePersonagem,
  FichaPersonagem,
  gerarId,
  HabilidadeOuTalento,
  obterClassesFicha,
} from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoTexto, SecaoHeader } from './CommonInput';
import { AbaCompendio, CompendioModal } from './CompendioModal';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaDadosCadastrais: React.FC<Props> = ({ ficha, onChange }) => {
  const [compendioVisivel, setCompendioVisivel] = useState(false);
  const [compendioAba, setCompendioAba] = useState<AbaCompendio>('racas');

  const classesAtuais = obterClassesFicha(ficha);
  const nivelTotal = calcularNivelTotal(classesAtuais);

  const abrirCompendio = (aba: AbaCompendio) => {
    setCompendioAba(aba);
    setCompendioVisivel(true);
  };

  const handleAplicarRaca = (raca: RacaData) => {
    const novosTracos: HabilidadeOuTalento[] = raca.tracosRaciais.map((t) => ({
      id: gerarId(),
      nome: `${t.nome} (${raca.nome})`,
      descricao: t.descricao,
    }));
    onChange({
      ...ficha,
      raca: raca.nome,
      tamanho: raca.tamanho,
      deslocamento: `${raca.deslocamento}m`,
      habilidadesRaca: [...ficha.habilidadesRaca, ...novosTracos],
    });
  };

  const handleAplicarClasse = (classe: ClasseData) => {
    onChange(aplicarClasseNaFicha(ficha, classe));
  };


  const handleAlterarNomeClasse = (index: number, novoNome: string) => {
    const novas = [...classesAtuais];
    novas[index] = { ...novas[index], nome: novoNome };
    onChange(atualizarClassesFicha(ficha, novas));
  };

  const handleAlterarNivelClasse = (index: number, delta: number) => {
    const novas = [...classesAtuais];
    const atual = novas[index].nivel || 1;
    const novoNivel = Math.max(1, Math.min(20, atual + delta));
    novas[index] = { ...novas[index], nivel: novoNivel };
    onChange(atualizarClassesFicha(ficha, novas));
  };

  const handleAdicionarNovaClasse = () => {
    const novas: ClassePersonagem[] = [
      ...classesAtuais,
      { id: gerarId(), nome: '', nivel: 1 },
    ];
    onChange(atualizarClassesFicha(ficha, novas));
  };

  const handleRemoverClasse = (index: number) => {
    if (classesAtuais.length <= 1) {
      // Deixa a única classe vazia com nível 1
      const reset: ClassePersonagem[] = [{ id: gerarId(), nome: '', nivel: 1 }];
      onChange(atualizarClassesFicha(ficha, reset));
      return;
    }
    const novas = classesAtuais.filter((_, i) => i !== index);
    onChange(atualizarClassesFicha(ficha, novas));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <SecaoHeader
          titulo="Dados Cadastrais"
          subtitulo="Informações pessoais e biográficas do personagem"
        />
        <View style={styles.cardBody}>
          <CampoTexto
            label="Nome do Personagem"
            value={ficha.nomePersonagem}
            onChangeText={(v) => onChange({ ...ficha, nomePersonagem: v })}
            placeholder="Ex: Sandro Galtran"
          />

          <View style={styles.row}>
            <CampoTexto
              label="Jogador"
              value={ficha.jogador}
              onChangeText={(v) => onChange({ ...ficha, jogador: v })}
              placeholder="Ex: Seu Nome"
              style={styles.col}
            />
            <CampoTexto
              label="Raça"
              value={ficha.raca}
              onChangeText={(v) => onChange({ ...ficha, raca: v })}
              placeholder="Ex: Humano"
              style={styles.col}
              rightAction={
                <TouchableOpacity
                  style={styles.btnMiniCompendio}
                  onPress={() => abrirCompendio('racas')}
                >
                  <Text style={styles.btnMiniCompendioText}>📖 Compêndio</Text>
                </TouchableOpacity>
              }
            />
          </View>

          {/* ======================================================== */}
          {/* SEÇÃO MULTICLASSE ORGANIZADA COM NÍVEIS INDIVIDUAIS E TOTAL */}
          {/* ======================================================== */}
          <View style={styles.multiclasseContainer}>
            <View style={styles.multiclasseHeader}>
              <View style={styles.multiclasseHeaderTitleCol}>
                <Text style={styles.multiclasseTitulo}>Classes & Níveis</Text>
                <Text style={styles.multiclasseSubtitulo}>
                  Adicione e gerencie classes para progressão individual e multiclasse
                </Text>
              </View>
              <View style={styles.badgeNivelTotal}>
                <Text style={styles.badgeNivelTotalLabel}>NÍVEL TOTAL</Text>
                <Text style={styles.badgeNivelTotalValor}>{nivelTotal}</Text>
              </View>
            </View>

            {classesAtuais.map((item, index) => (
              <View key={item.id || index} style={styles.classeItemRow}>
                <View style={styles.classeNomeWrap}>
                  <CampoTexto
                    label={classesAtuais.length > 1 ? `Classe ${index + 1}` : 'Classe Principal'}
                    value={item.nome}
                    onChangeText={(text) => handleAlterarNomeClasse(index, text)}
                    placeholder="Ex: Samurai, Mago, Guerreiro..."
                  />
                </View>

                {/* Seletor do nível desta classe */}
                <View style={styles.classeNivelWrap}>
                  <Text style={styles.classeItemLabel}>Nível da Classe</Text>
                  <View style={styles.seletorNivelRow}>
                    <TouchableOpacity
                      style={[styles.btnNivel, item.nivel <= 1 && styles.btnNivelDisabled]}
                      onPress={() => handleAlterarNivelClasse(index, -1)}
                      disabled={item.nivel <= 1}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.btnNivelText}>–</Text>
                    </TouchableOpacity>

                    <View style={styles.boxNivelValor}>
                      <Text style={styles.nivelValorNumero}>{item.nivel}</Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.btnNivel, item.nivel >= 20 && styles.btnNivelDisabled]}
                      onPress={() => handleAlterarNivelClasse(index, +1)}
                      disabled={item.nivel >= 20}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.btnNivelText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botão de remover classe */}
                {classesAtuais.length > 1 && (
                  <TouchableOpacity
                    style={styles.btnRemoverClasse}
                    onPress={() => handleRemoverClasse(index)}
                    accessibilityLabel="Remover Classe"
                  >
                    <Text style={styles.btnRemoverClasseText}>✕</Text>
                  </TouchableOpacity>
                )}

              </View>
            ))}

            {/* Ações de Classes */}
            <View style={styles.acoesClassesRow}>
              <TouchableOpacity
                style={styles.btnAdicionarClasse}
                onPress={handleAdicionarNovaClasse}
                activeOpacity={0.8}
              >
                <Text style={styles.btnAdicionarClasseText}>+ Nova Classe (Multiclasse)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnCompendioClasses}
                onPress={() => abrirCompendio('classes')}
                activeOpacity={0.8}
              >
                <Text style={styles.btnCompendioClassesText}>📖 Buscar no Compêndio</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <CampoTexto
              label="Tendência"
              value={ficha.tendencia}
              onChangeText={(v) => onChange({ ...ficha, tendencia: v })}
              placeholder="Ex: Leal e Bondoso"
              style={styles.col}
            />
            <CampoTexto
              label="Divindade"
              value={ficha.divindade}
              onChangeText={(v) => onChange({ ...ficha, divindade: v })}
              placeholder="Ex: Khalmyr"
              style={styles.col}
            />
          </View>

          <View style={styles.row}>
            <CampoTexto
              label="Sexo"
              value={ficha.sexo}
              onChangeText={(v) => onChange({ ...ficha, sexo: v })}
              placeholder="Ex: Masculino"
              style={styles.col}
            />
            <CampoTexto
              label="Idade"
              value={ficha.idade}
              onChangeText={(v) => onChange({ ...ficha, idade: v })}
              placeholder="Ex: 24 anos"
              style={styles.col}
            />
          </View>

          <View style={styles.row}>
            <CampoTexto
              label="Tamanho"
              value={ficha.tamanho}
              onChangeText={(v) => onChange({ ...ficha, tamanho: v })}
              placeholder="Ex: Médio"
              style={styles.col}
            />
            <CampoTexto
              label="Deslocamento"
              value={ficha.deslocamento}
              onChangeText={(v) => onChange({ ...ficha, deslocamento: v })}
              placeholder="Ex: 9m"
              style={styles.col}
            />
          </View>
        </View>
      </View>

      {/* Modal do Compêndio */}
      <CompendioModal
        visivel={compendioVisivel}
        onFechar={() => setCompendioVisivel(false)}
        abaInicial={compendioAba}
        fichaAtual={ficha}
        onAtualizarFichaAtual={onChange}
        onAplicarRacaAFicha={handleAplicarRaca}
        onAplicarClasseAFicha={handleAplicarClasse}
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
    gap: 10,
    marginTop: 6,
  },
  col: {
    flex: 1,
  },
  btnMiniCompendio: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(139,30,30,0.1)',
  },
  btnMiniCompendioText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  // Estilos da Seção Multiclasse
  multiclasseContainer: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#FAF7F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2D5C3',
  },
  multiclasseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8DEC8',
    gap: 8,
  },
  multiclasseHeaderTitleCol: {
    flex: 1,
    paddingRight: 8,
  },
  multiclasseTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  multiclasseSubtitulo: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  badgeNivelTotal: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 84,
    flexShrink: 0,
    alignSelf: 'center',
  },
  badgeNivelTotalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFE2A0',
    letterSpacing: 0.5,
    textAlign: 'center',
    includeFontPadding: false,
  },
  badgeNivelTotalValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
    marginTop: 1,
  },
  classeItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EADFC9',
    marginBottom: 8,
    gap: 12,
  },
  classeNomeWrap: {
    flex: 1,
  },
  classeNivelWrap: {
    width: 130,
  },
  classeItemLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  seletorNivelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#FDFBF7',
  },
  btnNivel: {
    width: 36,
    height: '100%',
    backgroundColor: '#EFE6D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnNivelDisabled: {
    opacity: 0.35,
  },
  btnNivelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  boxNivelValor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nivelValorNumero: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  btnRemoverClasse: {
    width: 36,
    height: 40,
    backgroundColor: '#FBE8E8',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0C2C2',
  },
  btnRemoverClasseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B3261E',
  },
  acoesClassesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  btnAdicionarClasse: {
    flex: 1,
    backgroundColor: '#F3EBDD',
    borderWidth: 1,
    borderColor: '#D4C3A3',
    borderStyle: 'dashed',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAdicionarClasseText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  btnCompendioClasses: {
    backgroundColor: 'rgba(139,30,30,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139,30,30,0.25)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCompendioClassesText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});


