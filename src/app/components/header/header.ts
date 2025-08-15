import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ShopCar } from '../shop-car/shop-car';
import { HydrationTips } from '../hydration-tips/hydration-tips';
import { Product } from '../../interfaces/product';

interface MenuItem {
  label: string;
  href: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ShopCar, HydrationTips],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  isNavbarCollapsed = true;
  isScrolled = false;
  isAnimating = false;
  windowWidth: number = 0;
  isMobile: boolean = false;
  showHydrationTips = false;

  menuItems: MenuItem[] = [
    { label: 'Home', href: '#home', icon: 'fas fa-home', active: true },
    { label: 'Products', href: '#products', icon: 'fas fa-shopping-bag', active: false },
    { label: 'About', href: '#about', icon: 'fas fa-info-circle', active: false },
    { label: 'Contact', href: '#contact', icon: 'fas fa-envelope', active: false }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScrollPosition();
      this.updateWindowWidth();
      this.checkMobileState();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScrollPosition();
    }
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateWindowWidth();
      this.checkMobileState();
    }
  }

  private checkScrollPosition(): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 50;
    }
  }

  private updateWindowWidth(): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      this.windowWidth = window.innerWidth;
    }
  }

  private checkMobileState(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = this.windowWidth <= 991.98;
    }
  }

  toggleNavbar(): void {
    this.isAnimating = true;
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 350);
  }

  setActiveMenuItem(index: number): void {
    this.menuItems.forEach((item, i) => {
      item.active = i === index;
    });
    
    // En móvil, cerrar el menú después de seleccionar un elemento
    if (this.isMobile) {
      setTimeout(() => {
        this.isNavbarCollapsed = true;
        this.isAnimating = true;
        setTimeout(() => {
          this.isAnimating = false;
        }, 350);
      }, 300);
    }
  }

  openHydrationTips(): void {
    this.showHydrationTips = true;
  }

  closeHydrationTips(): void {
    this.showHydrationTips = false;
  }

  onAddToCart(product: Product): void {
    console.log('Producto agregado al carrito desde header:', product.name);
    // Aquí podrías emitir un evento o actualizar el estado del carrito
  }

  onViewProduct(product: Product): void {
    console.log('Ver producto desde header:', product.name);
    // Aquí podrías navegar a la página del producto o abrir un modal
  }
}