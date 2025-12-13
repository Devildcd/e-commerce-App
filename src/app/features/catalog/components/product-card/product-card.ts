import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

  // Datos que vienen del container
  title = input.required<string>();
  description = input<string>('');
  price = input.required<number>();
  image = input<string>('');
  productId = input.required<number>();

  // Estos los puedes mapear desde el modelo si quieres
  rating = input<number | null>(null);
  soldLabel = input<string>('2K+ sold');

  // Eventos hacia el container
  addToCart = output<number>();
  viewDetails = output<number>();

  formattedPrice = computed(() =>
    new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
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
  }
}
