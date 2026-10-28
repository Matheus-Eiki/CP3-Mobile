import type { FormConfig, FormValues } from '../types/form';

export type ValidationErrors = Record<string, string>;

export function validateForm(config: FormConfig, values: FormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field of config.fields) {
    if (!field.required) continue;

    const value = values[field.id];

    if (field.type === 'switch') {
      // false é uma resposta válida para um switch opcional ou obrigatório.
      if (typeof value !== 'boolean') errors[field.id] = 'Selecione uma opção.';
      continue;
    }

    if (field.type === 'checkbox') {
      if (value !== true) errors[field.id] = 'Marque esta opção para continuar.';
      continue;
    }

    if (typeof value !== 'string' || value.trim().length === 0) {
      errors[field.id] = 'Este campo é obrigatório.';
      continue;
    }

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      errors[field.id] = 'Informe um e-mail válido.';
    } else if (field.type === 'number' && (!Number.isFinite(Number(value)) || value.trim() === '')) {
      errors[field.id] = 'Informe um número válido.';
    } else if (field.type === 'password' && value.length < 6) {
      errors[field.id] = 'A senha deve ter pelo menos 6 caracteres.';
    } else if (field.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      errors[field.id] = 'Use o formato AAAA-MM-DD.';
    } else if (field.type === 'date') {
      const date = new Date(`${value}T00:00:00`);
      if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
        errors[field.id] = 'Informe uma data real no formato AAAA-MM-DD.';
      }
    }
  }

  return errors;
}
