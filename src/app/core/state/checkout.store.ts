import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { EMPTY, pipe, timer } from 'rxjs';
import { exhaustMap, map, tap } from 'rxjs';

import { ShippingData } from '../models/domain/checkout.model';
import { CheckoutService } from '../services/checkout-service';
import { CartSnapshot } from './cart-store';

export type CheckoutStatus = 'idle' | 'processing' | 'success' | 'error';

export interface CheckoutState {
  shipping: ShippingData | null;
  status: CheckoutStatus;
  errorMessage: string | null;
}

const initialState: CheckoutState = {
  shipping: null,
  status: 'idle',
  errorMessage: null,
};

export const CheckoutStore = signalStore(
  { providedIn: 'root' },
  withState<CheckoutState>(initialState),

  withComputed((store) => ({
    hasShipping: computed(() => store.shipping() !== null),
    isProcessing: computed(() => store.status() === 'processing'),
    isSuccess: computed(() => store.status() === 'success'),
    isError: computed(() => store.status() === 'error'),
  })),

  withMethods((store, checkoutService = inject(CheckoutService)) => {
    const saveShipping = (raw: Record<string, unknown>): void => {
      const shipping: ShippingData = {
        firstName: String(raw['firstName'] ?? '').trim(),
        lastName: String(raw['lastName'] ?? '').trim(),
        address: String(raw['address'] ?? '').trim(),
        city: String(raw['city'] ?? '').trim(),
        postalCode: String(raw['postalCode'] ?? '').trim(),
      };

      patchState(store, { shipping, errorMessage: null });
      if (store.status() === 'error') patchState(store, { status: 'idle' });
    };

    const submitPayment = rxMethod<{ cart: CartSnapshot; payment: Record<string, unknown> }>(
      pipe(
        tap(({ cart }) => {
          if (!store.shipping()) {
            patchState(store, { status: 'error', errorMessage: 'Please complete shipping first.' });
            return;
          }
          if (!cart.totalItems || cart.totalItems <= 0) {
            patchState(store, { status: 'error', errorMessage: 'Your cart is empty.' });
            return;
          }

          patchState(store, { status: 'processing', errorMessage: null });
        }),

        exhaustMap(({ cart, payment }) => {
          // si fallo corta
          if (store.status() !== 'processing') return EMPTY;

          return timer(2000).pipe(
            map(() => checkoutService.processPayment(cart, payment)),
            tapResponse({
              next: (ok) => {
                patchState(store, {
                  status: ok ? 'success' : 'error',
                  errorMessage: ok ? null : 'Payment failed. Try again.',
                });
              },
              error: () => {
                patchState(store, {
                  status: 'error',
                  errorMessage: 'Payment failed. Try again.',
                });
              },
            })
          );
        })
      )
    );

    const reset = (): void => patchState(store, { ...initialState });

    return {
      saveShipping,
      submitPayment,
      reset,
      startPayment(): void {
        patchState(store, { status: 'processing', errorMessage: null });
      },
      markPaymentSuccess(): void {
        patchState(store, { status: 'success', errorMessage: null });
      },
      markPaymentError(): void {
        patchState(store, { status: 'error', errorMessage: 'Payment failed. Try again.' });
      },
    };
  })
);