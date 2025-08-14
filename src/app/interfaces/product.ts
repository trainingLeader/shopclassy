export interface Product {
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
    videoUrl?: string; // URL del video del producto
}
