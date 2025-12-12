import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-detail-page',
  imports: [CommonModule],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.scss',
})
export class ProductDetailPage {

  items = [
    {
      id: 1,
      title: 'Producto en carrito 1',
      price: 49.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80.png?text=P1',
    },
    {
      id: 2,
      title: 'Producto en carrito 2',
      price: 19.99,
      quantity: 1,
      image: 'https://via.placeholder.com/80x80.png?text=P2',
    },
  ];
}
