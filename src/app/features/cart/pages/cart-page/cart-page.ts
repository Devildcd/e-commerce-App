import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CartItem, CartStore } from '../../../../core/state/cart-store';
import { AuthStore } from '../../../../core/state/auth-store';
import { AppStore } from '../../../../core/state/app-store';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {

  private readonly cartStore = inject(CartStore);
  private readonly authStore = inject(AuthStore);
  private readonly appStore = inject(AppStore);
  private readonly router = inject(Router);


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

  // comprueba q el user este auth antes de ir a checkout
  onCheckoutClick(): void {
    if (this.totalItems() === 0) {
      return;
    }

    // si no está auth, disparo el modal
    if (!this.authStore.isAuthenticated()) {
      this.appStore.openLoginModal();
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
