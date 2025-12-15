import { Component, computed, inject } from '@angular/core';

import { ProductCard } from '../../components/product-card/product-card';
import { CategoriesSection } from '../../components/categories-section/categories-section';
import { CatalogStore } from '../../../../core/state/catalog-store';
import { CartStore } from '../../../../core/state/cart-store';
import { Product } from '../../../../core/models/domain/product.model';
import { UiSpinner } from '../../../../shared/ui/ui-spinner/ui-spinner';


@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard, CategoriesSection, UiSpinner],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
})
export class CatalogPage {

  private readonly catalogStore = inject(CatalogStore);
  private readonly cartStore = inject(CartStore);

  readonly products = this.catalogStore.currentPageProducts;
  readonly status = this.catalogStore.status;
  readonly errorMessage = this.catalogStore.errorMessage;

  readonly hasPrevPage = this.catalogStore.hasPrevPage;
  readonly hasNextPage = this.catalogStore.hasNextPage;

  // spiner
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isError = computed(() => this.status() === 'error');
  readonly isSuccess = computed(() => this.status() === 'success');

  ngOnInit(): void {
    if (this.status() === 'idle') {
      this.catalogStore.loadCatalog();
    }
  }

  onRetry(): void {
    this.catalogStore.loadCatalog();
  }

  onAddToCart(product: Product): void {
    this.cartStore.addProduct(product, 1);
  }

  onViewDetails(productId: number): void {
  }

   onPrevPage(): void {
    this.catalogStore.prevPage();
  }

  onNextPage(): void {
    this.catalogStore.nextPage();
  }
}
