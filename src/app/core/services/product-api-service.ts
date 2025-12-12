import { inject, Injectable } from '@angular/core';
import { ApiHttpService } from './api-http-service';
import { Observable } from 'rxjs';

import { ApiProduct, ApiProductCategory } from '../models/api/product-api.model';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private readonly basePath = "/products";

  readonly api = inject(ApiHttpService);

  getAllProducts(): Observable<ApiProduct[]> {
    return this.api.get<ApiProduct[]>(this.basePath);
  }

  getProductsById(id: number): Observable<ApiProduct> {
    return this.api.get<ApiProduct>(`${this.basePath}/${id}`);
  }

  // para categorias
  getAllCategories(): Observable<ApiProductCategory[]> {
    return this.api.get<ApiProductCategory[]>(`${this.basePath}/categories`);
  }

  getProductsByCategory(category: string): Observable<ApiProduct[]> {
    return this.api.get<ApiProduct[]>(`${this.basePath}/category/${category}`);
  }
}
