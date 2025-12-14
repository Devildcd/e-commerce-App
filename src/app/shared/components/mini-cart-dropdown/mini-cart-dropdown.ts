import { Component, HostListener, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { CartStore } from '../../../core/state/cart-store';
import { AppStore } from '../../../core/state/app-store';

import { Router } from '@angular/router';

@Component({
  selector: 'app-mini-cart-dropdown',
  imports: [CurrencyPipe],
  templateUrl: './mini-cart-dropdown.html',
  styleUrl: './mini-cart-dropdown.scss',
})
export class MiniCartDropdown {

  private readonly cartStore = inject(CartStore);
  private readonly appStore = inject(AppStore);
  private readonly router = inject(Router);

  // signals de los stores
  readonly items = this.cartStore.items;
  readonly totalItems = this.cartStore.totalItems;
  readonly subtotal = this.cartStore.totalAmount;
  readonly isOpen = this.appStore.miniCartOpen;

  close(): void {
    this.appStore.closeMiniCart();
  }

  goToCart(): void {
    this.router.navigate(["/cart"]);
  }

  removeItem(productId: number): void {
    this.cartStore.removeItem(productId);
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}
