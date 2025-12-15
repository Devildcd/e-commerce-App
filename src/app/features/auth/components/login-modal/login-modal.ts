import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Router } from '@angular/router';

import { AppStore } from '../../../../core/state/app-store';
import { GenericFormConfig } from '../../../../shared/interfaces/form-config.interface';
import { GenericForm } from '../../../../shared/components/generic-form/generic-form';
import { AuthStore } from '../../../../core/state/auth-store';

@Component({
  selector: 'app-login-modal',
  imports: [GenericForm],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModal {

   private readonly appStore = inject(AppStore);
   private readonly authStore = inject(AuthStore);
   private readonly router = inject(Router);

   readonly isOpen = this.appStore.loginModalOpen;

  readonly formConfig: GenericFormConfig = {
  title: 'Log in',
  fields: [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'name',
      required: true,
      minLength: 3,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      required: true,
      minLength: 8,
      pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
      patternErrorMessage:
        'Must be at least 8 characters long and include uppercase, lowercase, numbers, and a symbol.',
    },
  ],
  primaryButton: {
    label: 'Enter',
    type: 'submit',
  },
  secondaryButton: {
    label: 'Cancel',
    type: 'button',
  },
};

  onSubmitted(value: Record<string, unknown>): void {
    const username = (value['username'] ?? '').toString().trim();
    const password = (value['password'] ?? '').toString();

    if (!username || !password) {
      return;
    }

    this.authStore.loginWithCredentials(username, password);
    this.router.navigate(["/checkout"]);

    this.close();
  }

  onCancelled(): void {
    this.close();
  }

  close(): void {
    this.appStore.closeLoginModal();
  }
}
