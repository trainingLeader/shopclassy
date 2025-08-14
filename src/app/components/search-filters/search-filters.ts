import { Component, EventEmitter, Output } from '@angular/core';
import { Category } from '../../interfaces/category';
import { ProductService } from '../../services/product-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './search-filters.html',
  styleUrl: './search-filters.scss'
})
export class SearchFilters {
  @Output() searchChanged = new EventEmitter<string>();
  @Output() categoryChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<string>();

  searchQuery = '';
  selectedCategory = 'all';
  sortBy = 'name';
  categories: Category[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onSearchChange(): void {
    this.searchChanged.emit(this.searchQuery);
  }

  onCategoryChange(): void {
    this.categoryChanged.emit(this.selectedCategory);
  }

  onSortChange(): void {
    this.sortChanged.emit(this.sortBy);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
  }

  clearCategory(): void {
    this.selectedCategory = 'all';
    this.onCategoryChange();
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  }
}
