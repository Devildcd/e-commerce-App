import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { NotificationService } from "../services/notification-service";
import { LoggingService } from "../services/logging-service";

export type AuthStatus = 'anonymous' | 'authenticating' | 'authenticated' | 'error';

export interface AuthUser {
  username: string;
  displayName: string;
  initials: string;
}

export interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: null,
};

function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.user()),
    currentUser: computed(() => store.user()),
    initials: computed(() => store.user()?.initials ?? ''),
    displayName: computed(() => store.user()?.displayName ?? ''),
  })),

  withMethods((store, notifications = inject(NotificationService),
    logger = inject(LoggingService)) => ({
      loginWithCredentials(username: string, password: string): void {
        const safeUser = username.trim();
        if (!safeUser || !password) {
          return;
        }

        const displayName = safeUser;
        const initials = buildInitials(displayName);

        const user: AuthUser = {
          username: safeUser,
          displayName,
          initials,
        };

        patchState(store, { user });

        logger.event('login_success', {
          username: safeUser,
          feature: 'auth',
        });

        notifications.success(`Welcome, ${displayName}!`);
      },

      logout(): void {
        const current = store.user();
        if (!current) {
          return;
        }

        patchState(store, { user: null });

        logger.event('logout', {
          username: current.username,
          feature: 'auth',
        });

        notifications.info('Logged out successfully');
      },
    }))
);