import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

import { forkJoin } from 'rxjs';

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

// helper para filtrar productos
function filterProducts(
  products: Product[],
  category: string | null,
  searchTerm: string
): Product[] {
  if (!products.length) {
    return [];
  }

  const term = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    if (category && product.category !== category) {
      return false;
    }

    if (!term) {
      return true;
    }

    const text = `${product.title} ${product.description}`.toLowerCase();
    return text.includes(term);
  });
}

export const CatalogStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => {
    const filteredProducts = computed(() =>
      filterProducts(
        store.products(),
        store.selectedCategory(),
        store.searchTerm()
      )
    );

    const totalPages = computed(() => {
      const items = filteredProducts();
      const size = store.pageSize();

      if (!items.length || size <= 0) {
        return 1;
      }

      return Math.ceil(items.length / size);
    });

    // productos de la página actual
    const currentPageProducts = computed(() => {
      const items = filteredProducts();
      const size = store.pageSize();

      if (!items.length || size <= 0) {
        return [];
      }

      const total = totalPages();
      const rawIndex = store.pageIndex();
      const safeIndex = Math.min(Math.max(rawIndex, 0), total - 1);

      const start = safeIndex * size;
      const end = start + size;

      return items.slice(start, end);
    });

    const hasPrevPage = computed(() => store.pageIndex() > 0);

    const hasNextPage = computed(() => {
      const items = filteredProducts();
      const size = store.pageSize();

      if (!items.length || size <= 0) {
        return false;
      }

      const total = totalPages();
      return store.pageIndex() < total - 1;
    });

    return {
      filteredProducts,
      totalPages,
      currentPageProducts,
      hasPrevPage,
      hasNextPage,
    };
  }),

  withMethods((store, api = inject(ProductApiService)) => {
    const getFilteredCount = (): number =>
      filterProducts(
        store.products(),
        store.selectedCategory(),
        store.searchTerm()
      ).length;

    const clampPageIndex = (desired: number): number => {
      const size = store.pageSize();
      const totalItems = getFilteredCount();

      if (!totalItems || size <= 0) {
        return 0;
      }

      const totalPages = Math.ceil(totalItems / size);
      const min = 0;
      const max = totalPages - 1;

      return Math.min(Math.max(desired, min), max);
    };

    return {
      loadCatalog(): void {
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
              pageIndex: 0,
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
              pageIndex: 0,
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
          pageIndex: 0,
        });
      },

      setSelectedCategory(category: string | null): void {
        const normalized = category || null;

        if (normalized && !store.categories().includes(normalized)) {
          return;
        }

        patchState(store, {
          selectedCategory: normalized,
          pageIndex: 0,
        });
      },

      goToPage(index: number): void {
        patchState(store, {
          pageIndex: clampPageIndex(index),
        });
      },

      nextPage(): void {
        patchState(store, {
          pageIndex: clampPageIndex(store.pageIndex() + 1),
        });
      },

      prevPage(): void {
        patchState(store, {
          pageIndex: clampPageIndex(store.pageIndex() - 1),
        });
      },
    };
  })
);