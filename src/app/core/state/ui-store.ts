import {
  signalStore,
  withState,
  withComputed,
  withMethods,
} from '@ngrx/signals';

export type Theme = 'light' | 'dark' | 'system';

export type NotificationKind = 'success' | 'error' | 'info';

export interface UiNotification {
  id: string;
  type: NotificationKind;
  message: string;
}

export interface UiState {
  theme: Theme;
  notifications: UiNotification[];
  sidebarOpen: boolean;
}

const initialState: UiState = {
  theme: 'light',
  notifications: [],
  sidebarOpen: false,
};

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    setTheme(theme: Theme): void {
      // TODO
    },

    addNotification(notification: UiNotification): void {
      // TODO
    },

    dismissNotification(id: string): void {
      // TODO
    },

    toggleSidebar(): void {
      // TODO
    },
  }))
);
