import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../interfaces/product';
import { ProductCard } from "../product-card/product-card";
import { CommonModule } from '@angular/common';
import { VideoPreview } from '../video-preview/video-preview';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCard, VideoPreview],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss'
})
export class ProductGrid implements OnInit, AfterViewInit {
  @Input() products: Product[] = [];
  @ViewChildren('productCard', { read: ElementRef }) productCards!: QueryList<ElementRef>;
  
  showVideoModal = false;
  currentVideo = { videoUrl: '', productName: '' };
  animatedCards: Set<number> = new Set();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Inicializar todas las tarjetas como no animadas
    this.products.forEach((_, index) => {
      this.animatedCards.add(index);
    });
  }

  ngAfterViewInit(): void {
    // Solo ejecutar en el navegador, no en SSR
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollAnimation();
    }
  }

  private setupScrollAnimation(): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const cardIndex = parseInt(entry.target.getAttribute('data-index') || '0');
              this.animateCard(cardIndex);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      // Observar cada tarjeta
      this.productCards.forEach((cardRef, index) => {
        if (cardRef.nativeElement) {
          cardRef.nativeElement.setAttribute('data-index', index.toString());
          observer.observe(cardRef.nativeElement);
        }
      });
    }
  }

  private animateCard(index: number): void {
    setTimeout(() => {
      this.animatedCards.delete(index);
    }, 100);
  }

  trackByProduct(index: number, product: Product): number {
    return product.id;
  }

  onOpenVideo(videoData: {videoUrl: string, productName: string}): void {
    this.currentVideo = videoData;
    this.showVideoModal = true;
  }

  onCloseVideoModal(): void {
    this.showVideoModal = false;
    this.currentVideo = { videoUrl: '', productName: '' };
  }
}
