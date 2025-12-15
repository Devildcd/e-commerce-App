import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";

import { Product } from "../models/domain/product.model";
import { ProductApiService } from "../services/product-api-service";
import { CatalogStore } from "./catalog-store";

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ProductDetailsState {
  product: Product | null;
  status: LoadStatus;
  errorMessage: string | null;
}

const initialState: ProductDetailsState = {
  product: null,
  status: 'idle',
  errorMessage: null,
};

export const ProductDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    hasProduct: computed(() => !!store.product()),
  })),

  withMethods((store, api = inject(ProductApiService)) => ({
    loadById(id: number): void {
      const current = store.product();

      // si ya tengo el producto correcto y estoy en success, no hago nada
      if (current && current.id === id && store.status() === 'success') {
        return;
      }

      patchState(store, {
        status: 'loading',
        errorMessage: null,
        product: null,
      });

      api.getProductsById(id).subscribe({
        next: (product) => {
          patchState(store, {
            product,
            status: 'success',
            errorMessage: null,
          });
        },
        error: () => {
          patchState(store, {
            status: 'error',
            errorMessage: 'No se pudo cargar este producto.',
          });
        },
      });
    },

    setProduct(product: Product): void {
      patchState(store, {
        product,
        status: 'success',
        errorMessage: null,
      });
    },

    clear(): void {
      patchState(store, initialState);
    },
  }))
);