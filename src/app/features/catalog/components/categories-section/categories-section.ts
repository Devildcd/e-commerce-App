import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

type CategoryItem = {
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

   readonly categories: CategoryItem[] = [
    { id: 'tshirt', label: 'All', icon: 'accessibility' },
    { id: 'jacket', label: 'Electronics', icon: 'headphones' },
    { id: 'shirt', label: 'Man Clothing', icon: 'man' },
    { id: 'jeans', label: 'Jewelery', icon: 'diamond' },
    { id: 'bag', label: 'Woman clothing', icon: 'woman' },
  ];

  readonly activeId = signal('all');

}
