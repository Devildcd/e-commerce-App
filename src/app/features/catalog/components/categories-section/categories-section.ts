import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { CatalogStore } from '../../../../core/state/catalog-store';

type UiCategory = {
  id: string;
  label: string;
  icon: string; // Material Symbols name
};

@Component({
  selector: 'app-categories-section',
  imports: [CommonModule],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.scss',
})
export class CategoriesSection {

    private readonly catalogStore = inject(CatalogStore);

  // All estatico
  readonly categories = computed<UiCategory[]>(() => {
    const apiCategories = this.catalogStore.categories();
    const items: UiCategory[] = [
      {
        id: 'all',
        label: 'All',
        icon: 'accessibility',
      },
    ];

    for (const category of apiCategories) {
      items.push({
        id: category,
        label: this.toLabel(category),
        icon: this.iconFor(category),
      });
    }

    return items;
  });

  // para el boton, cambio viene del store
  readonly activeId = computed(() => {
    const current = this.catalogStore.selectedCategory();
    return current ?? 'all';
  });

  onCategoryClick(id: string): void {
    if (id === 'all') {
      this.catalogStore.setSelectedCategory(null);
      return;
    }

    this.catalogStore.setSelectedCategory(id);
  }

  // helpers
  private toLabel(raw: string): string {
    switch (raw) {
      case "men's clothing":
        return 'Man Clothing';
      case "women's clothing":
        return 'Woman clothing';
      case 'jewelery':
        return 'Jewelery';
      default:
        // primera letra en mayúscula por si acaso
        return raw.charAt(0).toUpperCase() + raw.slice(1);
    }
  }

  private iconFor(category: string): string {
    switch (category) {
      case 'electronics':
        return 'headphones';
      case "men's clothing":
        return 'man';
      case "women's clothing":
        return 'woman';
      case 'jewelery':
        return 'diamond';
      default:
        return 'category';
    }
  }
}
