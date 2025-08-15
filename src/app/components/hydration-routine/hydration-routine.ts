import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';
import { HydrationService, HydrationRoutine, HydrationTip } from '../../services/hydration-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-hydration-routine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hydration-routine.html',
  styleUrl: './hydration-routine.scss'
})
export class HydrationRoutineComponent implements OnInit, OnDestroy {
  @Input() isVisible: boolean = false;
  @Input() routine: HydrationRoutine | null = null;
  @Output() closeRoutineEvent = new EventEmitter<void>();
  @Output() addToCartEvent = new EventEmitter<Product>();
  
  // Estado de la rutina
  isRoutineActive = false;
  isPaused = false;
  elapsedTime = 0;
  progressPercentage = 0;
  
  // Timer
  private timerInterval: any;
  private startTime: number = 0;
  private totalTime: number = 0;
  
  // Productos recomendados
  recommendedProducts: Product[] = [];
  
  // Consejos adicionales
  additionalTips: HydrationTip[] = [
    {
      id: 101,
      title: 'Preparación del Ambiente',
      description: 'Asegúrate de tener un ambiente limpio y bien iluminado para realizar tu rutina de hidratación.',
      category: 'general',
      skinType: ['all'],
      icon: 'fas fa-home'
    },
    {
      id: 102,
      title: 'Temperatura del Agua',
      description: 'Usa agua tibia para limpiar tu rostro. El agua muy caliente puede irritar la piel.',
      category: 'general',
      skinType: ['all'],
      icon: 'fas fa-thermometer-half'
    },
    {
      id: 103,
      title: 'Movimientos Suaves',
      description: 'Aplica los productos con movimientos circulares suaves, sin frotar demasiado.',
      category: 'general',
      skinType: ['all'],
      icon: 'fas fa-hand-paper'
    },
    {
      id: 104,
      title: 'Tiempo de Absorción',
      description: 'Espera 2-3 minutos entre cada producto para que se absorba correctamente.',
      category: 'general',
      skinType: ['all'],
      icon: 'fas fa-clock'
    }
  ];

  constructor(
    private hydrationService: HydrationService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (this.routine) {
      this.loadRecommendedProducts();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private loadRecommendedProducts(): void {
    if (this.routine) {
      // Obtener productos recomendados basados en la rutina
      this.hydrationService.getRecommendedHydrationProducts([]).subscribe(products => {
        this.recommendedProducts = products.slice(0, 3); // Solo mostrar 3 productos
      });
    }
  }

  // Métodos de utilidad
  getDifficultyLabel(difficulty: string): string {
    const labels: { [key: string]: string } = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return labels[difficulty] || difficulty;
  }

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

  getSkinTypesLabel(skinTypes: string[]): string {
    if (skinTypes.includes('all')) {
      return 'Todos los tipos';
    }
    return skinTypes.map(type => this.getSkinTypeLabel(type)).join(', ');
  }

  // Controles de la rutina
  startRoutine(): void {
    if (!this.routine) return;
    
    this.isRoutineActive = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.progressPercentage = 0;
    
    // Calcular tiempo total estimado (aproximado)
    this.totalTime = this.routine.steps.length * 60000; // 1 minuto por paso
    
    this.startTimer();
    
    console.log('Rutina iniciada:', this.routine.name);
  }

  pauseRoutine(): void {
    this.isPaused = true;
    this.stopTimer();
    console.log('Rutina pausada');
  }

  stopRoutine(): void {
    this.isRoutineActive = false;
    this.isPaused = false;
    this.stopTimer();
    this.elapsedTime = 0;
    this.progressPercentage = 0;
    console.log('Rutina detenida');
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.elapsedTime = Date.now() - this.startTime;
        this.progressPercentage = Math.min((this.elapsedTime / this.totalTime) * 100, 100);
        
        // Si la rutina se completa
        if (this.progressPercentage >= 100) {
          this.completeRoutine();
        }
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private completeRoutine(): void {
    this.stopTimer();
    this.isRoutineActive = false;
    this.progressPercentage = 100;
    
    // Mostrar mensaje de completado
    alert(`¡Felicidades! Has completado la rutina: ${this.routine?.name}`);
    
    console.log('Rutina completada:', this.routine?.name);
  }

  formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Consejos de la rutina
  getRoutineTips(): HydrationTip[] {
    if (!this.routine) return [];
    
    // Combinar consejos generales con consejos específicos de la rutina
    const routineSpecificTips = this.routine.steps
      .filter(step => step.category === 'general')
      .slice(0, 2);
    
    return [...this.additionalTips, ...routineSpecificTips];
  }

  // Acciones de productos
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.addToCartEvent.emit(product);
    console.log('Producto agregado al carrito:', product.name);
  }

  // Acciones del footer
  saveRoutine(): void {
    if (!this.routine) return;
    
    const savedRoutines = JSON.parse(localStorage.getItem('savedHydrationRoutines') || '[]');
    const isAlreadySaved = savedRoutines.some((r: any) => r.id === this.routine!.id);
    
    if (!isAlreadySaved) {
      savedRoutines.push({
        id: this.routine.id,
        name: this.routine.name,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('savedHydrationRoutines', JSON.stringify(savedRoutines));
      alert('Rutina guardada en favoritos');
    } else {
      alert('Esta rutina ya está guardada');
    }
  }

  shareRoutine(): void {
    if (!this.routine) return;
    
    const shareData = {
      title: `Rutina de Hidratación: ${this.routine.name}`,
      text: `Descubre esta rutina de hidratación: ${this.routine.description}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback para navegadores que no soportan Web Share API
      const text = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Información de la rutina copiada al portapapeles');
      });
    }
  }

  downloadRoutine(): void {
    if (!this.routine) return;
    
    const routineData = {
      routine: this.routine,
      steps: this.routine.steps,
      tips: this.getRoutineTips(),
      date: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(routineData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `hydration-routine-${this.routine.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('Rutina descargada');
  }

  // Cerrar modal
  closeRoutine(): void {
    if (this.isRoutineActive) {
      const confirmClose = confirm('¿Estás seguro de que quieres cerrar? La rutina se detendrá.');
      if (confirmClose) {
        this.stopRoutine();
      } else {
        return;
      }
    }
    
    this.isVisible = false;
    this.closeRoutineEvent.emit();
  }
}
