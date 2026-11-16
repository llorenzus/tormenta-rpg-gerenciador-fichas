import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { COLORS } from '../theme/colors';

export type AbaKey =
  | 'dados_cadastrais'
  | 'atributos'
  | 'pericias'
  | 'habilidades_raca'
  | 'habilidades_classe'
  | 'manobras'
  | 'talentos'
  | 'magias'
  | 'equipamentos';

export interface AbaInfo {
  key: AbaKey;
  titulo: string;
  icone: string;
}

export const TODAS_AS_ABAS: Record<AbaKey, AbaInfo> = {
  dados_cadastrais: { key: 'dados_cadastrais', titulo: 'Dados Cadastrais', icone: '📋' },
  atributos: { key: 'atributos', titulo: 'Atributos', icone: '🛡️' },
  pericias: { key: 'pericias', titulo: 'Perícias', icone: '🎯' },
  habilidades_raca: { key: 'habilidades_raca', titulo: 'Habilidades de Raça', icone: '🧬' },
  habilidades_classe: { key: 'habilidades_classe', titulo: 'Habilidades de Classe', icone: '📜' },
  manobras: { key: 'manobras', titulo: 'Manobras de Combate', icone: '⚔️' },
  talentos: { key: 'talentos', titulo: 'Talentos', icone: '⭐' },
  magias: { key: 'magias', titulo: 'Magias', icone: '✨' },
  equipamentos: { key: 'equipamentos', titulo: 'Equipamentos', icone: '🎒' },
};

export const ORDEM_ABAS_PADRAO: AbaKey[] = [
  'dados_cadastrais',
  'atributos',
  'pericias',
  'habilidades_raca',
  'habilidades_classe',
  'manobras',
  'talentos',
  'magias',
  'equipamentos',
];

interface Props {
  visivel: boolean;
  ordemAtual: AbaKey[];
  onFechar: () => void;
  onSalvarOrdem: (novaOrdem: AbaKey[]) => void;
}

export const ModalReordenarAbas: React.FC<Props> = ({
  visivel,
  ordemAtual,
  onFechar,
  onSalvarOrdem,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const [listaOrdem, setListaOrdem] = React.useState<AbaKey[]>(ordemAtual);

  React.useEffect(() => {
    if (visivel && Array.isArray(ordemAtual) && ordemAtual.length > 0) {
      setListaOrdem(ordemAtual);
    }
  }, [visivel, JSON.stringify(ordemAtual)]);

  const moverParaCima = (index: number) => {
    if (index <= 0) return;
    setListaOrdem((prev) => {
      const nova = [...prev];
      const item = nova[index];
      nova[index] = nova[index - 1];
      nova[index - 1] = item;
      onSalvarOrdem(nova);
      return nova;
    });
  };

  const moverParaBaixo = (index: number) => {
    setListaOrdem((prev) => {
      if (index >= prev.length - 1) return prev;
      const nova = [...prev];
      const item = nova[index];
      nova[index] = nova[index + 1];
      nova[index + 1] = item;
      onSalvarOrdem(nova);
      return nova;
    });
  };

  const restaurarPadrao = () => {
    setListaOrdem(ORDEM_ABAS_PADRAO);
    onSalvarOrdem(ORDEM_ABAS_PADRAO);
  };

  const modalBoxHeight = Math.min(windowHeight * 0.85, 640);

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { height: modalBoxHeight, maxHeight: windowHeight * 0.9 }]}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.titulo}>⚙️ Organizar Ordem das Abas</Text>
              <Text style={styles.subtitulo}>
                Personalize a sequência das abas utilizando os botões Subir e Descer.
              </Text>
            </View>
            <TouchableOpacity style={styles.btnFechar} onPress={onFechar}>
              <Text style={styles.btnFecharText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Lista Reordenável */}
          <ScrollView
            style={styles.listaScroll}
            contentContainerStyle={styles.listaContent}
            keyboardShouldPersistTaps="handled"
          >
            {listaOrdem.map((chave, index) => {
              const info = TODAS_AS_ABAS[chave];
              if (!info) return null;
              const isFirst = index === 0;
              const isLast = index === listaOrdem.length - 1;

              return (
                <View key={chave} style={styles.itemRow}>
                  <View style={styles.posicaoBadge}>
                    <Text style={styles.posicaoText}>{index + 1}º</Text>
                  </View>

                  <View style={styles.iconeBox}>
                    <Text style={styles.iconeText}>{info.icone}</Text>
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={styles.abaNomeText}>{info.titulo}</Text>
                    <Text style={styles.abaSubText}>
                      {chave === 'atributos' ? 'PV, PM, PA, CA, Atributos e Resistências' : ''}
                      {chave === 'manobras' ? 'Posturas e Golpes Marciais (PE)' : ''}
                      {chave === 'habilidades_classe' ? 'Habilidades e características de classe' : ''}
                      {chave === 'talentos' ? 'Talentos de combate, perícia, etc.' : ''}
                      {chave === 'magias' ? 'Grimório de Magias (Níveis 0 a 9)' : ''}
                      {chave === 'equipamentos' ? 'Armas, Armaduras, Escudos e Tibares' : ''}
                      {chave === 'pericias' ? 'Lista completa de perícias do Tormenta' : ''}
                      {chave === 'dados_cadastrais' ? 'Nome, Classe, Raça, Nível...' : ''}
                      {chave === 'habilidades_raca' ? 'Traços e habilidades da raça' : ''}
                    </Text>
                  </View>

                  {/* Botões de Mover */}
                  <View style={styles.botoesMoverRow}>
                    <TouchableOpacity
                      style={[styles.btnMover, isFirst && styles.btnMoverDisabled]}
                      onPress={() => moverParaCima(index)}
                      disabled={isFirst}
                      activeOpacity={0.6}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                    >
                      <Text style={[styles.btnMoverText, isFirst && styles.btnMoverTextDisabled]}>
                        ▲ Subir
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btnMover, isLast && styles.btnMoverDisabled]}
                      onPress={() => moverParaBaixo(index)}
                      disabled={isLast}
                      activeOpacity={0.6}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                    >
                      <Text style={[styles.btnMoverText, isLast && styles.btnMoverTextDisabled]}>
                        ▼ Descer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Rodapé com Ações */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnRestaurar}
              onPress={restaurarPadrao}
              activeOpacity={0.7}
            >
              <Text style={styles.btnRestaurarText}>↺ Restaurar Padrão</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnConcluir}
              onPress={onFechar}
              activeOpacity={0.8}
            >
              <Text style={styles.btnConcluirText}>Concluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  modalBox: {
    width: '100%',
    maxWidth: 620,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.surfaceVariant,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitulo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  btnFechar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFecharText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  listaScroll: {
    flex: 1,
  },
  listaContent: {
    padding: 12,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  posicaoBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(200,157,60,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posicaoText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8A6414',
  },
  iconeBox: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeText: {
    fontSize: 18,
  },
  infoCol: {
    flex: 1,
    marginRight: 4,
  },
  abaNomeText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  abaSubText: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  botoesMoverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  btnMover: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 36,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnMoverDisabled: {
    opacity: 0.35,
    backgroundColor: 'transparent',
  },
  btnMoverText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  btnMoverTextDisabled: {
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: COLORS.surfaceVariant,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  btnRestaurar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  btnRestaurarText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  btnConcluir: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  btnConcluirText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

