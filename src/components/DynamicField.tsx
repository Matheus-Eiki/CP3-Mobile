import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';
import type { FieldOption, FieldType, FormField, FieldValue } from '../types/form';

interface DynamicFieldProps {
  field: FormField;
  value: FieldValue | undefined;
  error?: string;
  onChange: (id: string, value: FieldValue) => void;
}

function isOptionType(type: FieldType): boolean {
  return type === 'select' || type === 'combo' || type === 'radio';
}

export default function DynamicField({ field, value, error, onChange }: DynamicFieldProps) {
  const stringValue = typeof value === 'string' ? value : '';
  const requiredLabel = field.required ? ' *' : '';

  const renderOptions = (options: FieldOption[], radio: boolean) => (
    <View style={styles.optionsContainer}>
      {options.map((option) => {
        const selected = stringValue === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(field.id, option.value)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            {radio ? <Text style={styles.radioMark}>{selected ? '🔘' : '◯'}</Text> : null}
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
              {option.label}
            </Text>
            {field.type === 'select' || field.type === 'combo' ? (
              selected ? <Text style={styles.checkMark}>✓</Text> : null
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );

  let control: React.ReactNode;

  if (isOptionType(field.type)) {
    const options = field.options ?? [];
    const selectedLabel = options.find((option) => option.value === stringValue)?.label;
    control = (
      <>
        {field.type === 'select' || field.type === 'combo' ? (
          <Text style={styles.selectedHint}>
            {selectedLabel ? `Selecionado: ${selectedLabel}` : 'Toque em uma opção:'}
          </Text>
        ) : null}
        {renderOptions(options, field.type === 'radio')}
      </>
    );
  } else if (field.type === 'checkbox') {
    const checked = value === true;
    control = (
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={() => onChange(field.id, !checked)}
        style={styles.checkboxRow}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked ? <Text style={styles.checkboxTick}>✓</Text> : null}
        </View>
        <Text style={styles.optionText}>{checked ? 'Marcado' : 'Marcar opção'}</Text>
      </Pressable>
    );
  } else if (field.type === 'switch') {
    control = (
      <View style={styles.switchRow}>
        <Text style={styles.optionText}>{value === true ? 'Ativado' : 'Desativado'}</Text>
        <Switch
          value={value === true}
          onValueChange={(nextValue) => onChange(field.id, nextValue)}
          accessibilityLabel={field.label}
        />
      </View>
    );
  } else {
    const isMultiline = field.type === 'multiline' || field.type === 'textarea';
    const isPassword = field.type === 'password';
    const keyboardType = field.type === 'email'
      ? 'email-address'
      : field.type === 'number'
        ? 'numeric'
        : 'default';

    control = (
      <TextInput
        value={stringValue}
        onChangeText={(text) => onChange(field.id, text)}
        placeholder={field.placeholder ?? `Digite ${field.label.toLowerCase()}`}
        placeholderTextColor="#8A94A6"
        secureTextEntry={isPassword}
        keyboardType={keyboardType}
        autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
        autoCorrect={field.type !== 'email' && !isPassword}
        multiline={isMultiline}
        numberOfLines={isMultiline ? 4 : 1}
        textAlignVertical={isMultiline ? 'top' : 'center'}
        style={[styles.input, isMultiline && styles.multilineInput]}
        {...(field.type === 'date' && Platform.OS === 'web'
          ? { inputMode: 'text' as const }
          : {})}
        accessibilityLabel={field.label}
      />
    );
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{field.label}{requiredLabel}</Text>
      {control}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 18 },
  label: { fontSize: 15, fontWeight: '700', color: '#202939', marginBottom: 8 },
  input: {
    minHeight: 48, borderWidth: 1, borderColor: '#CBD2DE', borderRadius: 10,
    paddingHorizontal: 13, paddingVertical: 11, color: '#172033', backgroundColor: '#FFFFFF',
    fontSize: 15
  },
  multilineInput: { minHeight: 100 },
  optionsContainer: { gap: 8 },
  option: {
    minHeight: 44, borderWidth: 1, borderColor: '#CBD2DE', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row',
    alignItems: 'center', gap: 9, backgroundColor: '#FFFFFF'
  },
  optionSelected: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  optionText: { color: '#273449', fontSize: 14, flexShrink: 1 },
  optionTextSelected: { color: '#1D4ED8', fontWeight: '600' },
  radioMark: { width: 20, fontSize: 15 },
  checkMark: { marginLeft: 'auto', color: '#1D4ED8', fontWeight: '700' },
  selectedHint: { fontSize: 13, color: '#64748B', marginBottom: 8 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 42 },
  checkbox: {
    width: 22, height: 22, borderWidth: 1.5, borderColor: '#94A3B8',
    borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF'
  },
  checkboxChecked: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  checkboxTick: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#CBD2DE', borderRadius: 10, paddingHorizontal: 12, minHeight: 48
  },
  error: { marginTop: 6, color: '#B91C1C', fontSize: 13 }
});
