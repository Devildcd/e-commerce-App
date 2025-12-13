import {
  signalStore,
  withState,
  withComputed,
  withMethods,
} from '@ngrx/signals';

import { ApiProduct } from "../models/api/product-api.model";
import { computed, inject } from '@angular/core';
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

  withComputed(({ products }) => ({
    filteredProducts: computed(() => products()),
  })),

  withMethods((store, api = inject(ProductApiService)) => ({
    loadCatalog(): void {
      // TODO: usar api.getAll() y api.getCategories()
    },

    reloadCategories(): void {
      // TODO
    },

    setSearchTerm(term: string): void {
      // TODO: actualizar store.searchTerm y recalcular filtro
    },

    setSelectedCategory(category: string | null): void {
      // TODO
    },
  }))
);
