import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../theme/colors';

interface SecaoHeaderProps {
  titulo: string;
  subtitulo?: string;
  acaoTexto?: string;
  onAcaoPress?: () => void;
}

export const SecaoHeader: React.FC<SecaoHeaderProps> = ({
  titulo,
  subtitulo,
  acaoTexto,
  onAcaoPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTextCol}>
        <Text style={styles.headerTitle}>{titulo.toUpperCase()}</Text>
        {!!subtitulo && <Text style={styles.headerSubtitle}>{subtitulo}</Text>}
      </View>
      {!!acaoTexto && !!onAcaoPress && (
        <TouchableOpacity style={styles.headerActionBtn} onPress={onAcaoPress}>
          <Text style={styles.headerActionText}>+ {acaoTexto}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export interface CampoTextoProps {
  label?: string;
  rightAction?: React.ReactNode;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  minHeight?: number;
  keyboardType?: 'default' | 'numeric' | 'number-pad' | 'decimal-pad' | 'email-address' | 'phone-pad';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  editable?: boolean;
}

export const CampoTexto: React.FC<CampoTextoProps> = ({
  label,
  rightAction,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines,
  minHeight,
  keyboardType,
  style,
  inputStyle,
  editable = true,
}) => {
  const hasHeader = Boolean((label && label.trim().length > 0) || rightAction);
  return (
    <View style={[styles.fieldWrap, style]}>
      {hasHeader && (
        <View style={styles.labelRow}>
          {!!label && label.trim().length > 0 ? (
            <Text style={styles.fieldLabel} numberOfLines={1} ellipsizeMode="tail">
              {label}
            </Text>
          ) : (
            <View />
          )}
          {rightAction}
        </View>
      )}
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.textInputMultiline,
          minHeight ? { minHeight } : undefined,
          !editable && styles.textInputDisabled,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9D8E80"
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );
};

interface CampoInteiroProps {
  label?: string;
  rightAction?: React.ReactNode;
  valor: number;
  onValorChange: (novo: number) => void;
  min?: number;
  max?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  compact?: boolean;
  comStepper?: boolean;
}

export const CampoInteiro: React.FC<CampoInteiroProps> = ({
  label,
  rightAction,
  valor,
  onValorChange,
  min = -99,
  max = 9999,
  style,
  inputStyle,
  compact = false,
  comStepper = false,
}) => {
  const [texto, setTexto] = useState(String(valor));

  useEffect(() => {
    setTexto(String(valor));
  }, [valor]);

  const handleChange = (novoTexto: string) => {
    if (novoTexto === '' || novoTexto === '-') {
      setTexto(novoTexto);
      return;
    }
    const parsed = parseInt(novoTexto, 10);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      setTexto(String(clamped));
      onValorChange(clamped);
    }
  };

  const handleBlur = () => {
    if (texto === '' || texto === '-') {
      const fallback = Math.max(min, Math.min(max, 0));
      setTexto(String(fallback));
      onValorChange(fallback);
    }
  };

  const hasHeader = Boolean((label && label.trim().length > 0) || rightAction);

  return (
    <View style={[styles.fieldWrap, style]}>
      {hasHeader && (
        <View style={styles.labelRow}>
          {!!label && label.trim().length > 0 ? (
            <Text style={styles.fieldLabel} numberOfLines={1} ellipsizeMode="tail">
              {label}
            </Text>
          ) : (
            <View />
          )}
          {rightAction}
        </View>
      )}
      {comStepper ? (
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => onValorChange(Math.max(min, valor - 1))}
            activeOpacity={0.7}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text style={styles.stepBtnText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={[
              styles.textInput,
              styles.numberInput,
              styles.stepperInput,
              compact && styles.compactNumberInput,
              inputStyle,
            ]}
            value={texto}
            onChangeText={handleChange}
            onBlur={handleBlur}
            keyboardType="numeric"
            selectTextOnFocus
          />
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => onValorChange(Math.min(max, valor + 1))}
            activeOpacity={0.7}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={[
            styles.textInput,
            styles.numberInput,
            compact && styles.compactNumberInput,
            inputStyle,
          ]}
          value={texto}
          onChangeText={handleChange}
          onBlur={handleBlur}
          keyboardType="numeric"
          selectTextOnFocus
        />
      )}
    </View>
  );
};

interface StepperValorProps {
  valor: number;
  onValorChange: (novo: number) => void;
  min?: number;
  max?: number;
}

export const StepperValor: React.FC<StepperValorProps> = ({
  valor,
  onValorChange,
  min = -99,
  max = 999,
}) => {
  return (
    <View style={styles.stepperRow}>
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onValorChange(Math.max(min, valor - 1))}
      >
        <Text style={styles.stepBtnText}>-</Text>
      </TouchableOpacity>
      <CampoInteiro
        valor={valor}
        onValorChange={onValorChange}
        min={min}
        max={max}
        compact
        style={styles.stepperInputWrap}
      />
      <TouchableOpacity
        style={styles.stepBtn}
        onPress={() => onValorChange(Math.min(max, valor + 1))}
      >
        <Text style={styles.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  headerActionBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerActionText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  fieldWrap: {
    marginBottom: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 22,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    includeFontPadding: false,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: Platform.OS === 'android' ? 6 : 9,
    height: 42,
    fontSize: 14,
    color: COLORS.text,
  },
  textInputDisabled: {
    backgroundColor: '#F0E8D9',
    color: COLORS.textSecondary,
    opacity: 0.85,
  },
  textInputMultiline: {
    height: undefined,
    minHeight: 80,
    textAlignVertical: 'top',
    lineHeight: 20,
    paddingVertical: 10,
  },
  numberInput: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  compactNumberInput: {
    height: 32,
    paddingVertical: 2,
    paddingHorizontal: 6,
    minWidth: 52,
    fontSize: 13,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: {
    width: 30,
    height: 38,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  stepperInputWrap: {
    marginBottom: 0,
    marginHorizontal: 6,
    width: 56,
  },
  stepperInput: {
    flex: 1,
    minWidth: 36,
    marginHorizontal: 4,
  },
});

