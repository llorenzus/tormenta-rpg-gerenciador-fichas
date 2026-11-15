import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ClasseData, RacaData } from '../data';
import { FichaPersonagem, gerarId, HabilidadeOuTalento } from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoInteiro, CampoTexto, SecaoHeader } from './CommonInput';
import { AbaCompendio, CompendioModal } from './CompendioModal';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaDadosCadastrais: React.FC<Props> = ({ ficha, onChange }) => {
  const [compendioVisivel, setCompendioVisivel] = useState(false);
  const [compendioAba, setCompendioAba] = useState<AbaCompendio>('racas');

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
    const novasHabs: HabilidadeOuTalento[] = classe.habilidades.map((h) => ({
      id: gerarId(),
      nome: `${h.nome} [Nív. ${h.nivel}]`,
      descricao: h.descricao,
    }));
    onChange({
      ...ficha,
      classe: ficha.classe?.trim() ? `${ficha.classe} / ${classe.nome}` : classe.nome,
      habilidadesClasse: [...ficha.habilidadesClasse, ...novasHabs],
    });
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
            <View style={styles.col}>
              <View style={styles.labelWithActionRow}>
                <Text style={styles.fieldLabel}>Raça</Text>
                <TouchableOpacity
                  style={styles.btnMiniCompendio}
                  onPress={() => abrirCompendio('racas')}
                >
                  <Text style={styles.btnMiniCompendioText}>📖 Compêndio</Text>
                </TouchableOpacity>
              </View>
              <CampoTexto
                label=""
                value={ficha.raca}
                onChangeText={(v) => onChange({ ...ficha, raca: v })}
                placeholder="Ex: Humano"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.colWide}>
              <View style={styles.labelWithActionRow}>
                <Text style={styles.fieldLabel}>Classe</Text>
                <TouchableOpacity
                  style={styles.btnMiniCompendio}
                  onPress={() => abrirCompendio('classes')}
                >
                  <Text style={styles.btnMiniCompendioText}>📖 Compêndio</Text>
                </TouchableOpacity>
              </View>
              <CampoTexto
                label=""
                value={ficha.classe}
                onChangeText={(v) => onChange({ ...ficha, classe: v })}
                placeholder="Ex: Guerreiro"
              />
            </View>
            <CampoInteiro
              label="Nível"
              valor={ficha.nivel}
              onValorChange={(v) => onChange({ ...ficha, nivel: Math.max(1, v) })}
              min={1}
              max={40}
              style={styles.colSmall}
            />
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
  colWide: {
    flex: 1.6,
  },
  colSmall: {
    flex: 0.8,
  },
  labelWithActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  btnMiniCompendio: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(139,30,30,0.1)',
  },
  btnMiniCompendioText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

