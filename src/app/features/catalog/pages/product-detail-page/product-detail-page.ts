import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductDetailsStore } from '../../../../core/state/product-details.store';
import { CartStore } from '../../../../core/state/cart-store';
import { ShortDescriptionPipe } from '../../../../shared/pipes/short-description-pipe';
import { TrackClick } from '../../../../shared/directives/track-click';
import { CatalogStore } from '../../../../core/state/catalog-store';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe, RouterLink, ShortDescriptionPipe, TrackClick],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.scss',
})
export class ProductDetailPage {

  private readonly route = inject(ActivatedRoute);
  private readonly detailsStore = inject(ProductDetailsStore);
  private readonly cartStore = inject(CartStore);
  private readonly catalogStore = inject(CatalogStore);

  // signal local, OJO => revisar luego para q no rompa patron 
  private readonly _quantity = signal(1);
  private readonly _descriptionExpanded = signal(false);

  // signals que vienen del store
  readonly product = this.detailsStore.product;
  readonly status = this.detailsStore.status;

  readonly quantity = this._quantity.asReadonly();
  readonly isDescriptionExpanded = this._descriptionExpanded.asReadonly();

  readonly rating = computed(() => this.product()?.rating?.rate ?? null);
  readonly ratingCount = computed(
    () => this.product()?.rating?.count ?? null
  );

  readonly hasLongDescription = computed(() => {
    const desc = this.product()?.description ?? '';
    return desc.length > 220;
  });

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const rawId = params.get('id');
        const id = rawId ? Number(rawId) : NaN;

        if (!Number.isFinite(id)) {
          this.detailsStore.clear();
          return;
        }

        // intentar resolver desde el catalog global
        const fromCatalog = this.catalogStore
          .products()
          .find((item) => item.id === id);

        if (fromCatalog) {
          this.detailsStore.setProduct(fromCatalog);
          return;
        }

        // 2) Si no está en catalog, ir a la API
        this.detailsStore.loadById(id);
      });
  }

  // incrementar/decrementar 
  decreaseQuantity(): void {
    const current = this._quantity();
    if (current <= 1) {
      return;
    }
    this._quantity.set(current - 1);
  }

  increaseQuantity(): void {
    const current = this._quantity();
    this._quantity.set(current + 1);
  }

  onQuantityInputChange(rawValue: string): void {
    const parsed = Number(rawValue);

    if (!Number.isFinite(parsed)) {
      return;
    }

    const normalized = Math.max(1, Math.floor(parsed));
    this._quantity.set(normalized);
  }

  // funcionalidades pa agregar al carrito
  addToCart(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    this.cartStore.addProduct(product, this._quantity());
  }

  toggleDescription(): void {
    this._descriptionExpanded.update((v) => !v);
  }
}
