import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-shop-car-demo',
  standalone: true,
  imports: [CommonModule, ProductCard],
  template: `
    <div class="demo-container">
      <h2>Shopping Cart Demo</h2>
      <p>Add products to your cart and see the shopping cart in action! Use the cart icon in the header to open your shopping cart.</p>
      
      <div class="products-section">
        <h3>Sample Products</h3>
        <p>Click "Add to Cart" on any product below to add it to your shopping cart.</p>
        <div class="products-grid">
          <app-product-card 
            *ngFor="let product of products" 
            [product]="product"
            [animationDelay]="0">
          </app-product-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      margin-top: 80px; /* Account for fixed header */
    }
    
    .products-section {
      margin-bottom: 40px;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    h2, h3 {
      color: #333;
      margin-bottom: 15px;
    }
    
    p {
      color: #666;
      margin-bottom: 20px;
      line-height: 1.6;
    }
  `]
})
export class ShopCarDemo implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products.slice(0, 6); // Show first 6 products for demo
    });
  }
}
