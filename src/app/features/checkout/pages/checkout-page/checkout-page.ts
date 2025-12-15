import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

import { CartItem, CartStore } from '../../../../core/state/cart-store';
import { CheckoutStore } from '../../../../core/state/checkout.store';
import { NotificationService } from '../../../../core/services/notification-service';
import { GenericFormConfig } from '../../../../shared/interfaces/form-config.interface';
import { GenericForm } from '../../../../shared/components/generic-form/generic-form';
import { LoggingService } from '../../../../core/services/logging-service';
import { CheckoutService } from '../../services/checkout-service';


@Component({
  selector: 'app-checkout-page',
  imports: [GenericForm, CurrencyPipe],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
})
export class CheckoutPage {

  private readonly cartStore = inject(CartStore);
  private readonly checkoutStore = inject(CheckoutStore);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly logger = inject(LoggingService);
  private readonly checkoutService = inject(CheckoutService);

  readonly items = this.cartStore.items;
  readonly totalItems = this.cartStore.totalItems;
  readonly totalAmount = this.cartStore.totalAmount;

  // generic form shipping
  readonly shippingFormConfig: GenericFormConfig = {
    title: 'Shipping Details',
    description: 'Please complete the delivery information.',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        placeholder: 'John',
        required: true,
        minLength: 2,
      },
      {
        name: 'lastName',
        label: 'Last Name',
        placeholder: 'Smith',
        required: true,
        minLength: 2,
      },
      {
        name: 'address',
        label: 'Address',
        placeholder: '123 Example Ave',
        required: true,
        minLength: 5,
      },
      {
        name: 'city',
        label: 'City',
        placeholder: 'Miami',
        required: true,
        minLength: 2,
      },
      {
        name: 'postalCode',
        label: 'Postal Code',
        placeholder: '33101',
        required: true,
        minLength: 4,
      },
    ],
    primaryButton: { label: 'Save Shipping Details' },
    secondaryButton: { label: 'Cancel' },
  };

  //pay
  readonly paymentFormConfig: GenericFormConfig = {
    title: 'Payment',
    fields: [
      {
        name: 'cardHolder',
        label: 'Card Holder',
        placeholder: 'John Smith',
        required: true,
        minLength: 3,
      },
      {
        name: 'cardNumber',
        label: 'Card Number',
        placeholder: '1234 5678 9012 3456',
        required: true,
        pattern: '^[0-9 ]{13,19}$',
        patternErrorMessage: 'Please enter a valid card number.',
      },
    ],
    primaryButton: { label: 'Complete Purchase' },
  };

  // shipping mtodos
  onShippingSubmit(value: Record<string, unknown>): void {
    this.checkoutStore.saveShipping(value);

    this.logger.info('Shipping data submitted', value, {
      feature: 'checkout',
    });
    this.notifications.info('Shipping information saved.');
  }

  onShippingCancel(): void {
    this.router.navigate(['/cart']);
  }

  // pay metodos
   onPaymentSubmit(value: Record<string, unknown>): void {
    const snapshot = this.cartStore.getSnapshot();
    const ok = this.checkoutService.processPayment(snapshot, value);

    if (!ok) {
      this.router.navigate(['/']);
      return;
    }

    this.cartStore.clear();
    this.router.navigate(['/']);
  }

  onPaymentCancel(): void {
    this.router.navigate(['/cart']);
  }

  trackByProductId(_index: number, item: CartItem): number {
    return item.productId;
  }

  goToCart() {
    this.router.navigate(["/cart"]);
  }
}

