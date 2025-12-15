import { inject, Injectable } from "@angular/core";

import { LoggingService } from "../../../core/services/logging-service";
import { NotificationService } from "../../../core/services/notification-service";
import { CartItem } from "../../../core/state/cart-store";

export interface CheckoutSnapshot {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly logger = inject(LoggingService);
  private readonly notifications = inject(NotificationService);

  // orquestador-facade
  processPayment(
    snapshot: CheckoutSnapshot,
    paymentData: Record<string, unknown>
  ): boolean {
    if (!snapshot.totalItems) {
      this.logger.warning(
        'Checkout attempt with empty cart',
        paymentData,
        { feature: 'checkout' }
      );

      this.notifications.error(
        'Your shopping cart is empty. Please add products before checking out.'
      );

      return false;
    }

    this.logger.event('checkout_completed', {
      totalAmount: snapshot.totalAmount,
      totalItems: snapshot.totalItems,
      items: snapshot.items.map((item) => ({
        id: item.productId,
        qty: item.quantity,
        price: item.unitPrice,
      })),
      feature: 'checkout',
    });

    this.notifications.success(
      `Simulated payment made by ${snapshot.totalAmount.toFixed(
        2
      )} USD. Thank you for your purchase.`
    );

    return true;
  }
}