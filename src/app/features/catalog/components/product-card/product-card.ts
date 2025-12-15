import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

  private readonly router = inject(Router);

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
}
