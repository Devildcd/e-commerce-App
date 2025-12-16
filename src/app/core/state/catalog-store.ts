import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, forkJoin, pipe, tap } from 'rxjs';

import { ProductApiService } from '../services/product-api-service';
import { Product } from '../models/domain/product.model';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CatalogState {
  products: Product[];
  categories: string[];
  selectedCategory: string | null;
  searchTerm: string;
  status: LoadStatus;
  errorMessage: string | null;

  pageIndex: number;
  pageSize: number;
}

const initialState: CatalogState = {
  products: [],
  categories: [],
  selectedCategory: null,
  searchTerm: '',
  status: 'idle',
  errorMessage: null,
  pageIndex: 0,
  pageSize: 8,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function filterProducts(
  products: readonly Product[],
  category: string | null,
  searchTerm: string
): Product[] {
  if (!products.length) return [];

  const term = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    if (category && product.category !== category) return false;
    if (!term) return true;

    const text = `${product.title} ${product.description}`.toLowerCase();
    return text.includes(term);
  });
}

export const CatalogStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => {
    const filteredProducts = computed(() =>
      filterProducts(store.products(), store.selectedCategory(), store.searchTerm())
    );

    const filteredCount = computed(() => filteredProducts().length);

    const totalPages = computed(() => {
      const size = store.pageSize();
      const count = filteredCount();
      if (size <= 0) return 1;
      return Math.max(1, Math.ceil(count / size));
    });

    const safePageIndex = computed(() => clamp(store.pageIndex(), 0, totalPages() - 1));

    const currentPageProducts = computed(() => {
      const items = filteredProducts();
      const size = store.pageSize();
      if (!items.length || size <= 0) return [];

      const start = safePageIndex() * size;
      return items.slice(start, start + size);
    });

    const hasPrevPage = computed(() => safePageIndex() > 0);

    const hasNextPage = computed(() => {
      if (filteredCount() === 0) return false;
      return safePageIndex() < totalPages() - 1;
    });

    return {
      filteredProducts,
      filteredCount,
      totalPages,
      safePageIndex,
      currentPageProducts,
      hasPrevPage,
      hasNextPage,
    };
  }),

  withMethods((store, api = inject(ProductApiService)) => {
    const clampToPages = (desired: number): number =>
      clamp(desired, 0, store.totalPages() - 1);

    const validateCategory = (categories: string[], current: string | null) =>
      current && categories.includes(current) ? current : null;

    const loadCatalog = rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { status: 'loading', errorMessage: null });
        }),
        exhaustMap(() =>
          forkJoin({
            products: api.getAllProducts(),
            categories: api.getAllCategories(),
          }).pipe(
            tapResponse({
              next: ({ products, categories }) => {
                patchState(store, {
                  products,
                  categories,
                  selectedCategory: validateCategory(categories, store.selectedCategory()),
                  status: 'success',
                  errorMessage: null,
                  pageIndex: 0,
                });
              },
              error: () => {
                patchState(store, {
                  status: 'error',
                  errorMessage: 'The catalog could not be loaded.',
                });
              },
            })
          )
        )
      )
    );

    const reloadCategories = rxMethod<void>(
      pipe(
        exhaustMap(() =>
          api.getAllCategories().pipe(
            tapResponse({
              next: (categories) => {
                patchState(store, {
                  categories,
                  selectedCategory: validateCategory(categories, store.selectedCategory()),
                  pageIndex: clampToPages(0),
                });
              },
              error: () => {
                if (!store.errorMessage()) {
                  patchState(store, {
                    errorMessage: 'The categories could not be updated.',
                  });
                }
              },
            })
          )
        )
      )
    );

    return {
      loadCatalog,
      reloadCategories,

      setSearchTerm(term: string | null | undefined): void {
        patchState(store, { searchTerm: (term ?? '').trim(), pageIndex: 0 });
      },

      setSelectedCategory(category: string | null): void {
        const normalized = category || null;
        if (normalized && !store.categories().includes(normalized)) return;

        patchState(store, { selectedCategory: normalized, pageIndex: 0 });
      },

      goToPage(index: number): void {
        patchState(store, { pageIndex: clampToPages(index) });
      },

      nextPage(): void {
        patchState(store, { pageIndex: clampToPages(store.safePageIndex() + 1) });
      },

      prevPage(): void {
        patchState(store, { pageIndex: clampToPages(store.safePageIndex() - 1) });
      },
    };
  })
);