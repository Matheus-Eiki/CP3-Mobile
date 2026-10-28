export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'multiline'
  | 'textarea'
  | 'select'
  | 'combo'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
}

export interface FormConfig {
  title: string;
  description?: string;
  fields: FormField[];
}

export type FieldValue = string | boolean;
export type FormValues = Record<string, FieldValue>;

export interface SavedSubmission {
  id: string;
  submittedAt: string;
  values: FormValues;
}
