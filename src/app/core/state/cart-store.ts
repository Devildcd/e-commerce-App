import { computed } from "@angular/core";
import { signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

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

  withComputed(({ items }) => ({
    totalItems: computed(() =>
      items().reduce((acc, item) => acc + item.quantity, 0)
    ),
    totalAmount: computed(() =>
      items().reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      )
    ),
  })),

  withMethods((store) => ({
    addItem(item: CartItemState): void {
      // TODO: añadir o incrementar cantidad
    },

    removeItem(productId: number): void {
      // TODO
    },

    updateQuantity(productId: number, quantity: number): void {
      // TODO
    },

    clearCart(): void {
      // TODO
    },
  }))
);
