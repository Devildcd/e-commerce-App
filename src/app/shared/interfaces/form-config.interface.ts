export interface FormFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  pattern?: string | RegExp;
  patternErrorMessage?: string;
}

export interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit';
}

export interface GenericFormConfig {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  primaryButton: ButtonConfig;
  secondaryButton?: ButtonConfig;
}