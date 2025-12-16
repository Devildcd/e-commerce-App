import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { NotificationService } from '../services/notification-service';
import { LoggingService } from '../services/logging-service';

export type AuthStatus = 'anonymous' | 'authenticating' | 'authenticated' | 'error';

export interface AuthUser {
  username: string;
  displayName: string;
  initials: string;
}

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  errorMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'anonymous',
  errorMessage: null,
};

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';

  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  const first = parts[0][0] ?? '';
  const last = parts.at(-1)?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    isAuthenticated: computed(() => store.status() === 'authenticated' && store.user() !== null),
    initials: computed(() => store.user()?.initials ?? ''),
    displayName: computed(() => store.user()?.displayName ?? ''),
    status: computed(() => store.status()),
    errorMessage: computed(() => store.errorMessage()),
  })),

  withMethods(
    (store,
     notifications = inject(NotificationService),
     logger = inject(LoggingService)) => ({

      loginWithCredentials(username: string, password: string): void {
        const safeUser = (username ?? '').trim();

        const current = store.user();
        if (current && store.status() === 'authenticated' && current.username === safeUser) return;

        if (!safeUser || !password) {
          patchState(store, {
            user: null,
            status: 'error',
            errorMessage: 'Username and password are required.',
          });
          notifications.error('Please enter username and password.');
          return;
        }

        patchState(store, { status: 'authenticating', errorMessage: null });

        const displayName = safeUser;
        const user: AuthUser = {
          username: safeUser,
          displayName,
          initials: buildInitials(displayName),
        };

        patchState(store, {
          user,
          status: 'authenticated',
          errorMessage: null,
        });

        logger.event('login_success', { username: safeUser, feature: 'auth' });
        notifications.success(`Welcome, ${displayName}!`);
      },

      logout(): void {
        const current = store.user();
        if (!current) return;

        patchState(store, { user: null, status: 'anonymous', errorMessage: null });

        logger.event('logout', { username: current.username, feature: 'auth' });
        notifications.info('Logged out successfully');
      },

      clearError(): void {
        if (store.status() === 'error') {
          patchState(store, { status: store.user() ? 'authenticated' : 'anonymous', errorMessage: null });
        } else {
          patchState(store, { errorMessage: null });
        }
      },
    })
  )
);