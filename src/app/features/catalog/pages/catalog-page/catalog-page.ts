import { Component } from '@angular/core';
import { ProductCard } from "../../../../shared/components/product-card/product-card";

@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
})
export class CatalogPage {

  products = Array.from({ length: 8 }).map((_, index) => ({
    id: index + 1,
    title: `Producto ${index + 1}`,
    description: 'Descripción de ejemplo del producto.',
    price: 49.99 + index,
    image: 'https://via.placeholder.com/300x300.png?text=Producto',
  }));
}
