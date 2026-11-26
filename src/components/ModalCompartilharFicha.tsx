import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { User } from 'firebase/auth';
import { FichaPersonagem } from '../models/ficha';
import {
  buscarUsuarioPorIdentificador,
  compartilharFichaComUsuario,
  removerCompartilhamentoFicha,
} from '../services/sharingService';
import { COLORS } from '../theme/colors';

interface Props {
  visivel: boolean;
  ficha: FichaPersonagem | null;
  usuarioAtual: User | null;
  onFechar: () => void;
  onFichaAtualizada: (fichaAtualizada: FichaPersonagem) => void;
}

export const ModalCompartilharFicha: React.FC<Props> = ({
  visivel,
  ficha,
  usuarioAtual,
  onFechar,
  onFichaAtualizada,
}) => {
  const [identificador, setIdentificador] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [avisoRegras, setAvisoRegras] = useState(false);

  if (!visivel || !ficha) return null;

  const nomePersonagem = ficha.nomePersonagem?.trim() || 'este personagem';
  const compartilhados = ficha.compartilhadaCom || [];

  const handleCompartilhar = async () => {
    if (!usuarioAtual) {
      setMensagemErro('Você precisa estar conectado à sua conta para compartilhar fichas.');
      return;
    }

    const termo = identificador.trim();
    if (!termo) {
      setMensagemErro('Digite o username ou e-mail da conta com a qual deseja compartilhar.');
      return;
    }

    setCarregando(true);
    setMensagemErro(null);
    setMensagemSucesso(null);
    setAvisoRegras(false);

    try {
      // 1. Localiza a conta de destino
      const busca = await buscarUsuarioPorIdentificador(termo);

      if (busca.erro) {
        setMensagemErro(busca.erro);
        if (busca.erroPermissao) {
          setAvisoRegras(true);
        }
        setCarregando(false);
        return;
      }

      const usuarioAlvo = busca.usuario;
      if (!usuarioAlvo) {
        setMensagemErro(
          `Nenhuma conta encontrada com "${termo}". Certifique-se de que o outro jogador já abriu o aplicativo logado com essa conta.`
        );
        setCarregando(false);
        return;
      }

      if (usuarioAlvo.uid === usuarioAtual.uid) {
        setMensagemErro('Você não pode compartilhar uma ficha com a sua própria conta.');
        setCarregando(false);
        return;
      }

      // 2. Realiza o compartilhamento
      const fichaSalva = await compartilharFichaComUsuario(usuarioAtual, ficha, usuarioAlvo);
      onFichaAtualizada(fichaSalva);
      setIdentificador('');
      setMensagemSucesso(
        `Ficha compartilhada com sucesso com ${usuarioAlvo.displayName || usuarioAlvo.username}!`
      );
    } catch (err: any) {
      const isPerm =
        err?.code === 'permission-denied' ||
        err?.message?.includes('permission') ||
        err?.message?.includes('PERMISSION_DENIED');

      if (isPerm) {
        setMensagemErro(
          'Permissão negada no Firestore (permission-denied). As regras de segurança no Firebase Console precisam ser atualizadas.'
        );
        setAvisoRegras(true);
      } else {
        setMensagemErro(err.message || 'Erro ao compartilhar personagem.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleRevogar = async (uidAlvo: string, nomeAlvo?: string) => {
    if (!usuarioAtual) return;

    const executarRevogacao = async () => {
      try {
        setCarregando(true);
        setMensagemErro(null);
        setMensagemSucesso(null);
        setAvisoRegras(false);
        const fichaSalva = await removerCompartilhamentoFicha(usuarioAtual, ficha, uidAlvo);
        onFichaAtualizada(fichaSalva);
        setMensagemSucesso(`Acesso de ${nomeAlvo || 'usuário'} revogado com sucesso.`);
      } catch (err: any) {
        setMensagemErro(err.message || 'Erro ao revogar acesso da ficha.');
      } finally {
        setCarregando(false);
      }
    };

    if (Platform.OS === 'web') {
      const conf = window.confirm(`Deseja revogar o acesso de ${nomeAlvo || 'este jogador'} a esta ficha?`);
      if (conf) {
        await executarRevogacao();
      }
    } else {
      Alert.alert(
        'Revogar Compartilhamento',
        `Deseja revogar o acesso de ${nomeAlvo || 'este jogador'} a esta ficha?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Revogar', style: 'destructive', onPress: executarRevogacao },
        ]
      );
    }
  };

  const meuUsername = usuarioAtual?.displayName || usuarioAtual?.email?.split('@')[0] || 'Meu Usuário';
  const meuEmail = usuarioAtual?.email || '';

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
    >
      <TouchableWithoutFeedback onPress={onFechar}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalCard}>
              {/* Cabeçalho no padrão Tormenta RPG */}
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Text style={styles.headerIcon}>👥</Text>
                  <Text style={styles.title}>Compartilhar Personagem</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onFechar}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.bodyScroll}
                contentContainerStyle={styles.bodyContent}
                keyboardShouldPersistTaps="handled"
              >
                {/* Pergunta de confirmação */}
                <Text style={styles.promptText}>
                  Deseja compartilhar o personagem <Text style={styles.destaqueNome}>"{nomePersonagem}"</Text>?
                </Text>

                <Text style={styles.descricao}>
                  Informe o <Text style={styles.negrito}>username</Text> ou <Text style={styles.negrito}>e-mail</Text> da conta com a qual deseja compartilhar. O jogador poderá acompanhar a ficha e as alterações (como perda de PV) em tempo real, em modo apenas leitura.
                </Text>

                {/* Box com os dados da minha conta para facilitar repassar para amigos */}
                <View style={styles.boxMinhaConta}>
                  <Text style={styles.boxMinhaContaTitulo}>💡 SEUS DADOS PARA OUTROS JOGADORES:</Text>
                  <Text style={styles.boxMinhaContaTexto}>
                    • Username: <Text style={styles.negrito}>{meuUsername}</Text>
                  </Text>
                  {meuEmail ? (
                    <Text style={styles.boxMinhaContaTexto}>
                      • E-mail: <Text style={styles.negrito}>{meuEmail}</Text>
                    </Text>
                  ) : null}
                </View>

                {/* Mensagens de feedback */}
                {mensagemErro && (
                  <View style={styles.boxErro}>
                    <Text style={styles.textoErro}>⚠️ {mensagemErro}</Text>
                  </View>
                )}

                {avisoRegras && (
                  <View style={styles.boxAlertaRegras}>
                    <Text style={styles.textoAlertaRegrasTitulo}>📌 AVISO: REGRAS DO FIRESTORE NO CONSOLE</Text>
                    <Text style={styles.textoAlertaRegras}>
                      Para que o Firestore permita buscar usuários e sincronizar fichas compartilhadas, acesse o{' '}
                      <Text style={styles.negrito}>Firebase Console &gt; Firestore Database &gt; Rules</Text> e publique as regras presentes no arquivo{' '}
                      <Text style={styles.negrito}>firestore.rules</Text> do projeto.
                    </Text>
                  </View>
                )}

                {mensagemSucesso && (
                  <View style={styles.boxSucesso}>
                    <Text style={styles.textoSucesso}>✅ {mensagemSucesso}</Text>
                  </View>
                )}

                {/* Input de Compartilhamento */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Username ou E-mail da Conta:</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      value={identificador}
                      onChangeText={(val) => {
                        setIdentificador(val);
                        setMensagemErro(null);
                        setMensagemSucesso(null);
                        setAvisoRegras(false);
                      }}
                      placeholder="Ex: arthur ou arthur@email.com"
                      placeholderTextColor={COLORS.textSecondary}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="send"
                      onSubmitEditing={handleCompartilhar}
                    />
                    <TouchableOpacity
                      style={[styles.btnCompartilhar, carregando && styles.btnDisabled]}
                      onPress={handleCompartilhar}
                      disabled={carregando}
                      activeOpacity={0.8}
                    >
                      {carregando ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Text style={styles.btnCompartilharText}>Compartilhar</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Lista de Jogadores com Acesso */}
                <View style={styles.secaoAcessos}>
                  <Text style={styles.secaoTitulo}>
                    Jogadores com Acesso ({compartilhados.length})
                  </Text>

                  {compartilhados.length === 0 ? (
                    <Text style={styles.semAcessos}>
                      Este personagem ainda não foi compartilhado com nenhum outro jogador.
                    </Text>
                  ) : (
                    <View style={styles.listaJogadores}>
                      {compartilhados.map((item) => (
                        <View key={item.uid} style={styles.itemJogador}>
                          <View style={styles.itemJogadorInfo}>
                            <Text style={styles.itemJogadorNome} numberOfLines={1}>
                              👤 {item.username || item.email?.split('@')[0] || 'Jogador'}
                            </Text>
                            {item.email ? (
                              <Text style={styles.itemJogadorEmail} numberOfLines={1}>
                                {item.email}
                              </Text>
                            ) : null}
                          </View>
                          <TouchableOpacity
                            style={styles.btnRevogar}
                            onPress={() => handleRevogar(item.uid, item.username || item.email)}
                            activeOpacity={0.7}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Text style={styles.btnRevogarText}>Revogar</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Rodapé */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.btnFechar}
                  onPress={onFechar}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnFecharText}>Fechar</Text>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryDark,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bodyScroll: {
    maxHeight: 480,
  },
  bodyContent: {
    padding: 18,
  },
  promptText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  destaqueNome: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  negrito: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  boxMinhaConta: {
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  boxMinhaContaTitulo: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  boxMinhaContaTexto: {
    fontSize: 12.5,
    color: COLORS.text,
    lineHeight: 18,
  },
  boxErro: {
    backgroundColor: '#FDEDED',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  textoErro: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  boxAlertaRegras: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  textoAlertaRegrasTitulo: {
    color: '#8A6414',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textoAlertaRegras: {
    color: '#5C4308',
    fontSize: 12,
    lineHeight: 17,
  },
  boxSucesso: {
    backgroundColor: '#EDF7ED',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  textoSucesso: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  btnCompartilhar: {
    height: 42,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnCompartilharText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secaoAcessos: {
    marginTop: 6,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  secaoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  semAcessos: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  listaJogadores: {
    gap: 8,
  },
  itemJogador: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemJogadorInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemJogadorNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  itemJogadorEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  btnRevogar: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FDEDED',
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 6,
  },
  btnRevogarText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: COLORS.surfaceVariant,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  btnFechar: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
  },
  btnFecharText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
