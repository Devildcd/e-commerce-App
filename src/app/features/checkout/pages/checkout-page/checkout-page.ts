import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout-page',
  imports: [CommonModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
})
export class CheckoutPage {

  items = [
    { id: 1, title: 'Producto 1', price: 49.99, quantity: 2 },
    { id: 2, title: 'Producto 2', price: 19.99, quantity: 1 },
  ];
}
