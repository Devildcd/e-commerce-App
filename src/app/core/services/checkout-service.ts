import { Injectable } from '@angular/core';
import { CartSnapshot } from '../../core/state/cart-store'; // ajusta la ruta real

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  processPayment(cart: CartSnapshot, payment: Record<string, unknown>): boolean {
    if (!cart || cart.totalItems <= 0 || cart.totalAmount <= 0) return false;

    const cardHolder = String(payment['cardHolder'] ?? '').trim();
    const rawCardNumber = String(payment['cardNumber'] ?? '').trim();
    const cardNumber = rawCardNumber.replace(/\s+/g, '');

    if (cardHolder.length < 3) return false;

    // 13-19 dígitos 
    if (!/^\d{13,19}$/.test(cardNumber)) return false;
    return true;
  }
}