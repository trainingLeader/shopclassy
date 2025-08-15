import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';
import { CartService } from '../../services/cart-service';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';

interface VideoTip {
  title: string;
  description: string;
}

@Component({
  selector: 'app-video-view',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe],
  templateUrl: './video-view.html',
  styleUrl: './video-view.scss'
})
export class VideoView implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Input() isVisible: boolean = false;
  @Output() closeVideo = new EventEmitter<void>();
  @Output() addToCartEvent = new EventEmitter<Product>();
  @Output() viewProductDetailsEvent = new EventEmitter<Product>();
  
  @ViewChild('mainVideo', { static: false }) mainVideo!: ElementRef<HTMLVideoElement>;
  
  // Propiedades del video
  videoUrl: string = '';
  productName: string = '';
  productDescription: string = '';
  productCategory: string = '';
  productBrand: string = '';
  productImage: string = '';
  
  // Estados del video
  isVideoPlaying: boolean = false;
  isMuted: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  videoProgress: number = 0;
  
  // Tips del video
  videoTips: VideoTip[] = [];
  
  // Timer para actualizar el progreso
  private progressTimer: any;
  
  constructor(private cartService: CartService) {}
  
  ngOnInit(): void {
    if (this.product) {
      this.initializeVideoData();
      this.generateVideoTips();
    }
  }
  
  ngOnDestroy(): void {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }
  }
  
  private initializeVideoData(): void {
    this.videoUrl = this.product.videoUrl || '';
    this.productName = this.product.name;
    this.productDescription = this.product.description;
    this.productCategory = this.product.category;
    this.productBrand = this.product.brand;
    this.productImage = this.product.image;
  }
  
  private generateVideoTips(): void {
    // Generar tips basados en la categoría del producto
    switch (this.product.category.toLowerCase()) {
      case 'skincare':
        this.videoTips = [
          {
            title: 'Aplicación Correcta',
            description: 'Aplica el producto con movimientos circulares suaves para una mejor absorción.'
          },
          {
            title: 'Orden de Aplicación',
            description: 'Usa primero productos con textura más ligera, luego los más espesos.'
          },
          {
            title: 'Frecuencia de Uso',
            description: 'Sigue las instrucciones del producto para obtener mejores resultados.'
          }
        ];
        break;
      case 'makeup':
        this.videoTips = [
          {
            title: 'Preparación de la Piel',
            description: 'Siempre limpia e hidrata tu piel antes de aplicar maquillaje.'
          },
          {
            title: 'Técnica de Aplicación',
            description: 'Usa pinceles limpios y aplica el producto en capas finas.'
          },
          {
            title: 'Fijación del Maquillaje',
            description: 'Usa un fijador para que tu maquillaje dure más tiempo.'
          }
        ];
        break;
      case 'haircare':
        this.videoTips = [
          {
            title: 'Aplicación Uniforme',
            description: 'Distribuye el producto uniformemente desde la raíz hasta las puntas.'
          },
          {
            title: 'Tiempo de Exposición',
            description: 'Respeta el tiempo de exposición recomendado para mejores resultados.'
          },
          {
            title: 'Enjuague Completo',
            description: 'Enjuaga completamente para evitar residuos en el cabello.'
          }
        ];
        break;
      default:
        this.videoTips = [
          {
            title: 'Uso Correcto',
            description: 'Lee siempre las instrucciones antes de usar el producto.'
          },
          {
            title: 'Almacenamiento',
            description: 'Guarda el producto en un lugar fresco y seco.'
          },
          {
            title: 'Seguridad',
            description: 'Mantén el producto fuera del alcance de los niños.'
          }
        ];
    }
  }
  
  // Métodos del modal
  closeModal(): void {
    this.isVisible = false;
    this.closeVideo.emit();
    this.stopVideo();
  }
  
  // Métodos del video
  onVideoLoaded(): void {
    if (this.mainVideo && this.mainVideo.nativeElement) {
      const video = this.mainVideo.nativeElement;
      this.duration = video.duration;
      this.startProgressTimer();
    }
  }
  
  onVideoError(): void {
    console.error('Error loading video:', this.videoUrl);
    // Mostrar mensaje de error o imagen por defecto
  }
  
  playVideo(): void {
    if (this.mainVideo && this.mainVideo.nativeElement) {
      const video = this.mainVideo.nativeElement;
      video.play();
      this.isVideoPlaying = true;
    }
  }
  
  togglePlayPause(): void {
    if (this.mainVideo && this.mainVideo.nativeElement) {
      const video = this.mainVideo.nativeElement;
      if (this.isVideoPlaying) {
        video.pause();
        this.isVideoPlaying = false;
      } else {
        video.play();
        this.isVideoPlaying = true;
      }
    }
  }
  
  restartVideo(): void {
    if (this.mainVideo && this.mainVideo.nativeElement) {
      const video = this.mainVideo.nativeElement;
      video.currentTime = 0;
      video.play();
      this.isVideoPlaying = true;
    }
  }
  
  toggleMute(): void {
    if (this.mainVideo && this.mainVideo.nativeElement) {
      const video = this.mainVideo.nativeElement;
      video.muted = !video.muted;
      this.isMuted = video.muted;
    }
  }
  
  seekVideo(event: MouseEvent): void {
    if (this.mainVideo && this.mainVideo.nativeElement) {
      const video = this.mainVideo.nativeElement;
      const progressBar = event.currentTarget as HTMLElement;
      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const progressWidth = rect.width;
      const seekTime = (clickX / progressWidth) * this.duration;
      video.currentTime = seekTime;
    }
  }
  
  private startProgressTimer(): void {
    this.progressTimer = setInterval(() => {
      if (this.mainVideo && this.mainVideo.nativeElement) {
        const video = this.mainVideo.nativeElement;
        this.currentTime = video.currentTime;
        this.videoProgress = (this.currentTime / this.duration) * 100;
        
        // Detener el timer si el video ha terminado
        if (video.ended) {
          this.isVideoPlaying = false;
          clearInterval(this.progressTimer);
        }
      }
    }, 100);
  }
  
  private stopVideo(): void {
    if (this.mainVideo && this.mainVideo.nativeElement) {
      const video = this.mainVideo.nativeElement;
      video.pause();
      video.currentTime = 0;
      this.isVideoPlaying = false;
      this.currentTime = 0;
      this.videoProgress = 0;
    }
    
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }
  }
  
  // Métodos de acciones del producto
  addToCart(): void {
    this.addToCartEvent.emit(this.product);
  }
  
  viewProductDetails(): void {
    this.viewProductDetailsEvent.emit(this.product);
  }
  
  // Métodos del footer
  downloadVideo(): void {
    if (this.videoUrl) {
      const link = document.createElement('a');
      link.href = this.videoUrl;
      link.download = `${this.productName}_video.mp4`;
      link.click();
    }
  }
  
  saveToFavorites(): void {
    // Implementar lógica para guardar en favoritos
    console.log('Video guardado en favoritos:', this.productName);
  }
  
  // Métodos de redes sociales (placeholder)
  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Mira este video de ${this.productName}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  }
  
  shareOnTwitter(): void {
    const text = encodeURIComponent(`Mira este video de ${this.productName}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }
  
  shareOnInstagram(): void {
    // Instagram no permite compartir URLs directamente
    console.log('Compartir en Instagram:', this.productName);
  }
}
