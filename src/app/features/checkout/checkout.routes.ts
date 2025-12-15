import { Routes } from '@angular/router';
import { checkoutDeactivateGuard } from '../../core/guards/checkout-deactivate-guard';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/checkout-page/checkout-page').then(
        (m) => m.CheckoutPage
      ),
    canDeactivate: [checkoutDeactivateGuard],
  },
];
