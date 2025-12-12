import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

  @Input() title = 'Producto de ejemplo';
  @Input() price = 99.99;
  @Input() image =
    'https://via.placeholder.com/300x300.png?text=Producto';
  @Input() description =
    'Descripción corta del producto para mostrar en la card.';
  @Input() productId: number | null = null;
}
