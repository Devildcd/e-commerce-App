import { CanActivateFn, CanDeactivateFn } from '@angular/router';

export interface CanLeaveCheckout {
  canDeactivate: () => boolean;
}

export const checkoutDeactivateGuard: CanDeactivateFn<CanLeaveCheckout> = (component) => {
  if (!component) return true;

  return typeof component.canDeactivate === 'function'
    ? component.canDeactivate()
    : true;
};