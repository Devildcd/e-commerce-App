import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { CartItem, CartStore } from '../../../../core/state/cart-store';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {

  private readonly cartStore = inject(CartStore);

  readonly items = this.cartStore.items;
  readonly totalItems = this.cartStore.totalItems;
  readonly totalAmount = this.cartStore.totalAmount;
  readonly isEmpty = this.cartStore.isEmpty;


  onRemoveItem(productId: number): void {
    this.cartStore.removeItem(productId);
  }

  onDecreaseQuantity(item: CartItem): void {
    const next = item.quantity - 1;
    this.cartStore.updateQuantity(item.productId, next);
  }

  onIncreaseQuantity(item: CartItem): void {
    const next = item.quantity + 1;
    this.cartStore.updateQuantity(item.productId, next);
  }

  onQuantityInputChange(item: CartItem, rawValue: string): void {
    const parsed = Number(rawValue);

    if (!Number.isFinite(parsed)) {
      return;
    }

    this.cartStore.updateQuantity(item.productId, parsed);
  }

  trackByProductId(_index: number, item: CartItem): number {
    return item.productId;
  }
}
