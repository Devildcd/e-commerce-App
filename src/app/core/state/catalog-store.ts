import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

import { forkJoin } from 'rxjs';

import { ApiProduct } from "../models/api/product-api.model";
import { ProductApiService } from '../services/product-api-service';


type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CatalogState {
  products: ApiProduct[];
  categories: string[];
  selectedCategory: string | null;
  searchTerm: string;
  status: LoadStatus;
  errorMessage: string | null;
}

const initialState: CatalogState = {
  products: [],
  categories: [],
  selectedCategory: null,
  searchTerm: '',
  status: 'idle',
  errorMessage: null,
};

export const CatalogStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

   withComputed((store) => ({
    filteredProducts: computed(() => {
      const items = store.products();
      const category = store.selectedCategory();
      const term = store.searchTerm().trim().toLowerCase();

      if (!items.length) {
        return [];
      }

      return items.filter((product) => {
        if (category && product.category !== category) {
          return false;
        }

        if (!term) {
          return true;
        }

        const text = `${product.title} ${product.description}`.toLowerCase();
        return text.includes(term);
      });
    }),
  })),

  withMethods((store, api = inject(ProductApiService)) => ({
    loadCatalog(): void {
      // Pa lanzar solo una vez, por si acaso
      if (store.status() === 'loading') {
        return;
      }

      patchState(store, {
        status: 'loading',
        errorMessage: null,
      });

      forkJoin({
        products: api.getAllProducts(),
        categories: api.getAllCategories(),
      }).subscribe({
        next: ({ products, categories }) => {
          const currentCategory = store.selectedCategory();
          const validCategory =
            currentCategory && categories.includes(currentCategory)
              ? currentCategory
              : null;

          patchState(store, {
            products,
            categories,
            selectedCategory: validCategory,
            status: 'success',
            errorMessage: null,
          });
        },
        error: () => {
          patchState(store, {
            status: 'error',
            errorMessage: 'No se pudo cargar el catálogo.',
          });
        },
      });
    },

    reloadCategories(): void {
      api.getAllCategories().subscribe({
        next: (categories) => {
          const currentCategory = store.selectedCategory();
          const validCategory =
            currentCategory && categories.includes(currentCategory)
              ? currentCategory
              : null;

          patchState(store, {
            categories,
            selectedCategory: validCategory,
          });
        },
        error: () => {
          if (!store.errorMessage()) {
            patchState(store, {
              errorMessage: 'No se pudieron actualizar las categorías.',
            });
          }
        },
      });
    },

    setSearchTerm(term: string): void {
      patchState(store, {
        searchTerm: term?.trim() ?? '',
      });
    },

    setSelectedCategory(category: string | null): void {
      const normalized = category || null;

      if (normalized && !store.categories().includes(normalized)) {
        return; // recordar, si me llega algo q no esta en la lista lo ignoro
      }

      patchState(store, {
        selectedCategory: normalized,
      });
    },
  }))
);
