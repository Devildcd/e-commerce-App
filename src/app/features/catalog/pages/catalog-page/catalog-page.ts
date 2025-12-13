import { Component, signal } from '@angular/core';

import { ProductCard } from '../../components/product-card/product-card';
import { CategoriesSection } from '../../components/categories-section/categories-section';


@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard, CategoriesSection],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
})
export class CatalogPage {

  products = Array.from({ length: 8 }).map((_, index) => ({
    id: index + 1,
    title: `Producto ${index + 1}`,
    description: 'Descripción de ejemplo del producto.',
    price: 49.99 + index,
    image: `https://placehold.co/300x300.png?text=Producto+${index + 1}`,
  }));
}
