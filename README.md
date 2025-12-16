# E-commerce App

A small e-commerce storefront built with **Angular 20**.  
It consumes the public **Fake Store API** as a demo backend: https://fakestoreapi.com/

## What you can do

- Browse the product **catalog** (paginated — **8 items per page** by default)
- Filter products by **category**
- Search products from the header (**search is available only on the Catalog view**)
- Add products to the cart (even while not logged in)
- Access to **Cart** and **Checkout** is protected by route guards (login happens via a modal)
- Complete a **simulated checkout** (Shipping + Payment forms + processing spinner)

## Tech stack

- Angular 20 (standalone components + modern template syntax)
- NGRX Signal Stores for state management (Catalog, Cart, Auth, UI)
- Tailwind CSS for styling
- Centralized error handling:
  - HTTP error interceptor (normalizes API errors + shows notifications)
  - Global error handler (unexpected errors)

## Demo backend

This project uses the Fake Store API for products and categories. Because it is an external demo service,
data (including images) may load progressively depending on your network and their CDN.

## Routes and navigation

- `/` — Catalog (home)
- `/cart` — Cart (**requires login**)
- `/checkout` — Checkout (**requires login + cart not empty**)
- Login is handled through an in-app modal (no dedicated `/login` route)

### Guards (high level)

- `authGuard` / `authMatchGuard`: blocks protected pages when the user is anonymous and redirects to `/`
- `cartNotEmptyGuard`: blocks checkout when the cart has no items
- `checkoutDeactivateGuard`: prevents losing progress while the checkout is processing or has data entered

## Project structure (overview)

The app is split by **features**, with shared UI and a small **core** layer for cross-cutting concerns.

```txt
src/app
  core/
    errors/          Global error handler
    guards/          Route guards (auth, cart-not-empty, canDeactivate, etc.)
    interceptors/    HTTP interceptors (e.g. httpErrorInterceptor)
    models/          Domain models (Product, CartItem, etc.)
    services/        Infrastructure services (API clients, logging, notifications)
    state/           App-wide stores when needed (UiStore, etc.)
    utils/           Small helpers
  features/
    auth/            Auth feature (modal-based login)
    cart/            Cart feature (pages, components)
    catalog/         Catalog feature (pages, components)
    checkout/        Checkout feature (pages, services)
  layout/
    main-layout/     Layout shell (header, router-outlet, footer)
  shared/
    components/      Reusable components (footer, header pieces, etc.)
    directives/      Shared directives
    interfaces/      Shared contracts/types
    pipes/           Shared pipes
    ui/              UI primitives (spinner, etc.)
```

## Local development

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Testing

Not added yet (will be included later).

## Notes

- Payments are simulated; no real transactions are performed and no sensitive data is stored.
- Images come from the demo API and may load asynchronously depending on network conditions.
