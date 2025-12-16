import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap, of } from 'rxjs';

import { Product } from '../models/domain/product.model';
import { ProductApiService } from '../services/product-api-service';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ProductDetailsState {
  product: Product | null;
  status: LoadStatus;
  errorMessage: string | null;

  requestedId: number | null;
}

const initialState: ProductDetailsState = {
  product: null,
  status: 'idle',
  errorMessage: null,
  requestedId: null,
};

function isValidId(id: number): boolean {
  return Number.isFinite(id) && id > 0;
}

export const ProductDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    hasProduct: computed(() => store.product() !== null),
  })),

  withMethods((store, api = inject(ProductApiService)) => {
    const loadById = rxMethod<number>(
      pipe(
        tap((id) => {
          if (!isValidId(id)) {
            patchState(store, {
              product: null,
              status: 'error',
              errorMessage: 'Invalid product id.',
              requestedId: null,
            });
            return;
          }

          const current = store.product();
          if (current && current.id === id && store.status() === 'success') {
            // ya tengo el producto correcto
            return;
          }

          patchState(store, {
            requestedId: id,
            status: 'loading',
            errorMessage: null,
            product: null,
          });
        }),

        switchMap((id) => {
          if (!isValidId(id)) return of(null);

          return api.getProductsById(id).pipe(
            tapResponse({
              next: (product) => {
                if (store.requestedId() !== id) return;

                patchState(store, {
                  product,
                  status: 'success',
                  errorMessage: null,
                });
              },
              error: () => {
                if (store.requestedId() !== id) return;

                patchState(store, {
                  product: null,
                  status: 'error',
                  errorMessage: 'This product could not be loaded.',
                });
              },
            })
          );
        })
      )
    );

    return {
      loadById,

      setProduct(product: Product): void {
        patchState(store, {
          product,
          status: 'success',
          errorMessage: null,
          requestedId: product.id,
        });
      },

      clear(): void {
        patchState(store, { ...initialState });
      },
    };
  })
);