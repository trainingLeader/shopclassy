import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private cartTotal = new BehaviorSubject<number>(0);
  private cartItemCount = new BehaviorSubject<number>(0);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadCartFromStorage();
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCartTotal(): Observable<number> {
    return this.cartTotal.asObservable();
  }

  getCartItemCount(): Observable<number> {
    return this.cartItemCount.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      currentItems.push({ product, quantity });
    }

    this.updateCart(currentItems);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.updateCart(updatedItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);
    
    if (itemIndex >= 0) {
      currentItems[itemIndex].quantity = quantity;
      this.updateCart(currentItems);
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItems.next(items);
    this.calculateTotals(items);
    if (this.isBrowser) {
      this.saveCartToStorage(items);
    }
  }

  private calculateTotals(items: CartItem[]): void {
    const total = items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    this.cartTotal.next(total);
    this.cartItemCount.next(itemCount);
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem('shopclassy_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  private loadCartFromStorage(): void {
    if (!this.isBrowser) return;
    
    try {
      const storedCart = localStorage.getItem('shopclassy_cart');
      if (storedCart) {
        const items = JSON.parse(storedCart);
        this.updateCart(items);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }
}
