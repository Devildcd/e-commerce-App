import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

export interface CartItemState {
  productId: number;
  title: string;
  unitPrice: number;
  quantity: number;
}

export interface CartState {
  items: CartItemState[];
}

const initialState: CartState = {
  items: [],
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    totalItems: computed(() =>
      store.items().reduce((total, item) => total + item.quantity, 0)
    ),

    totalAmount: computed(() =>
      store.items().reduce(
        (total, item) => total + item.quantity * item.unitPrice,
        0
      )
    ),

    isEmpty: computed(() => store.items().length === 0),
  })),

  withMethods((store) => ({
    addItem(payload: CartItemState): void {
      const current = store.items();
      const index = current.findIndex(
        (item) => item.productId === payload.productId
      );

      let next: CartItemState[];

      if (index === -1) {
        const quantity = payload.quantity > 0 ? payload.quantity : 1;
        next = [...current, { ...payload, quantity }];
      } else {
        next = current.map((item, i) =>
          i === index
            ? {
                ...item,
                quantity: item.quantity + (payload.quantity || 1),
              }
            : item
        );
      }

      patchState(store, { items: next });
    },

    removeItem(productId: number): void {
      const next = store
        .items()
        .filter((item) => item.productId !== productId);

      patchState(store, { items: next });
    },

    updateQuantity(productId: number, quantity: number): void {
      if (quantity <= 0) {
        const next = store
          .items()
          .filter((item) => item.productId !== productId);
        patchState(store, { items: next });
        return;
      }

      const next = store.items().map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      patchState(store, { items: next });
    },

    clear(): void {
      patchState(store, { items: [] });
    },
  }))
);