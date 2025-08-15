import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart-service';
import { Product } from '../../interfaces/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop-car',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-car.html',
  styleUrl: './shop-car.scss'
})
export class ShopCar implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  cartItemCount: number = 0;
  isCartOpen: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.getCartItems().subscribe(items => {
        this.cartItems = items;
      }),
      this.cartService.getCartTotal().subscribe(total => {
        this.cartTotal = total;
      }),
      this.cartService.getCartItemCount().subscribe(count => {
        this.cartItemCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  updateQuantity(productId: number, newQuantity: number): void {
    this.cartService.updateQuantity(productId, newQuantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getFormattedPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  getTotalSavings(): number {
    return this.cartItems.reduce((total, item) => {
      if (item.product.originalPrice) {
        return total + ((item.product.originalPrice - item.product.price) * item.quantity);
      }
      return total;
    }, 0);
  }

  checkout(): void {
    // Implement checkout logic here
    console.log('Proceeding to checkout...');
    alert('Checkout functionality will be implemented here!');
  }
}