import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { Observable, of } from 'rxjs';

export interface HydrationTip {
  id: number;
  title: string;
  description: string;
  category: 'morning' | 'evening' | 'general';
  skinType: string[];
  icon: string;
}

export interface HydrationRoutine {
  id: number;
  name: string;
  description: string;
  steps: HydrationTip[];
  skinType: string[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

@Injectable({
  providedIn: 'root'
})
export class HydrationService {
  private hydrationTips: HydrationTip[] = [
    {
      id: 1,
      title: 'Limpieza Suave',
      description: 'Comienza con un limpiador suave que no elimine la humedad natural de tu piel.',
      category: 'morning',
      skinType: ['all', 'dry', 'normal', 'combination'],
      icon: 'fas fa-tint'
    },
    {
      id: 2,
      title: 'Tónico Hidratante',
      description: 'Aplica un tónico sin alcohol para equilibrar el pH y preparar la piel.',
      category: 'morning',
      skinType: ['all', 'dry', 'normal', 'combination'],
      icon: 'fas fa-spray-can'
    },
    {
      id: 3,
      title: 'Serum de Vitamina C',
      description: 'Aplica un serum de vitamina C para protección antioxidante y luminosidad.',
      category: 'morning',
      skinType: ['all', 'dry', 'normal', 'combination', 'oily'],
      icon: 'fas fa-sun'
    },
    {
      id: 4,
      title: 'Crema Hidratante',
      description: 'Aplica tu crema hidratante principal con movimientos circulares suaves.',
      category: 'morning',
      skinType: ['all', 'dry', 'normal', 'combination'],
      icon: 'fas fa-leaf'
    },
    {
      id: 5,
      title: 'Protector Solar',
      description: 'Nunca olvides el protector solar SPF 30+ para proteger tu piel del daño solar.',
      category: 'morning',
      skinType: ['all', 'dry', 'normal', 'combination', 'oily'],
      icon: 'fas fa-shield-alt'
    },
    {
      id: 6,
      title: 'Doble Limpieza',
      description: 'Por la noche, usa doble limpieza: primero aceite, luego gel limpiador.',
      category: 'evening',
      skinType: ['all', 'dry', 'normal', 'combination', 'oily'],
      icon: 'fas fa-bath'
    },
    {
      id: 7,
      title: 'Exfoliación Suave',
      description: '2-3 veces por semana, exfolia suavemente para renovar la piel.',
      category: 'evening',
      skinType: ['normal', 'combination', 'oily'],
      icon: 'fas fa-magic'
    },
    {
      id: 8,
      title: 'Mascarilla Hidratante',
      description: 'Aplica una mascarilla hidratante 1-2 veces por semana.',
      category: 'evening',
      skinType: ['all', 'dry', 'normal', 'combination'],
      icon: 'fas fa-mask'
    },
    {
      id: 9,
      title: 'Crema Nocturna',
      description: 'Usa una crema nocturna más rica para reparar la piel mientras duermes.',
      category: 'evening',
      skinType: ['all', 'dry', 'normal', 'combination'],
      icon: 'fas fa-moon'
    },
    {
      id: 10,
      title: 'Hidratación Interna',
      description: 'Bebe al menos 8 vasos de agua al día para hidratar desde adentro.',
      category: 'general',
      skinType: ['all', 'dry', 'normal', 'combination', 'oily'],
      icon: 'fas fa-tint'
    }
  ];

  private hydrationRoutines: HydrationRoutine[] = [
    {
      id: 1,
      name: 'Rutina Básica de Hidratación',
      description: 'Rutina esencial para mantener la piel hidratada y saludable.',
      steps: [1, 2, 4, 5, 6, 9].map(id => this.hydrationTips.find(tip => tip.id === id)!),
      skinType: ['all', 'dry', 'normal', 'combination'],
      duration: '10-15 minutos',
      difficulty: 'beginner'
    },
    {
      id: 2,
      name: 'Rutina Intensiva de Hidratación',
      description: 'Rutina avanzada para piel seca o deshidratada.',
      steps: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(id => this.hydrationTips.find(tip => tip.id === id)!),
      skinType: ['dry', 'normal'],
      duration: '20-25 minutos',
      difficulty: 'intermediate'
    },
    {
      id: 3,
      name: 'Rutina Anti-Edad con Hidratación',
      description: 'Rutina especializada para piel madura que necesita hidratación extra.',
      steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => this.hydrationTips.find(tip => tip.id === id)!),
      skinType: ['all', 'dry', 'normal'],
      duration: '25-30 minutos',
      difficulty: 'advanced'
    }
  ];

  // Productos de hidratación predefinidos para mostrar como recomendados
  private recommendedHydrationProducts: Product[] = [
    {
      id: 1,
      name: 'Luxury Hydrating Moisturizer',
      description: 'Deep hydration with anti-aging properties for all skin types',
      price: 89.99,
      originalPrice: 120.00,
      image: 'https://images.pexels.com/photos/7261674/pexels-photo-7261674.jpeg',
      category: 'Skincare',
      brand: 'GlowLux',
      rating: 4.8,
      reviews: 324,
      inStock: true,
      isOnSale: true,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    },
    {
      id: 3,
      name: 'Vitamin C Brightening Serum',
      description: 'Powerful antioxidant serum for radiant, even skin tone',
      price: 65.00,
      originalPrice: 85.00,
      image: 'https://images.pexels.com/photos/7262775/pexels-photo-7262775.jpeg',
      category: 'Skincare',
      brand: 'RadiantGlow',
      rating: 4.9,
      reviews: 892,
      inStock: true,
      isOnSale: true,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4'
    },
    {
      id: 8,
      name: 'Retinol Night Cream',
      description: 'Anti-aging night treatment with 0.5% retinol',
      price: 95.00,
      originalPrice: 115.00,
      image: 'https://images.pexels.com/photos/7797428/pexels-photo-7797428.jpeg',
      category: 'Skincare',
      brand: 'AgeDefying',
      rating: 4.8,
      reviews: 621,
      inStock: true,
      isOnSale: true,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    }
  ];

  constructor() {}

  // Obtener todos los tips de hidratación
  getHydrationTips(): Observable<HydrationTip[]> {
    return of(this.hydrationTips);
  }

  // Obtener tips por categoría
  getTipsByCategory(category: 'morning' | 'evening' | 'general'): Observable<HydrationTip[]> {
    const filteredTips = this.hydrationTips.filter(tip => tip.category === category);
    return of(filteredTips);
  }

  // Obtener tips por tipo de piel
  getTipsBySkinType(skinType: string): Observable<HydrationTip[]> {
    const filteredTips = this.hydrationTips.filter(tip => 
      tip.skinType.includes('all') || tip.skinType.includes(skinType.toLowerCase())
    );
    return of(filteredTips);
  }

  // Obtener todas las rutinas de hidratación
  getHydrationRoutines(): Observable<HydrationRoutine[]> {
    return of(this.hydrationRoutines);
  }

  // Obtener rutina por ID
  getRoutineById(id: number): Observable<HydrationRoutine | undefined> {
    const routine = this.hydrationRoutines.find(r => r.id === id);
    return of(routine);
  }

  // Obtener rutinas por tipo de piel
  getRoutinesBySkinType(skinType: string): Observable<HydrationRoutine[]> {
    const filteredRoutines = this.hydrationRoutines.filter(routine => 
      routine.skinType.includes('all') || routine.skinType.includes(skinType.toLowerCase())
    );
    return of(filteredRoutines);
  }

  // Obtener rutinas por dificultad
  getRoutinesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Observable<HydrationRoutine[]> {
    const filteredRoutines = this.hydrationRoutines.filter(routine => routine.difficulty === difficulty);
    return of(filteredRoutines);
  }

  // Obtener productos de hidratación recomendados
  getRecommendedHydrationProducts(products: Product[]): Observable<Product[]> {
    // Si no se pasan productos, usar los predefinidos
    if (!products || products.length === 0) {
      return of(this.recommendedHydrationProducts);
    }
    
    const hydrationKeywords = ['hydrating', 'moisturizer', 'serum', 'cream', 'hydration', 'moisture'];
    const recommendedProducts = products.filter(product => 
      product.category.toLowerCase() === 'skincare' &&
      (hydrationKeywords.some(keyword => 
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      ))
    );
    
    // Si no hay productos recomendados, usar los predefinidos
    if (recommendedProducts.length === 0) {
      return of(this.recommendedHydrationProducts);
    }
    
    return of(recommendedProducts);
  }

  // Obtener consejos personalizados basados en el producto
  getPersonalizedTips(product: Product): Observable<HydrationTip[]> {
    let relevantTips: HydrationTip[] = [];
    
    if (product.category.toLowerCase() === 'skincare') {
      if (product.name.toLowerCase().includes('moisturizer') || product.name.toLowerCase().includes('cream')) {
        relevantTips = this.hydrationTips.filter(tip => 
          tip.title.includes('Crema') || tip.title.includes('Hidratante')
        );
      } else if (product.name.toLowerCase().includes('serum')) {
        relevantTips = this.hydrationTips.filter(tip => 
          tip.title.includes('Serum') || tip.title.includes('Vitamina')
        );
      } else if (product.name.toLowerCase().includes('cleanser') || product.name.toLowerCase().includes('limpiador')) {
        relevantTips = this.hydrationTips.filter(tip => 
          tip.title.includes('Limpieza')
        );
      }
    }
    
    // Si no hay tips específicos, devolver tips generales
    if (relevantTips.length === 0) {
      relevantTips = this.hydrationTips.filter(tip => tip.category === 'general');
    }
    
    return of(relevantTips);
  }

  // Obtener estadísticas de hidratación
  getHydrationStats(): Observable<{totalTips: number, totalRoutines: number, categories: string[]}> {
    const stats = {
      totalTips: this.hydrationTips.length,
      totalRoutines: this.hydrationRoutines.length,
      categories: ['morning', 'evening', 'general']
    };
    return of(stats);
  }
} 