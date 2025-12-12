import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

   title = input.required<string>();
  description = input<string>('');
  price = input.required<number>();
  image = input<string>();
  productId = input.required<number | string>();

  // estático por ahora (maquetación)
  rating = input<number>(4.9);
  soldLabel = input<string>('2K+ Sold');

  formattedPrice = computed(() =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(this.price())
  );
}
