import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Product } from "../models/domain/product.model";

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface CartSnapshot {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// helper pa clone
function cloneItems(items: readonly CartItem[]): CartItem[] {
  return items.map(i => ({ ...i, product: { ...i.product } }));
}

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
    addProduct(product: Product, quantity = 1): void {
      if (!product) {
        return;
      }

      const items = store.items();
      const index = items.findIndex(
        (item) => item.productId === product.id
      );

      const safeQuantity = quantity > 0 ? quantity : 1;

      let next: CartItem[];

      if (index === -1) {
        next = [
          ...items,
          {
            productId: product.id,
            product,
            quantity: safeQuantity,
            unitPrice: product.price,
          },
        ];
      } else {
        next = items.map((item, i) =>
          i === index
            ? {
              ...item,
              quantity: item.quantity + safeQuantity,
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
      const normalized = Math.max(0, quantity);

      if (normalized === 0) {
        const next = store
          .items()
          .filter((item) => item.productId !== productId);
        patchState(store, { items: next });
        return;
      }

      const next = store.items().map((item) =>
        item.productId === productId
          ? { ...item, quantity: normalized }
          : item
      );

      patchState(store, { items: next });
    },

    clear(): void {
      patchState(store, { items: [] });
    },

    // snapshoot pa luego, cuando este listo checkout
    getSnapshot() {
      const items = store.items();
      const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalAmount = items.reduce(
        (total, item) => total + item.quantity * item.unitPrice,
        0
      );

      return {
        items,
        totalItems,
        totalAmount,
      };
    },

    // para restaurar la sesion desde el local storage y q no se pierda el state del cart
    restore(items: CartItem[]): void {
      if (!Array.isArray(items)) {
        return;
      }
      patchState(store, { items });
    },
  }))
);
