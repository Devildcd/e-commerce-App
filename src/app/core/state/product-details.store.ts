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

  withMethods(
    (
      store,
      api = inject(ProductApiService),
      catalog = inject(CatalogStore)
    ) => ({
      loadById(id: number): void {
        // Si ya tengo no hago nada
        const current = store.product();
        if (current && current.id === id && store.status() === 'success') {
          return;
        }

        // probar desde el catalog, pa optimizar
        const fromCatalog = catalog
          .products()
          .find((item) => item.id === id);

        if (fromCatalog) {
          patchState(store, {
            product: fromCatalog,
            status: 'success',
            errorMessage: null,
          });
          return;
        }

        // Si no esta en catalog, si tengo q ir a la api
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

      clear(): void {
        patchState(store, initialState);
      },
    })
  )
);