import { Component, Input, Output, EventEmitter, OnInit, HostBinding, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { VideoPreview } from '../video-preview/video-preview';
import { CartService } from '../../services/cart-service';
import { VideoView } from '../video-view/video-view';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, VideoView],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard implements OnInit, AfterViewInit {
  @Input() product!: Product;
  @Input() animationDelay: number = 0;
  @Output() openVideo = new EventEmitter<{videoUrl: string, productName: string}>();
  @Output() openDetail = new EventEmitter<Product>();
  
  @ViewChild('productImage', { static: false }) productImage!: ElementRef<HTMLImageElement>;
  
  isHovered = false;
  showVideoModal = false;
  isVisible = false;
  imageLoaded = false;
  imageError = false;
  showSkeleton = true;
  isAddingToCart = false;
  showVideoTips = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  @HostBinding('class.card-animated') get cardAnimated() {
    return this.isVisible;
  }

  @HostBinding('style.animation-delay') get animationDelayStyle() {
    return `${this.animationDelay}ms`;
  }

  ngOnInit(): void {
    // Simular delay de animación escalonada
    setTimeout(() => {
      this.isVisible = true;
      this.cdr.detectChanges();
    }, this.animationDelay);
    
    // Solo cargar imagen en el navegador
    if (isPlatformBrowser(this.platformId)) {
      if (this.product && this.product.image) {
        // Usar setTimeout para evitar el error de detección de cambios
        setTimeout(() => {
          this.loadImageDirectly();
        }, 0);
      }
    }
  }

  ngAfterViewInit(): void {
    // Solo en el navegador
    if (isPlatformBrowser(this.platformId)) {
      // Si la imagen no se cargó en ngOnInit, intentar cargarla aquí
      if (!this.imageLoaded && !this.imageError && this.product && this.product.image) {
        setTimeout(() => {
          this.loadImageDirectly();
        }, 100);
      }
      
      // Fallback de seguridad: ocultar skeleton después de 3 segundos
      setTimeout(() => {
        if (this.showSkeleton) {
          console.warn('Safety fallback: hiding skeleton after 3 seconds');
          this.showSkeleton = false;
          this.imageError = true;
          this.cdr.detectChanges();
        }
      }, 3000);
    } else {
      // En SSR, ocultar skeleton inmediatamente
      this.showSkeleton = false;
      this.cdr.detectChanges();
    }
  }

  private loadImageDirectly(): void {
    if (!this.product || !this.product.image || !isPlatformBrowser(this.platformId)) {
      this.showSkeleton = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      // Crear una nueva imagen para precargar
      const img = new Image();
      
      img.onload = () => {
        console.log('Image loaded successfully:', this.product.image);
        this.imageLoaded = true;
        this.showSkeleton = false;
        this.cdr.detectChanges();
        
        // Si tenemos el elemento DOM, establecer la imagen
        if (this.productImage && this.productImage.nativeElement) {
          this.productImage.nativeElement.src = this.product.image;
        }
      };

      img.onerror = () => {
        console.error('Image failed to load:', this.product.image);
        this.imageError = true;
        this.showSkeleton = false;
        this.cdr.detectChanges();
        
        // Si tenemos el elemento DOM, establecer imagen por defecto
        if (this.productImage && this.productImage.nativeElement) {
          this.productImage.nativeElement.src = 'https://via.placeholder.com/300x250/f8f9fa/6c757d?text=Image+Not+Found';
        }
      };

      // Intentar cargar la imagen
      console.log('Loading image directly:', this.product.image);
      img.src = this.product.image;
      
      // Timeout adicional de seguridad
      setTimeout(() => {
        if (this.showSkeleton) {
          console.warn('Image loading timeout, hiding skeleton');
          this.showSkeleton = false;
          this.imageError = true;
          this.cdr.detectChanges();
        }
      }, 2000);
    } catch (error) {
      console.error('Error loading image:', error);
      this.showSkeleton = false;
      this.imageError = true;
      this.cdr.detectChanges();
    }
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  openVideoModal(): void {
    if (this.product.videoUrl) {
      this.showVideoTips = true;
      this.cdr.detectChanges();
    }
  }

  openDetailModal(): void {
    this.openDetail.emit(this.product);
  }

  closeVideoTips(): void {
    this.showVideoTips = false;
    this.cdr.detectChanges();
  }

  onAddToCartFromVideo(): void {
    this.addToCart();
  }

  onViewProductDetailsFromVideo(): void {
    this.openDetailModal();
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  getSavingsPercentage(): number {
    if (!this.product.originalPrice) return 0;
    const savings = this.product.originalPrice - this.product.price;
    return Math.round((savings / this.product.originalPrice) * 100);
  }

  addToCart(): void {
    if (!this.product.inStock) return;
    
    this.isAddingToCart = true;
    
    // Simulate a brief loading state
    setTimeout(() => {
      this.cartService.addToCart(this.product, 1);
      this.isAddingToCart = false;
      this.cdr.detectChanges();
      
      // Show success feedback
      this.showAddToCartSuccess();
    }, 500);
  }

  private showAddToCartSuccess(): void {
    // You can implement a toast notification here
    console.log(`${this.product.name} added to cart!`);
  }
}