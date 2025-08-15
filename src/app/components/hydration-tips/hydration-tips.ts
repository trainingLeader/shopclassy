import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../interfaces/product';
import { HydrationService, HydrationTip, HydrationRoutine } from '../../services/hydration-service';
import { CartService } from '../../services/cart-service';
import { HydrationRoutineComponent } from '../hydration-routine/hydration-routine';

@Component({
  selector: 'app-hydration-tips',
  standalone: true,
  imports: [CommonModule, FormsModule, HydrationRoutineComponent],
  templateUrl: './hydration-tips.html',
  styleUrl: './hydration-tips.scss'
})
export class HydrationTips implements OnInit, OnDestroy {
  @Input() isVisible: boolean = false;
  @Output() closeTipsEvent = new EventEmitter<void>();
  @Output() addToCartEvent = new EventEmitter<Product>();
  @Output() viewProductEvent = new EventEmitter<Product>();
  
  // Filtros
  selectedCategory: string = 'all';
  selectedSkinType: string = 'all';
  
  // Datos
  allTips: HydrationTip[] = [];
  filteredTips: HydrationTip[] = [];
  hydrationRoutines: HydrationRoutine[] = [];
  recommendedProducts: Product[] = [];
  
  // Estado del modal de rutinas
  showRoutineModal = false;
  selectedRoutine: HydrationRoutine | null = null;
  
  // Estadísticas
  stats = {
    totalTips: 0,
    totalRoutines: 0,
    categories: [] as string[]
  };
  
  // Estado
  isLoading = false;
  savedTips: HydrationTip[] = [];
  
  constructor(
    private hydrationService: HydrationService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  ngOnInit(): void {
    this.loadHydrationData();
    if (isPlatformBrowser(this.platformId)) {
      this.loadSavedTips();
    }
  }
  
  ngOnDestroy(): void {
    // Cleanup si es necesario
  }
  
  private loadHydrationData(): void {
    this.isLoading = true;
    
    // Cargar tips
    this.hydrationService.getHydrationTips().subscribe(tips => {
      this.allTips = tips;
      this.filteredTips = [...tips];
      this.stats.totalTips = tips.length;
    });
    
    // Cargar rutinas
    this.hydrationService.getHydrationRoutines().subscribe(routines => {
      this.hydrationRoutines = routines;
      this.stats.totalRoutines = routines.length;
    });
    
    // Cargar estadísticas
    this.hydrationService.getHydrationStats().subscribe(stats => {
      this.stats = { ...this.stats, ...stats };
    });
    
    // Cargar productos recomendados
    this.loadRecommendedProducts();
    
    this.isLoading = false;
  }
  
  private loadRecommendedProducts(): void {
    // Obtener productos del servicio de productos
    this.hydrationService.getRecommendedHydrationProducts([]).subscribe(products => {
      this.recommendedProducts = products;
    });
  }
  
  private loadSavedTips(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const saved = localStorage.getItem('savedHydrationTips');
    if (saved) {
      try {
        this.savedTips = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved tips:', e);
        this.savedTips = [];
      }
    }
  }
  
  // Filtros
  filterTips(): void {
    let filtered = [...this.allTips];
    
    // Filtrar por categoría
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(tip => tip.category === this.selectedCategory);
    }
    
    // Filtrar por tipo de piel
    if (this.selectedSkinType !== 'all') {
      filtered = filtered.filter(tip => 
        tip.skinType.includes('all') || tip.skinType.includes(this.selectedSkinType)
      );
    }
    
    this.filteredTips = filtered;
  }
  
  // Métodos de utilidad
  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'morning': 'Matutina',
      'evening': 'Nocturna',
      'general': 'General'
    };
    return labels[category] || category;
  }
  
  getSkinTypeLabel(skinType: string): string {
    const labels: { [key: string]: string } = {
      'all': 'Todos',
      'dry': 'Seca',
      'normal': 'Normal',
      'combination': 'Mixta',
      'oily': 'Grasa'
    };
    return labels[skinType] || skinType;
  }
  
  getDifficultyLabel(difficulty: string): string {
    const labels: { [key: string]: string } = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Advanced'
    };
    return labels[difficulty] || difficulty;
  }
  
  // Acciones de tips
  saveTip(tip: HydrationTip): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const isAlreadySaved = this.savedTips.some(t => t.id === tip.id);
    
    if (isAlreadySaved) {
      this.savedTips = this.savedTips.filter(t => t.id !== tip.id);
    } else {
      this.savedTips.push(tip);
    }
    
    // Guardar en localStorage
    localStorage.setItem('savedHydrationTips', JSON.stringify(this.savedTips));
    
    // Mostrar feedback
    const action = isAlreadySaved ? 'removido de' : 'agregado a';
    console.log(`Tip ${action} favoritos:`, tip.title);
  }
  
  isTipSaved(tip: HydrationTip): boolean {
    return this.savedTips.some(t => t.id === tip.id);
  }
  
  // Acciones de rutinas
  viewRoutine(routine: HydrationRoutine): void {
    console.log('Abriendo modal de rutina:', routine.name);
    this.selectedRoutine = routine;
    this.showRoutineModal = true;
  }
  
  startRoutine(routine: HydrationRoutine): void {
    console.log('Comenzando rutina:', routine.name);
    // Abrir el modal de rutina para comenzar
    this.viewRoutine(routine);
  }
  
  // Cerrar modal de rutinas
  closeRoutineModal(): void {
    this.showRoutineModal = false;
    this.selectedRoutine = null;
  }
  
  // Acciones de productos
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.addToCartEvent.emit(product);
    console.log('Producto agregado al carrito:', product.name);
  }
  
  viewProduct(product: Product): void {
    this.viewProductEvent.emit(product);
    console.log('Ver producto:', product.name);
  }
  
  // Acciones del footer
  downloadTips(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const tipsData = {
      tips: this.filteredTips,
      routines: this.hydrationRoutines,
      date: new Date().toISOString(),
      stats: this.stats
    };
    
    const dataStr = JSON.stringify(tipsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `hydration-tips-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('Tips descargados');
  }
  
  shareTips(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    if (navigator.share) {
      navigator.share({
        title: 'Tips de Hidratación - ShopClassy',
        text: 'Descubre consejos expertos para mantener tu piel hidratada y saludable',
        url: window.location.href
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      const text = 'Tips de Hidratación - ShopClassy\n\nDescubre consejos expertos para mantener tu piel hidratada y saludable';
      navigator.clipboard.writeText(text).then(() => {
        alert('Información copiada al portapapeles');
      });
    }
  }
  
  // Cerrar modal
  closeTips(): void {
    this.isVisible = false;
    this.closeTipsEvent.emit();
  }
} 