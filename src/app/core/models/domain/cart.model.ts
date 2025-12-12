import { Product } from "./product.model";

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number; // recordar, esto sale de multiplicar precio unitario * cantidad
}

// Esto es para usar en el state luego
export interface CartStateModel {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// recordar para luego, en una compra de un mismo producto puedo tener mas de 1, con su subtotal,
// y a la vez totalAmunt incluye todos los productos, incluidos los q se repitan <- OJO
