import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  atual: number;
  max: number;
  cor: string;
  corFundo?: string;
  unidade?: string;
  mostrarTexto?: boolean;
}

export const BarraDeProgressoRecurso: React.FC<Props> = ({
  atual,
  max,
  cor,
  corFundo = 'rgba(0,0,0,0.08)',
  unidade,
  mostrarTexto = true,
}) => {
  const maxSeguro = Math.max(1, max || 1);
  const atualSeguro = typeof atual === 'number' ? atual : 0;
  const pctCalculada = Math.round((atualSeguro / maxSeguro) * 100);
  const pctLargura = Math.max(0, Math.min(100, pctCalculada));

  return (
    <View style={styles.container}>
      <View style={[styles.trilho, { backgroundColor: corFundo }]}>
        <View
          style={[
            styles.preenchimento,
            {
              width: `${pctLargura}%`,
              backgroundColor: cor,
            },
          ]}
        />
      </View>
      {mostrarTexto && (
        <View style={styles.textoRow}>
          <Text style={[styles.textoPct, { color: cor }]}>
            {pctCalculada}% {unidade ? `(${atualSeguro}/${maxSeguro} ${unidade})` : ''}
          </Text>
          {atualSeguro <= 0 && maxSeguro > 0 && (
            <Text style={styles.textoAlerta}>Esgotado</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    width: '100%',
  },
  trilho: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  preenchimento: {
    height: '100%',
    borderRadius: 4,
  },
  textoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  textoPct: {
    fontSize: 11,
    fontWeight: '700',
  },
  textoAlerta: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D32F2F',
    textTransform: 'uppercase',
  },
});

