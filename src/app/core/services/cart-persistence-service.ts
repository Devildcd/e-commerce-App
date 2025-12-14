import { effect, inject, Injectable, PLATFORM_ID } from '@angular/core';

import { CartItem, CartStore } from '../state/cart-store';
import { LoggingService } from './logging-service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartPersistenceService {
  private readonly storageKey = 'my_ecommerce_cart_demo';

  private readonly cartStore = inject(CartStore);
  private readonly logger = inject(LoggingService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    this.restoreFromStorage();

    effect(() => {
      const items = this.cartStore.items();

      try {
        const serialized = JSON.stringify(items);
        localStorage.setItem(this.storageKey, serialized);
      } catch (error) {
        this.logger.error(
          'Error guardando carrito en localStorage',
          error
        );
      }
    });
  }

  private restoreFromStorage(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw) as CartItem[];
      if (!Array.isArray(parsed)) return;

      this.cartStore.restore(parsed);
    } catch (error) {
      this.logger.error(
        'Error restaurando carrito desde localStorage',
        error
      );
    }
  }
}
