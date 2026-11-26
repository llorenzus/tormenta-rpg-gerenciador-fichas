import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';
import {
  cadastrarComEmail,
  fazerLogout,
  loginComEmail,
  loginComGoogle,
  redefinirSenha,
} from '../services/authService';
import { isFirebaseConfigured } from '../services/firebase';
import { exportarBackupCompletoLocal } from '../storage/fichaStorage';
import { COLORS } from '../theme/colors';

interface Props {
  visivel: boolean;
  usuarioAtual: User | null;
  onFechar: () => void;
  onLoginSucesso?: (usuario: User) => void;
  onLogoutSucesso?: () => void;
}

const GOOGLE_ICON_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>`
  );

type ModoAba = 'login' | 'cadastro' | 'recuperar';

export const ModalLogin: React.FC<Props> = ({
  visivel,
  usuarioAtual,
  onFechar,
  onLoginSucesso,
  onLogoutSucesso,
}) => {
  const [modo, setModo] = useState<ModoAba>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [exportandoBackup, setExportandoBackup] = useState(false);
  const [mensagemBackup, setMensagemBackup] = useState<string | null>(null);
  const [confirmandoLogout, setConfirmandoLogout] = useState(false);
  const [manterConectado, setManterConectado] = useState(true);

  // Carrega a preferência de manter conectado
  useEffect(() => {
    AsyncStorage.getItem('@tormenta_rpg:manter_conectado')
      .then((valor) => {
        if (valor !== null) {
          setManterConectado(valor === 'true');
        }
      })
      .catch(() => {});
  }, []);

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setSenha('');
    setMensagemErro(null);
    setMensagemSucesso(null);
    setMensagemBackup(null);
    setCarregando(false);
    setExportandoBackup(false);
    setConfirmandoLogout(false);
  };

  const handleExportarBackup = async () => {
    setExportandoBackup(true);
    setMensagemBackup(null);
    try {
      const ok = await exportarBackupCompletoLocal();
      if (ok) {
        setMensagemBackup('✅ Backup completo (.json) exportado com sucesso!');
      }
    } catch {
      setMensagemBackup('⚠️ Não foi possível exportar o backup.');
    } finally {
      setExportandoBackup(false);
    }
  };

  const handleFechar = () => {
    resetForm();
    onFechar();
  };

  // Atalho de teclado: permite pressionar 'Enter' para submeter o formulário no Windows / Web
  useEffect(() => {
    if (!visivel || Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (confirmandoLogout) {
          e.preventDefault();
          handleLogout();
          return;
        }
        if (!carregando && !usuarioAtual) {
          e.preventDefault();
          handleSubmeter();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visivel, carregando, confirmandoLogout, usuarioAtual, modo, username, email, senha, manterConectado]);

  const handleSubmeter = async () => {
    setMensagemErro(null);
    setMensagemSucesso(null);
    setCarregando(true);

    try {
      // Salva a preferência de persistência
      await AsyncStorage.setItem(
        '@tormenta_rpg:manter_conectado',
        manterConectado ? 'true' : 'false'
      );

      if (modo === 'login') {
        const res = await loginComEmail(email, senha);
        if (res.sucesso && res.usuario) {
          const userLogado = res.usuario;
          resetForm();
          if (onLoginSucesso) onLoginSucesso(userLogado);
          onFechar();
        } else {
          setMensagemErro(res.erro || 'Falha ao entrar.');
        }
      } else if (modo === 'cadastro') {
        const usernameTrim = username.trim();
        if (!usernameTrim) {
          setMensagemErro('Informe um nome de usuário (username) obrigatório para se cadastrar.');
          return;
        }
        if (usernameTrim.length < 2) {
          setMensagemErro('O nome de usuário deve ter pelo menos 2 caracteres.');
          return;
        }

        const res = await cadastrarComEmail(email, senha, usernameTrim);
        if (res.sucesso && res.usuario) {
          const userLogado = res.usuario;
          resetForm();
          if (onLoginSucesso) onLoginSucesso(userLogado);
          onFechar();
        } else {
          setMensagemErro(res.erro || 'Falha ao criar conta.');
        }
      } else if (modo === 'recuperar') {
        const res = await redefinirSenha(email);
        if (res.sucesso) {
          setMensagemSucesso(
            'E-mail de redefinição enviado! Verifique sua caixa de entrada e spam.'
          );
        } else {
          setMensagemErro(res.erro || 'Não foi possível enviar o e-mail.');
        }
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleGoogle = async () => {
    setMensagemErro(null);
    setMensagemSucesso(null);
    setCarregando(true);
    try {
      await AsyncStorage.setItem(
        '@tormenta_rpg:manter_conectado',
        manterConectado ? 'true' : 'false'
      );
      const res = await loginComGoogle();
      if (res.sucesso && res.usuario) {
        const userLogado = res.usuario;
        resetForm();
        if (onLoginSucesso) onLoginSucesso(userLogado);
        onFechar();
      } else {
        setMensagemErro(res.erro || 'Falha no login com Google.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = async () => {
    setCarregando(true);
    try {
      await AsyncStorage.setItem('@tormenta_rpg:manter_conectado', 'false');
      await fazerLogout();
      if (onLogoutSucesso) onLogoutSucesso();
      handleFechar();
    } finally {
      setCarregando(false);
      setConfirmandoLogout(false);
    }
  };

  const firebaseAtivo = isFirebaseConfigured();

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={handleFechar}
    >
      <TouchableWithoutFeedback onPress={handleFechar}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Cabeçalho */}
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Text style={styles.headerIcon}>☁️</Text>
                  <Text style={styles.title}>Conta e Nuvem</Text>
                </View>
                <TouchableOpacity onPress={handleFechar} style={styles.btnClose}>
                  <Text style={styles.btnCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                {!firebaseAtivo && (
                  <View style={styles.avisoConfigBox}>
                    <Text style={styles.avisoConfigTitle}>⚙️ Configuração Pendente</Text>
                    <Text style={styles.avisoConfigText}>
                      O Firebase ainda não foi configurado no arquivo .env deste ambiente. As
                      fichas continuam sendo salvas 100% normalmente no seu aparelho.
                    </Text>
                  </View>
                )}

                {/* CENÁRIO 1: USUÁRIO JÁ ESTÁ CONECTADO */}
                {usuarioAtual ? (
                  <View style={styles.sessaoLogada}>
                    <View style={styles.badgeLogado}>
                      <Text style={styles.badgeStatusDot}>🟢</Text>
                      <Text style={styles.badgeLogadoLabel}>Conta Conectada</Text>
                    </View>

                    <Text style={styles.userNameText}>
                      👤 {usuarioAtual.displayName || usuarioAtual.email?.split('@')[0] || 'Aventureiro'}
                    </Text>
                    <Text style={styles.userEmailText}>{usuarioAtual.email}</Text>

                    <View style={styles.infoBoxNuvem}>
                      <Text style={styles.infoBoxTitle}>🛡️ Sincronização em Nuvem Ativa</Text>
                      <Text style={styles.infoBoxText}>
                        Suas fichas estão seguras e sincronizadas na sua conta. Você pode acessar
                        seus personagens neste computador ou em qualquer outro dispositivo.
                      </Text>
                    </View>

                    <View style={styles.botoesSessaoLogada}>
                      {confirmandoLogout ? (
                        <View style={styles.logoutConfirmCard}>
                          <Text style={styles.logoutConfirmTitle}>🚪 Sair da Conta</Text>
                          <Text style={styles.logoutConfirmText}>
                            Deseja realmente sair da sua conta?
                          </Text>
                          <View style={styles.logoutConfirmRow}>
                            <TouchableOpacity
                              style={styles.btnCancelarLogout}
                              onPress={() => setConfirmandoLogout(false)}
                              disabled={carregando}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.btnCancelarLogoutText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.btnConfirmarLogout}
                              onPress={handleLogout}
                              disabled={carregando}
                              activeOpacity={0.8}
                            >
                              {carregando ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                              ) : (
                                <Text style={styles.btnConfirmarLogoutText}>Sair</Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.btnLogout}
                          onPress={() => setConfirmandoLogout(true)}
                          disabled={carregando}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.btnLogoutText}>🚪 Sair da Conta (Logout)</Text>
                        </TouchableOpacity>
                      )}

                      {!confirmandoLogout && (
                        <TouchableOpacity
                          style={styles.btnContinuarJogando}
                          onPress={handleFechar}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.btnContinuarJogandoText}>Continuar Jogando</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ) : (
                  /* CENÁRIO 2: USUÁRIO NÃO ESTÁ CONECTADO */
                  <View style={styles.sessaoDeslogada}>
                    <Text style={styles.modoLocalDesc}>
                      Acesse sua conta para visualizar e sincronizar suas fichas. Qualquer ficha
                      já criada nesta máquina será transferida automaticamente para a sua conta!
                    </Text>

                    {/* Abas de Navegação (Entrar / Cadastrar) */}
                    <View style={styles.tabNav}>
                      <TouchableOpacity
                        style={[styles.tabBtn, modo === 'login' && styles.tabBtnAtivo]}
                        onPress={() => {
                          setModo('login');
                          setMensagemErro(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.tabBtnText,
                            modo === 'login' && styles.tabBtnTextAtivo,
                          ]}
                        >
                          Entrar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.tabBtn, modo === 'cadastro' && styles.tabBtnAtivo]}
                        onPress={() => {
                          setModo('cadastro');
                          setMensagemErro(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.tabBtnText,
                            modo === 'cadastro' && styles.tabBtnTextAtivo,
                          ]}
                        >
                          Criar Conta
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.tabBtn, modo === 'recuperar' && styles.tabBtnAtivo]}
                        onPress={() => {
                          setModo('recuperar');
                          setMensagemErro(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.tabBtnText,
                            modo === 'recuperar' && styles.tabBtnTextAtivo,
                          ]}
                        >
                          Esqueci Senha
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Mensagens de Feedback */}
                    {mensagemErro && (
                      <View style={styles.erroBox}>
                        <Text style={styles.erroText}>{mensagemErro}</Text>
                      </View>
                    )}

                    {mensagemSucesso && (
                      <View style={styles.sucessoBox}>
                        <Text style={styles.sucessoText}>{mensagemSucesso}</Text>
                      </View>
                    )}

                    {/* Campos de Formulário */}
                    <View style={styles.formContainer}>
                      {modo === 'cadastro' && (
                        <>
                          <Text style={styles.inputLabel}>
                            Nome de Usuário (Username) <Text style={styles.labelObrigatorio}>*</Text>
                          </Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Ex: MestreValkaria, ArtonHero..."
                            placeholderTextColor={COLORS.textSecondary}
                            autoCapitalize="words"
                            value={username}
                            onChangeText={setUsername}
                            onSubmitEditing={handleSubmeter}
                            returnKeyType="go"
                          />
                        </>
                      )}

                      <Text style={styles.inputLabel}>E-mail</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="seu-email@exemplo.com"
                        placeholderTextColor={COLORS.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                        onSubmitEditing={handleSubmeter}
                        returnKeyType="go"
                      />

                      {modo !== 'recuperar' && (
                        <>
                          <Text style={styles.inputLabel}>Senha</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Mínimo de 6 caracteres"
                            placeholderTextColor={COLORS.textSecondary}
                            secureTextEntry
                            value={senha}
                            onChangeText={setSenha}
                            onSubmitEditing={handleSubmeter}
                            returnKeyType="go"
                          />
                        </>
                      )}

                      {/* Opção para persistir o login (Lembrar neste computador) */}
                      {(modo === 'login' || modo === 'cadastro') && (
                        <TouchableOpacity
                          style={styles.checkboxRow}
                          onPress={() => setManterConectado((v) => !v)}
                          activeOpacity={0.75}
                        >
                          <View
                            style={[
                              styles.checkboxBox,
                              manterConectado && styles.checkboxBoxChecked,
                            ]}
                          >
                            {manterConectado && (
                              <Text style={styles.checkboxCheckmark}>✓</Text>
                            )}
                          </View>
                          <Text style={styles.checkboxLabel}>
                            Permanecer conectado neste dispositivo
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={[styles.btnSubmeter, carregando && styles.btnSubmeterDisabled]}
                        onPress={handleSubmeter}
                        disabled={carregando}
                        activeOpacity={0.85}
                      >
                        {carregando ? (
                          <ActivityIndicator color={COLORS.white} size="small" />
                        ) : (
                          <Text style={styles.btnSubmeterText}>
                            {modo === 'login'
                              ? '🔑 Entrar'
                              : modo === 'cadastro'
                              ? '✨ Criar Conta'
                              : '📩 Enviar Link'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Rede de Segurança Extra: Backup Completo Local */}
                <View style={styles.backupSection}>
                  <Text style={styles.backupTitle}>📦 Rede de Segurança Local</Text>
                  <Text style={styles.backupDesc}>
                    Exporte todas as fichas salvas na máquina em um arquivo .json seguro.
                  </Text>
                  <TouchableOpacity
                    style={styles.btnExportarBackup}
                    onPress={handleExportarBackup}
                    disabled={exportandoBackup}
                    activeOpacity={0.8}
                  >
                    {exportandoBackup ? (
                      <ActivityIndicator size="small" color={COLORS.primaryDark} />
                    ) : (
                      <Text style={styles.btnExportarBackupText}>📦 Exportar Backup (.json)</Text>
                    )}
                  </TouchableOpacity>
                  {mensagemBackup && (
                    <Text style={styles.mensagemBackupText}>{mensagemBackup}</Text>
                  )}
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const ModalContaNuvem = ModalLogin;

/**
 * Componente do Indicador Discreto de Status da Nuvem para colocar na TopBar ou telas
 */
export const IndicadorStatusNuvem: React.FC<{
  usuarioAtual: User | null;
  onPress: () => void;
}> = ({ usuarioAtual, onPress }) => {
  const nome =
    usuarioAtual?.displayName ||
    usuarioAtual?.email?.split('@')[0] ||
    usuarioAtual?.email ||
    'Entrar';

  return (
    <TouchableOpacity
      style={[styles.indicadorPill, usuarioAtual ? styles.indicadorLogado : styles.indicadorLocal]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel="Perfil e Conta do Usuário"
    >
      <Text style={styles.indicadorIcon}>{usuarioAtual ? '👤' : '🔑'}</Text>
      <Text style={[styles.indicadorText, usuarioAtual && styles.indicadorTextLogado]} numberOfLines={1}>
        {usuarioAtual ? nome : 'Entrar / Criar Conta'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.gold,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surfaceVariant,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  btnClose: {
    padding: 6,
  },
  btnCloseText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  scrollArea: {
    maxHeight: 520,
  },
  scrollContent: {
    padding: 20,
  },
  avisoConfigBox: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFB74D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  avisoConfigTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  avisoConfigText: {
    fontSize: 11,
    color: '#5D4037',
    lineHeight: 16,
  },
  sessaoLogada: {
    alignItems: 'center',
    gap: 12,
  },
  badgeLogado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#81C784',
  },
  badgeStatusDot: {
    fontSize: 12,
  },
  badgeLogadoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  userNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginTop: 2,
  },
  userEmailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: -4,
  },
  infoBoxNuvem: {
    width: '100%',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
    padding: 12,
    marginTop: 6,
  },
  infoBoxTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  },
  botoesSessaoLogada: {
    width: '100%',
    gap: 10,
    marginTop: 12,
  },
  btnLogout: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  btnLogoutText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutConfirmCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  logoutConfirmTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  logoutConfirmText: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  logoutConfirmRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  btnCancelarLogout: {
    flex: 1,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelarLogoutText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  btnConfirmarLogout: {
    flex: 1,
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B71C1C',
  },
  btnConfirmarLogoutText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  btnContinuarJogando: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  btnContinuarJogandoText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sessaoDeslogada: {
    width: '100%',
  },
  badgeModoLocal: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  badgeModoLocalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modoLocalDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
  },
  tabNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabBtnAtivo: {
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabBtnText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tabBtnTextAtivo: {
    color: COLORS.primaryDark,
    fontWeight: 'bold',
  },
  erroBox: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  erroText: {
    fontSize: 12,
    color: '#C62828',
    lineHeight: 17,
  },
  sucessoBox: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#43A047',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  sucessoText: {
    fontSize: 12,
    color: '#2E7D32',
    lineHeight: 17,
  },
  formContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  labelObrigatorio: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 6,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.gold,
  },
  checkboxCheckmark: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -2,
  },
  checkboxLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  btnSubmeter: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  btnSubmeterDisabled: {
    opacity: 0.6,
  },
  btnSubmeterText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnGoogle: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  btnGoogleText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '600',
  },
  btnSeguirSemLogin: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  btnSeguirSemLoginText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
  backupSection: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    gap: 4,
  },
  backupTitle: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  backupDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  btnExportarBackup: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
  },
  btnExportarBackupText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  mensagemBackupText: {
    marginTop: 6,
    fontSize: 11.5,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Estilos do Indicador de Status
  indicadorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  indicadorLocal: {
    backgroundColor: COLORS.surfaceVariant,
    borderColor: COLORS.border,
  },
  indicadorLogado: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  indicadorIcon: {
    fontSize: 12,
  },
  indicadorText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    maxWidth: 180,
  },
  indicadorTextLogado: {
    color: '#2E7D32',
    fontWeight: '700',
  },
});
