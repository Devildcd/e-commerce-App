import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [ NgOptimizedImage ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

  private readonly router = inject(Router);

  private readonly _imageLoaded = signal(false);
  readonly imageLoaded = this._imageLoaded.asReadonly();
  readonly priority = input(false);

  // datos que vienen del container
  title = input.required<string>();
  description = input<string>('');
  price = input.required<number>();
  image = input<string>('');
  productId = input.required<number>();

  rating = input<number | null>(null);
  soldLabel = input<string>('2K+ sold');

  // eventos q salen para el container
  addToCart = output<number>();
  viewDetails = output<number>();

  formattedPrice = computed(() =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(this.price())
  );

  displayRating = computed(() => {
    const value = this.rating();
    return typeof value === 'number' ? value.toFixed(1) : '–';
  });

  onAddToCart(): void {
    this.addToCart.emit(this.productId());
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.productId());
    this.router.navigate(["/product", this.productId()]);
  }

  onImgLoad(): void {
    this._imageLoaded.set(true);
  }

  onImgError(): void {
    this._imageLoaded.set(true);
  }
}
