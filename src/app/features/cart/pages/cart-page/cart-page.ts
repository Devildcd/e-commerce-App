import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {

   items = [
    {
      id: 1,
      title: 'Producto en carrito 1',
      price: 49.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80.png?text=P1',
    },
    {
      id: 1,
      title: 'Producto en carrito 1',
      price: 49.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80.png?text=P1',
    },
    {
      id: 1,
      title: 'Producto en carrito 1',
      price: 49.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80.png?text=P1',
    },
    {
      id: 1,
      title: 'Producto en carrito 1',
      price: 49.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80.png?text=P1',
    },
    {
      id: 1,
      title: 'Producto en carrito 1',
      price: 49.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80.png?text=P1',
    },
    {
      id: 1,
      title: 'Producto en carrito 1',
      price: 49.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80.png?text=P1',
    },
    {
      id: 1,
      title: 'Producto en carrito 1',
      price: 49.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80.png?text=P1',
    },
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
