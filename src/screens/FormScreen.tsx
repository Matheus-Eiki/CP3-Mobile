import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import DynamicField from '../components/DynamicField';
import formConfig from '../config/formConfig';
import { clearSubmissions, loadSubmissions, saveSubmission } from '../services/submissionStorage';
import type { FieldValue, FormValues, SavedSubmission } from '../types/form';
import { validateForm, type ValidationErrors } from '../utils/validation';

function showMessage(title: string, message: string): void {
  if (Platform.OS === 'web') {
    // Alert.alert não é consistente na Web; a mensagem também aparece na própria interface.
    return;
  }
  Alert.alert(title, message);
}

function formatValue(value: FieldValue): string {
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  return value.trim() ? value : '—';
}

export default function FormScreen() {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submissions, setSubmissions] = useState<SavedSubmission[]>([]);
  const [statusMessage, setStatusMessage] = useState('Carregando dados salvos...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restore(): Promise<void> {
      try {
        const saved = await loadSubmissions();
        if (mounted) {
          setSubmissions(saved);
          setStatusMessage(saved.length > 0 ? 'Dados salvos recuperados do armazenamento local.' : 'Nenhum envio salvo ainda.');
        }
      } catch {
        if (mounted) setStatusMessage('Não foi possível recuperar os dados salvos.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void restore();
    return () => { mounted = false; };
  }, []);

  const initialValues = useMemo<FormValues>(() => {
    const initial: FormValues = {};
    for (const field of formConfig.fields) {
      if (field.type === 'checkbox') initial[field.id] = false;
      else if (field.type === 'switch') initial[field.id] = false;
      else initial[field.id] = '';
    }
    return initial;
  }, []);

  const updateField = useCallback((id: string, value: FieldValue) => {
    setValues((current) => ({ ...current, [id]: value }));
    setErrors((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  const resetForm = useCallback(() => {
    setValues({ ...initialValues });
    setErrors({});
  }, [initialValues]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForm(formConfig, values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatusMessage('Revise os campos destacados antes de enviar.');
      showMessage('Verifique o formulário', 'Preencha corretamente os campos obrigatórios.');
      return;
    }

    const submission: SavedSubmission = {
      id: `${Date.now()}`,
      submittedAt: new Date().toISOString(),
      values: { ...initialValues, ...values }
    };

    try {
      const updated = await saveSubmission(submission);
      setSubmissions(updated);
      setStatusMessage('Formulário enviado e salvo localmente com sucesso.');
      resetForm();
      showMessage('Sucesso', 'Os dados foram enviados e salvos neste dispositivo.');
    } catch {
      setStatusMessage('O formulário foi validado, mas ocorreu um erro ao salvar os dados.');
      showMessage('Erro ao salvar', 'Não foi possível salvar os dados localmente.');
    }
  }, [initialValues, resetForm, values]);

  const handleClear = useCallback(async () => {
    try {
      await clearSubmissions();
      setSubmissions([]);
      setStatusMessage('Todos os envios salvos foram apagados.');
      showMessage('Dados apagados', 'O armazenamento local foi limpo.');
    } catch {
      setStatusMessage('Não foi possível limpar o armazenamento local.');
      showMessage('Erro', 'Não foi possível apagar os dados salvos.');
    }
  }, []);

  const latestSubmission = submissions[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CHECKPOINT 3 • REACT NATIVE</Text>
        <Text style={styles.title}>{formConfig.title}</Text>
        {formConfig.description ? <Text style={styles.description}>{formConfig.description}</Text> : null}
      </View>

      <View style={styles.card}>
        {formConfig.fields.map((field) => (
          <DynamicField
            key={field.id}
            field={field}
            value={values[field.id]}
            error={errors[field.id]}
            onChange={updateField}
          />
        ))}
        <Pressable accessibilityRole="button" onPress={() => void handleSubmit()} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Enviar formulário</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={resetForm} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Limpar campos</Text>
        </Pressable>
      </View>

      <View style={styles.statusBox}>
        <Text style={styles.sectionTitle}>Status</Text>
        <Text style={styles.statusText}>{loading ? 'Carregando...' : statusMessage}</Text>
        <Text style={styles.statusText}>Envios armazenados: {submissions.length}</Text>
      </View>

      {latestSubmission ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Último resultado salvo</Text>
          <Text style={styles.dateText}>
            Enviado em: {new Date(latestSubmission.submittedAt).toLocaleString()}
          </Text>
          {formConfig.fields.map((field) => (
            <View key={field.id} style={styles.resultRow}>
              <Text style={styles.resultLabel}>{field.label}</Text>
              <Text style={styles.resultValue}>
                {formatValue(latestSubmission.values[field.id] ?? '')}
              </Text>
            </View>
          ))}
          <Pressable accessibilityRole="button" onPress={() => void handleClear()} style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Apagar todos os dados salvos</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.sectionTitle}>Resultado</Text>
          <Text style={styles.statusText}>Envie o formulário para visualizar e salvar os dados aqui.</Text>
          <Pressable accessibilityRole="button" onPress={() => void handleClear()} style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Limpar dados persistidos</Text>
          </Pressable>
        </View>
      )}

      {submissions.length > 1 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Envios anteriores</Text>
          {submissions.slice(1).map((submission) => (
            <View key={submission.id} style={styles.historyRow}>
              <Text style={styles.historyTitle}>
                {typeof submission.values.name === 'string' && submission.values.name
                  ? submission.values.name
                  : 'Envio sem nome'}
              </Text>
              <Text style={styles.dateText}>{new Date(submission.submittedAt).toLocaleString()}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <Text style={styles.footer}>Os dados ficam armazenados localmente neste dispositivo/navegador.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F6FB' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 18, paddingBottom: 42 },
  header: { paddingTop: 18, paddingBottom: 18 },
  eyebrow: { color: '#2563EB', fontWeight: '800', letterSpacing: 1, fontSize: 12, marginBottom: 8 },
  title: { color: '#172033', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  description: { color: '#596579', fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  primaryButton: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 2 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  secondaryButton: { paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  secondaryButtonText: { color: '#334155', fontWeight: '700' },
  statusBox: { padding: 16, borderRadius: 12, backgroundColor: '#EAF2FF', marginBottom: 16 },
  sectionTitle: { fontSize: 18, color: '#172033', fontWeight: '800', marginBottom: 10 },
  statusText: { color: '#42516A', fontSize: 14, lineHeight: 21, marginBottom: 4 },
  dateText: { color: '#64748B', fontSize: 12, marginBottom: 10 },
  resultRow: { paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#E8EDF4' },
  resultLabel: { fontSize: 12, color: '#64748B', fontWeight: '700', marginBottom: 3 },
  resultValue: { fontSize: 15, color: '#172033' },
  dangerButton: { backgroundColor: '#FEE2E2', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 10, alignItems: 'center', marginTop: 16 },
  dangerButtonText: { color: '#991B1B', fontWeight: '800', textAlign: 'center' },
  emptyBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  historyRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E8EDF4' },
  historyTitle: { color: '#172033', fontWeight: '700', marginBottom: 4 },
  footer: { textAlign: 'center', color: '#64748B', fontSize: 12, lineHeight: 18, paddingHorizontal: 10 }
});
