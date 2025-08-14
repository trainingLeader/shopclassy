import { Component, Input, Output, EventEmitter, OnInit, HostBinding, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { VideoPreview } from '../video-preview/video-preview';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
    }, this.animationDelay);
  }

  ngAfterViewInit(): void {
    // Cargar imagen inmediatamente después de la inicialización
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.setupImageLazyLoading();
      } else {
        // En SSR, cargar la imagen directamente
        this.loadImage();
      }
    }, 100);
  }

  private setupImageLazyLoading(): void {
    if (this.productImage && this.product.image) {
      // Si tenemos la imagen y el elemento, cargar directamente
      this.loadImage();
      
      // Opcional: También configurar Intersection Observer para futuras optimizaciones
      if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !this.imageLoaded && !this.imageError) {
                // Solo recargar si no se ha cargado aún
                this.loadImage();
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: '50px'
          }
        );

        imageObserver.observe(this.productImage.nativeElement);
      }
    } else {
      console.warn('Product image or image element not found:', this.product?.image);
      this.showSkeleton = false;
    }
  }

  private loadImage(): void {
    if (this.productImage && this.product.image) {
      const img = this.productImage.nativeElement;
      
      // Configurar event handlers antes de establecer src
      img.onload = () => {
        console.log('Image loaded successfully:', this.product.image);
        this.imageLoaded = true;
        this.showSkeleton = false;
      };

      img.onerror = () => {
        console.error('Image failed to load:', this.product.image);
        this.imageError = true;
        this.showSkeleton = false;
        // Cargar imagen por defecto en caso de error
        img.src = 'https://via.placeholder.com/300x250/f8f9fa/6c757d?text=Image+Not+Found';
      };

      // Establecer src después de configurar los handlers
      console.log('Loading image:', this.product.image);
      img.src = this.product.image;
    } else {
      console.warn('Cannot load image: missing productImage or product.image');
      this.showSkeleton = false;
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
      this.openVideo.emit({
        videoUrl: this.product.videoUrl,
        productName: this.product.name
      });
    }
  }

  openDetailModal(): void {
    this.openDetail.emit(this.product);
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
}
