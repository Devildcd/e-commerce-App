import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';


import { FormFieldConfig, GenericFormConfig } from '../../interfaces/form-config.interface';

@Component({
  selector: 'app-generic-form',
  imports: [ReactiveFormsModule],
  templateUrl: './generic-form.html',
  styleUrl: './generic-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericForm implements OnInit {

  config = input.required<GenericFormConfig>();

  submitted = output<Record<string, unknown>>();
  cancelled = output<void>();

  // null hasta q se construya
  form: FormGroup | null = null;

  constructor(private readonly fb: FormBuilder) {}

  get fields(): FormFieldConfig[] {
    return this.config().fields;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    const cfg = this.config();
    const group: Record<string, unknown> = {};

    for (const field of cfg.fields) {
      const validators: ValidatorFn[] = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.minLength && field.minLength > 0) {
        validators.push(Validators.minLength(field.minLength));
      }

      if (field.pattern) {
        validators.push(Validators.pattern(field.pattern));
      }

      const initialValue = '';
      group[field.name] = [initialValue, validators];
    }

    this.form = this.fb.group(group);
  }

  onSubmit(): void {
    if (!this.form) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.form.value);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  hasError(field: FormFieldConfig, error: string): boolean {
    if (!this.form) {
      return false;
    }
    const control = this.form.get(field.name);
    return !!control && control.touched && control.hasError(error);
  }
}