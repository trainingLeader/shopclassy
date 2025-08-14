import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Hero } from "./components/hero/hero";
import { SearchFilters } from "./components/search-filters/search-filters";
import { ProductGrid } from "./components/product-grid/product-grid";
import { Footer } from "./components/footer/footer";
import { Product } from './interfaces/product';
import { ProductService } from './services/product-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Hero, SearchFilters, ProductGrid, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('shopclassy');
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  currentSearchQuery = '';
  currentCategory = 'all';
  currentSort = 'name';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      this.applyFilters();
    });
  }

  onSearchChanged(query: string): void {
    this.currentSearchQuery = query;
    this.applyFilters();
  }

  onCategoryChanged(category: string): void {
    this.currentCategory = category;
    this.applyFilters();
  }

  onSortChanged(sort: string): void {
    this.currentSort = sort;
    this.applyFilters();
  }

  private applyFilters(): void {
    let products = [...this.allProducts];

    // Apply search filter
    if (this.currentSearchQuery) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(this.currentSearchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.currentSearchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(this.currentSearchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (this.currentCategory !== 'all') {
      products = products.filter(product =>
        product.category.toLowerCase() === this.currentCategory.toLowerCase()
      );
    }

    // Apply sorting
    switch (this.currentSort) {
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        products.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    this.filteredProducts = products;
  }
}
