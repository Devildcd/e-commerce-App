import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { CatalogStore } from '../../../core/state/catalog-store';
import { CartStore } from '../../../core/state/cart-store';
import { AppStore } from '../../../core/state/app-store';
import { MiniCartDropdown } from '../mini-cart-dropdown/mini-cart-dropdown';

import { AuthStore } from '../../../core/state/auth-store';

@Component({
  selector: 'app-header',
  imports: [ReactiveFormsModule, MiniCartDropdown, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private readonly catalogStore = inject(CatalogStore);
  private readonly cartStore = inject(CartStore);
  private readonly appStore = inject(AppStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router)

  // search y mini-cart
  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly totalCartItems = this.cartStore.totalItems;
  readonly isMiniCartOpen = this.appStore.miniCartOpen;

  // login
  readonly isLoggedIn = this.authStore.isAuthenticated;
  readonly userInitials = this.authStore.initials;
  readonly displayName = this.authStore.displayName;

  readonly showSearch = signal(false);

  //controla la barra de búsqueda en móvil
  private readonly _mobileSearchOpen = signal(false);
  readonly isMobileSearchOpen = this._mobileSearchOpen.asReadonly();


  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((term: string) => {
        this.catalogStore.setSearchTerm(term ?? '');
      });

    this.updateShowSearch(this.router.url);

    // aqui escucho el cambio en la ruta
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        const url = event.urlAfterRedirects || event.url;
        this.updateShowSearch(url);
      });
  }

  get hasSearchTerm(): boolean {
    const value = this.searchControl.value;
    return !!value && value.trim().length > 0;
  }

  onSearchButtonClick(): void {
    if (this.hasSearchTerm) {
      this.searchControl.setValue('');
    }
  }

  onCartClick(): void {
    this.appStore.toggleMiniCart();
  }

  onLoginClick(): void {
    this.appStore.openLoginModal();
  }

  onMobileSearchToggle(): void {
    if (!this.showSearch()) {
      return;
    }
    this._mobileSearchOpen.update((open) => !open);
  }

  //me controla si el buscador está activo según la ruta
  private updateShowSearch(url: string): void {
    const enabled = url === '/';

    this.showSearch.set(enabled);

    // si salgo de '/', cierra y limpia
    if (!enabled) {
      this._mobileSearchOpen.set(false);
      if (this.hasSearchTerm) {
        this.searchControl.setValue('');
      }
    }
  }
}

