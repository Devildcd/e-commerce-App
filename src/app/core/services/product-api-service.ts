import { inject, Injectable } from '@angular/core';
import { ApiHttpService } from './api-http-service';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { ApiProduct, ApiProductCategory, ProductsByCategory } from '../models/api/product-api.model';
import { mapApiProductToProduct } from '../utils/product.mapper';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private readonly basePath = "/products";

  readonly api = inject(ApiHttpService);

  getAllProducts() {
    return this.api
      .get<ApiProduct[]>(this.basePath)
      .pipe(map((items) => items.map(mapApiProductToProduct)));
  }

  getProductsById(id: number) {
    return this.api
      .get<ApiProduct>(`${this.basePath}/${id}`)
      .pipe(map(mapApiProductToProduct));
  }

  getAllCategories() {
    return this.api.get<ApiProductCategory[]>(`${this.basePath}/categories`);
  }

  getProductsByCategory(category: string) {
    return this.api
      .get<ApiProduct[]>(`${this.basePath}/category/${category}`)
      .pipe(map((items) => items.map(mapApiProductToProduct)));
  }

  getCatalogGroupedByCategory() {
    return this.getAllCategories().pipe(
      switchMap((categories) => {
        if (!categories?.length) {
          return of<ProductsByCategory[]>([]);
        }

        const requests = categories.map((category) =>
          this.getProductsByCategory(category).pipe(
            map((products) => ({ category, products }))
          )
        );

        return forkJoin(requests);
      })
    );
  }
}
