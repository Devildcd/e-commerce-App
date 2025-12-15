import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

import { ShippingData } from "../models/domain/checkout.model";

export type CheckoutStatus = 'idle' | 'processing' | 'success' | 'error';

export interface CheckoutState {
  shipping: ShippingData | null;
  status: CheckoutStatus;
}

const initialState: CheckoutState = {
  shipping: null,
  status: 'idle',
};

export const CheckoutStore = signalStore(
  { providedIn: 'root' },
  withState<CheckoutState>(initialState),

  withComputed((store) => ({
    hasShipping: computed(() => !!store.shipping()),
    isProcessing: computed(() => store.status() === 'processing'),
  })),

  withMethods((store) => ({
    saveShipping(raw: Record<string, unknown>): void {
      const shipping: ShippingData = {
        firstName: String(raw['firstName'] ?? '').trim(),
        lastName: String(raw['lastName'] ?? '').trim(),
        address: String(raw['address'] ?? '').trim(),
        city: String(raw['city'] ?? '').trim(),
        postalCode: String(raw['postalCode'] ?? '').trim(),
      };

      patchState(store, { shipping });
    },

    startPayment(): void {
      patchState(store, { status: 'processing' });
    },

    markPaymentSuccess(): void {
      patchState(store, { status: 'success' });
    },

    markPaymentError(): void {
      patchState(store, { status: 'error' });
    },

    reset(): void {
      patchState(store, initialState);
    },
  }))
);