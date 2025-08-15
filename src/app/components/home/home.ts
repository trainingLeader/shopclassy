import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { ProductCard } from '../product-card/product-card';
import { Footer } from '../footer/footer';
import { SearchFilters } from '../search-filters/search-filters';
import { Hero } from '../hero/hero';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Header, ProductCard, Footer, SearchFilters, Hero],
  template: `
    <app-header></app-header>
    
    <div class="home-container">
      <!-- Hero Section - Using original Hero component -->
      <app-hero></app-hero>

      <!-- Search and Filters Section -->
      <section class="filters-section">
        <div class="container">
          <app-search-filters
            (searchChanged)="onSearchChanged($event)"
            (categoryChanged)="onCategoryChanged($event)"
            (sortChanged)="onSortChanged($event)">
          </app-search-filters>
        </div>
      </section>

      <!-- Products Section -->
      <section class="products-section">
        <div class="container">
          <h2>Featured Products</h2>
          <p>Add products to your cart and experience our shopping cart functionality!</p>
          
          <div class="products-grid">
            <app-product-card 
              *ngFor="let product of filteredProducts; let i = index" 
              [product]="product"
              [animationDelay]="i * 100">
            </app-product-card>
          </div>

          <!-- No products message -->
          <div *ngIf="filteredProducts.length === 0" class="no-products">
            <p>No products found matching your criteria.</p>
            <button class="btn btn-primary" (click)="clearFilters()">Clear Filters</button>
          </div>
        </div>
      </section>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .home-container {
      min-height: calc(100vh - 200px); /* Account for header and footer */
    }

    .filters-section {
      padding: 40px 20px;
      background: white;
      border-bottom: 1px solid #e9ecef;
    }

    .products-section {
      padding: 80px 20px;
      background: #f8f9fa;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .products-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 1rem;
    }

    .products-section p {
      text-align: center;
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 3rem;
      line-height: 1.6;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }

    .no-products {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-products p {
      font-size: 1.2rem;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .products-section h2 {
        font-size: 2rem;
      }
      
      .products-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  `]
})
export class Home implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentSearchQuery = '';
  currentCategory = 'all';
  currentSort = 'name';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
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

  clearFilters(): void {
    this.currentSearchQuery = '';
    this.currentCategory = 'all';
    this.currentSort = 'name';
    this.applyFilters();
  }

  private applyFilters(): void {
    let products = [...this.products];

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
