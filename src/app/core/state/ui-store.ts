import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

export type Theme = 'light' | 'dark' | 'system';

export type NotificationKind = 'success' | 'error' | 'info' | 'warning';

export interface UiNotification {
  id: string;
  type: NotificationKind;
  message: string;
}

export interface UiState {
  theme: Theme;
  notifications: UiNotification[];
}

const initialState: UiState = {
  theme: 'light',
  notifications: [],
};

function createId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

 withMethods((store) => ({
    setTheme(theme: Theme): void {
      patchState(store, { theme });
    },

    addNotification(notification: Omit<UiNotification, 'id'>): void {
      const id = createId();
      const next = [...store.notifications(), { ...notification, id }];
      patchState(store, { notifications: next });
    },

    dismissNotification(id: string): void {
      const next = store
        .notifications()
        .filter((notification) => notification.id !== id);
      patchState(store, { notifications: next });
    },

  }))
);
