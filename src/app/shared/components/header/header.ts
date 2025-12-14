import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { CatalogStore } from '../../../core/state/catalog-store';
import { CartStore } from '../../../core/state/cart-store';
import { AppStore } from '../../../core/state/app-store';
import { MiniCartDropdown } from '../mini-cart-dropdown/mini-cart-dropdown';

@Component({
  selector: 'app-header',
  imports: [ReactiveFormsModule, MiniCartDropdown],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private readonly catalogStore = inject(CatalogStore);
  private readonly cartStore = inject(CartStore);
  private readonly appStore = inject(AppStore);

  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly totalCartItems = this.cartStore.totalItems;
  readonly isMiniCartOpen = this.appStore.miniCartOpen;

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
}

