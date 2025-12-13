import { Component, inject, signal } from '@angular/core';

import { ProductCard } from '../../components/product-card/product-card';
import { CategoriesSection } from '../../components/categories-section/categories-section';
import { CatalogStore } from '../../../../core/state/catalog-store';


@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard, CategoriesSection],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
})
export class CatalogPage {

  private readonly catalogStore = inject(CatalogStore);

  readonly products = this.catalogStore.filteredProducts;
  readonly status = this.catalogStore.status;

  ngOnInit(): void {
    if (this.status() === 'idle') {
      this.catalogStore.loadCatalog();
    }
  }

  onRetry(): void {
    this.catalogStore.loadCatalog();
  }
}
