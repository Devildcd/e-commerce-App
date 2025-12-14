import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

export interface AppState {
  miniCartOpen: boolean;
  loginModalOpen: boolean;
}

const initialState: AppState = {
  miniCartOpen: false,
  loginModalOpen: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<AppState>(initialState),
  withMethods((store) => ({
    openMiniCart(): void {
      patchState(store, { miniCartOpen: true });
    },

    closeMiniCart(): void {
      patchState(store, { miniCartOpen: false });
    },

    toggleMiniCart(): void {
      patchState(store, { miniCartOpen: !store.miniCartOpen() });
    },

    // metods para el login
    openLoginModal(): void {
      patchState(store, { loginModalOpen: true });
    },

    closeLoginModal(): void {
      patchState(store, { loginModalOpen: false });
    },

    toggleLoginModal(): void {
      patchState(store, { loginModalOpen: !store.loginModalOpen() });
    },
  }))
);