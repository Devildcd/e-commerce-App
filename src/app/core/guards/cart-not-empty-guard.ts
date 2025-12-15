import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartStore } from '../state/cart-store';
import { NotificationService } from '../services/notification-service';

export const cartNotEmptyGuard: CanActivateFn = () => {
  const cart = inject(CartStore);
  const router = inject(Router);
  const notifications = inject(NotificationService);

  if (cart.totalItems() > 0) return true;

  notifications.warning('Your cart is empty.');
  return router.createUrlTree(['/']);
};
