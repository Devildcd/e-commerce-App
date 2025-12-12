import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        // catálogo principal (home)
        loadChildren: () =>
          import('./features/catalog/catalog.routes').then(
            (m) => m.CATALOG_ROUTES
          ),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./features/cart/cart.routes').then(
            (m) => m.CART_ROUTES
          ),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./features/checkout/checkout.routes').then(
            (m) => m.CHECKOUT_ROUTES
          ),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(
        (m) => m.AUTH_ROUTES
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
