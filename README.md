# E-commerce App (Angular 20)

Small e-commerce frontend built with Angular 20 using a feature-based architecture, standalone components, and Signal Stores. The backend is simulated using Fake Store API.

**Fake API:** <https://fakestoreapi.com/>

> **Note:** Auth is simulated and handled via a modal (there is no /login route). Protected routes redirect back to `/` and can optionally preserve a `returnUrl` query param.

---

## 🚀 Features

### Catalog with

* products fetch from Fake Store API
* category filtering
* search term filtering
* pagination (client-side)
* Product detail route (lazy-loaded)

### Cart

* add/remove items
* update quantities
* totals (items + amount)
* cart dropdown (scrollable list + sticky subtotal/actions)

### Checkout

* shipping + payment forms (simulated payment)
* processing spinner during payment simulation
* optional “pending changes” protection via `canDeactivate`

### Global UX

* sticky header
* notifications/toasts (auto-dismiss)
* logging service (dev-friendly)

---

## 🛠️ Tech Stack

* Angular 20 (standalone + modern template control flow `@if`, `@for`)
* `@ngrx/signals` (Signal Store pattern for state)
* TailwindCSS + a bit of SCSS where needed
* HTTP interceptors (global error normalization + notifications)
* Guards: `canActivate`, `canMatch`, `canDeactivate`

---

## 📂 Project Structure

The app is split by features, with shared UI and a small core layer for cross-cutting concerns.

src/app ├── core/ │ ├── errors/ # Global error handler, error mapping utilities │ ├── guards/ # Route guards (auth, cart-not-empty, canDeactivate, etc.) │ ├── interceptors/ # HTTP interceptors (e.g. httpErrorInterceptor) │ ├── models/ # Domain models (Product, CartItem, etc.) │ ├── services/ # Infrastructure services (API clients, logging, notifications) │ ├── state/ # App-wide stores when needed (UiStore, etc.) │ └── utils/ # Helpers ├── features/ │ ├── auth/ # Auth feature (modal-based login, AuthStore) │ ├── cart/ # Cart feature (CartStore, pages, components) │ ├── catalog/ # Catalog feature (CatalogStore, pages, components) │ └── checkout/ # Checkout feature (CheckoutStore, pages, guards) ├── layout/ │ └── main-layout/ # Main layout shell (header, router outlet, footer) └── shared/ ├── components/ # Reusable components (footer, header pieces, etc.) ├── directives/ # Reusable directives ├── interfaces/ # Shared types/contracts ├── pipes/ # Pipes (e.g. shortDescription) └── ui/ # UI primitives (spinner, etc.)

---

## 🧩 Architecture Notes

* **Flow:** `UI components/pages` → `Stores` → `Services/API`
* Pages/components do not call `HttpClient` directly.
* Services deal with HTTP, mapping, and infrastructure concerns.
* This keeps the UI clean and avoids “smart templates”.

---

## 🧭 Routing

* Routes are lazy-loaded per feature. Sensitive routes are protected:
  * `/cart` → requires auth
  * `/checkout` → requires auth + cart not empty
* Checkout uses `canDeactivate` to prevent leaving during processing / pending progress.
* Because login is modal-based, guards redirect to `/` and can push a notification like “Please login to continue”.

---

## 🏃 Running Locally

1. `npm install`
2. `ng serve`

Then open <http://localhost:4200>.

---

## ⚙️ Environment / Assets

* Static assets are served from `public/` (Angular modern approach).
* Components use modern Angular metadata (`styleUrl`).

---

## 📌 What’s Next (Planned)

* Unit tests / component tests (not added yet)
