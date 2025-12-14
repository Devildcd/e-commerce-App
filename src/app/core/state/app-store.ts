import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

export interface AppState {
  miniCartOpen: boolean;
}

const initialState: AppState = {
  miniCartOpen: false,
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
  }))
);