import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import { Category } from '../interfaces/category';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private products: Product[] = [
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
      id: 2,
      name: 'Matte Liquid Lipstick Set',
      description: '12 stunning shades in long-lasting matte formula',
      price: 45.99,
      image: 'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg',
      category: 'Makeup',
      brand: 'ColorPop',
      rating: 4.6,
      reviews: 567,
      inStock: true,
      isOnSale: false,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
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
      id: 4,
      name: 'Professional Makeup Brush Set',
      description: '15-piece synthetic brush collection for flawless application',
      price: 129.99,
      image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
      category: 'Tools',
      brand: 'ProBeauty',
      rating: 4.7,
      reviews: 234,
      inStock: true,
      isOnSale: false
    },
    {
      id: 5,
      name: 'Rose Gold Eyeshadow Palette',
      description: '18 highly pigmented shades in warm rose gold tones',
      price: 78.00,
      originalPrice: 95.00,
      image: 'https://images.pexels.com/photos/2533434/pexels-photo-2533434.jpeg',
      category: 'Makeup',
      brand: 'Glamour',
      rating: 4.5,
      reviews: 445,
      inStock: true,
      isOnSale: true,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4'
    },
    {
      id: 6,
      name: 'Argan Oil Hair Treatment',
      description: 'Nourishing treatment oil for dry and damaged hair',
      price: 34.99,
      image: 'https://images.pexels.com/photos/7262773/pexels-photo-7262773.jpeg',
      category: 'Haircare',
      brand: 'PureArgan',
      rating: 4.4,
      reviews: 156,
      inStock: true,
      isOnSale: false
    },
    {
      id: 7,
      name: 'Illuminating Highlighter Trio',
      description: 'Three complementary shades for a radiant glow',
      price: 52.00,
      image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg',
      category: 'Makeup',
      brand: 'LuminousBeauty',
      rating: 4.6,
      reviews: 378,
      inStock: false,
      isOnSale: false
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

  private categories: Category[] = [
    { id: 'all', name: 'All Products', count: 8 },
    { id: 'skincare', name: 'Skincare', count: 3 },
    { id: 'makeup', name: 'Makeup', count: 3 },
    { id: 'haircare', name: 'Haircare', count: 1 },
    { id: 'tools', name: 'Tools', count: 1 }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  searchProducts(query: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    );
    return of(filteredProducts);
  }

  filterByCategory(category: string): Observable<Product[]> {
    if (category === 'all') {
      return of(this.products);
    }
    const filteredProducts = this.products.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
    return of(filteredProducts);
  }
}
