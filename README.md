# 🛍️ ShopClassy - E-commerce de Productos de Belleza

**ShopClassy** es una aplicación web moderna de e-commerce especializada en productos de belleza y cosméticos, desarrollada con Angular 20 y Bootstrap 5.

## ✨ Características Principales

### 🎨 **Interfaz de Usuario Moderna**
- Diseño responsive y elegante con Bootstrap 5
- Paleta de colores personalizada (rosa y beige/dorado)
- Efectos hover dinámicos y animaciones CSS
- Componentes modulares y reutilizables

### 🔍 **Sistema de Búsqueda y Filtros**
- Búsqueda en tiempo real por nombre, descripción y marca
- Filtrado por categorías (Skincare, Makeup, Haircare, Tools)
- Ordenamiento múltiple (nombre, precio, rating, popularidad)
- Filtros combinables para resultados precisos

### 📱 **Responsive Design**
- Optimizado para dispositivos móviles y desktop
- Navegación adaptativa con menú hamburguesa
- Grid de productos responsive
- Componentes que se adaptan a diferentes tamaños de pantalla

### 🚀 **Performance y Tecnologías**
- Angular 20 con SSR (Server-Side Rendering)
- TypeScript para tipado estático
- SCSS para estilos avanzados
- RxJS para programación reactiva

## 🏗️ Arquitectura del Proyecto

### **Estructura de Componentes**
```
src/app/components/
├── header/          # Navegación principal con efectos hover dinámicos
├── hero/            # Sección de bienvenida
├── search-filters/  # Filtros de búsqueda y ordenamiento
├── product-grid/    # Grid de productos
├── product-card/    # Tarjetas individuales de productos
└── footer/          # Pie de página
```

### **Servicios y Lógica de Negocio**
- **ProductService**: Gestión de productos y categorías
- **Interfaces**: Tipos TypeScript para Product y Category
- **Estado**: Gestión reactiva del estado de la aplicación

### **Estilos y Temas**
- Variables CSS personalizadas para consistencia
- SCSS con anidamiento y mixins
- Efectos hover avanzados con transiciones CSS
- Gradientes y sombras para profundidad visual

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **Angular 20.1.5** - Framework principal
- **TypeScript 5.8.2** - Lenguaje de programación
- **Bootstrap 5.3.7** - Framework CSS
- **SCSS** - Preprocesador CSS
- **RxJS 7.8.0** - Programación reactiva

### **Herramientas de Desarrollo**
- **Angular CLI 20.1.5** - Herramientas de línea de comandos
- **Karma & Jasmine** - Testing framework
- **Prettier** - Formateo de código
- **ESLint** - Análisis estático de código

### **Características Avanzadas**
- **SSR (Server-Side Rendering)** - Mejora SEO y performance
- **PWA Ready** - Preparado para Progressive Web App
- **Responsive Design** - Adaptable a todos los dispositivos

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Angular CLI global

### **Instalación**
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd shopclassy

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
# o
ng serve
```

### **Scripts Disponibles**
```bash
npm start          # Inicia el servidor de desarrollo
npm run build      # Construye para producción
npm run watch      # Construye en modo watch
npm test           # Ejecuta tests unitarios
npm run e2e        # Ejecuta tests end-to-end
```

## 📱 Funcionalidades del Usuario

### **Navegación**
- Header responsive con navegación principal
- Menú móvil con toggle hamburguesa
- Enlaces a secciones principales (Home, Products, About, Contact)

### **Catálogo de Productos**
- Visualización en grid responsive
- Tarjetas de producto con información detallada
- Imágenes de alta calidad con lazy loading
- Indicadores de stock y ofertas

### **Búsqueda y Filtros**
- Búsqueda en tiempo real
- Filtros por categoría
- Ordenamiento por múltiples criterios
- Limpieza rápida de filtros

### **Información del Producto**
- Nombre, descripción y marca
- Precios con indicadores de descuento
- Sistema de rating con estrellas
- Número de reseñas
- Estado de stock

## 🎨 Personalización y Temas

### **Paleta de Colores**
```scss
:root {
  --primary-color: #f488ca;      // Rosa principal
  --secondary-color: #D4A574;    // Beige/Dorado
  --accent-color: #FF69B4;       // Rosa acento
  --success-color: #28a745;      // Verde éxito
  --warning-color: #ffc107;      // Amarillo advertencia
  --danger-color: #dc3545;       // Rojo error
}
```

### **Efectos Visuales**
- Gradientes lineales y radiales
- Sombras dinámicas con hover
- Transiciones suaves con cubic-bezier
- Animaciones de entrada escalonadas
- Efectos de partículas flotantes

## 📊 Estructura de Datos

### **Product Interface**
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isOnSale: boolean;
}
```

### **Category Interface**
```typescript
interface Category {
  id: string;
  name: string;
  count: number;
}
```

## 🔧 Configuración Avanzada

### **Angular Configuration**
- Configuración de build optimizada
- Presets de producción y desarrollo
- Configuración de assets y estilos
- Optimización de bundles

### **Bootstrap Integration**
- Importación automática de CSS y JS
- Popper.js para tooltips y popovers
- Iconos Font Awesome integrados
- Sistema de grid responsive

## 🧪 Testing

### **Unit Tests**
```bash
npm test
```
- Tests con Karma y Jasmine
- Cobertura de código
- Tests de componentes y servicios

### **End-to-End Tests**
```bash
npm run e2e
```
- Tests de integración
- Validación de flujos completos
- Tests de UI y funcionalidad

## 📦 Build y Despliegue

### **Build de Producción**
```bash
npm run build
```
- Optimización automática
- Minificación de código
- Tree shaking para reducir bundle size
- Hashing de archivos para cache busting

### **SSR (Server-Side Rendering)**
```bash
npm run serve:ssr:shopclassy
```
- Renderizado en servidor
- Mejora SEO
- Performance optimizada
- Tiempo de carga reducido

## 🤝 Contribución

### **Guidelines**
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### **Estándares de Código**
- TypeScript strict mode
- Prettier para formateo
- ESLint para linting
- Tests unitarios obligatorios

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

### **Documentación**
- [Angular Documentation](https://angular.dev/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Issues y Bug Reports**
- Usar el sistema de issues de GitHub
- Incluir pasos para reproducir
- Especificar versión del navegador y OS
- Adjuntar logs de consola si aplica

---

**Desarrollado con ❤️ usando Angular 20 y las mejores prácticas de desarrollo web moderno.**
