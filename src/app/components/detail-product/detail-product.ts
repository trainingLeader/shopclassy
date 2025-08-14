import { Component, Input, Output, EventEmitter, OnInit, Inject, PLATFORM_ID, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Product } from '../../interfaces/product';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-product.html',
  styleUrl: './detail-product.scss',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', [
        animate('200ms ease-out')
      ]),
      transition('* => void', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      state('void', style({ transform: 'translateY(-20px) scale(0.98)', opacity: 0 })),
      state('*', style({ transform: 'translateY(0) scale(1)', opacity: 1 })),
      transition('void => *', [
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
      transition('* => void', [
        animate('150ms ease-in', style({ transform: 'translateY(-10px) scale(0.98)', opacity: 0 }))
      ])
    ])
  ]
})
export class DetailProduct implements OnInit, OnChanges {
  @Input() product!: Product;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  
  currentImageIndex: number = 0;
  quantity: number = 1;
  selectedSize: string = '';
  selectedColor: string = '';
  
  productImages: string[] = [];
  
  availableSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  availableColors: string[] = ['Black', 'White', 'Red', 'Blue', 'Green'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.initializeFromProduct();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['product'] && changes['product'].currentValue) ||
        (changes['isOpen'] && changes['isOpen'].currentValue === true)) {
      this.initializeFromProduct();
    }
  }

  private initializeFromProduct(): void {
    if (!this.product) {
      return;
    }

    // Imagenes
    this.productImages = [];
    if (this.product.image) {
      this.productImages.push(this.product.image);
    }
    // Simular imágenes adicionales por categoría
    if (this.product.category?.toLowerCase() === 'makeup') {
      this.productImages.push(
        'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
        'https://images.pexels.com/photos/2533434/pexels-photo-2533434.jpeg'
      );
    } else if (this.product.category?.toLowerCase() === 'skincare') {
      this.productImages.push(
        'https://images.pexels.com/photos/7262775/pexels-photo-7262775.jpeg',
        'https://images.pexels.com/photos/7797428/pexels-photo-7797428.jpeg'
      );
    }
    this.currentImageIndex = 0;

    // Defaults de opciones
    this.quantity = 1;
    this.selectedSize = this.availableSizes[0] ?? '';
    this.selectedColor = this.availableColors[0] ?? '';
  }

  close(): void {
    this.closeModal.emit();
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  nextImage(): void {
    if (this.productImages.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.productImages.length;
    }
  }

  previousImage(): void {
    if (this.productImages.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.productImages.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  addToCart(): void {
    if (this.product?.inStock) {
      console.log('Adding to cart:', {
        product: this.product.name,
        quantity: this.quantity,
        size: this.selectedSize,
        color: this.selectedColor,
        price: this.product.price
      });
      alert(`Added to cart: ${this.product.name} (${this.quantity}x) - $${(this.product.price * this.quantity).toFixed(2)}`);
    }
  }

  getSavingsPercentage(): number {
    if (!this.product?.originalPrice) return 0;
    const savings = this.product.originalPrice - this.product.price;
    return Math.round((savings / this.product.originalPrice) * 100);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
