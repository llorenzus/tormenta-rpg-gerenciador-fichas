import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FichaPersonagem } from '../models/ficha';
import { COLORS } from '../theme/colors';
import { CampoInteiro, CampoTexto, SecaoHeader } from './CommonInput';

interface Props {
  ficha: FichaPersonagem;
  onChange: (nova: FichaPersonagem) => void;
}

export const AbaDadosCadastrais: React.FC<Props> = ({ ficha, onChange }) => {
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
            />
          </View>

          <View style={styles.row}>
            <CampoTexto
              label="Classe"
              value={ficha.classe}
              onChangeText={(v) => onChange({ ...ficha, classe: v })}
              placeholder="Ex: Guerreiro"
              style={styles.colWide}
            />
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
});

