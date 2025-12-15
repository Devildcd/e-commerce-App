import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '../state/auth-store';
import { NotificationService } from '../services/notification-service';

function checkAuth(redirectUrl: string) {
  const auth = inject(AuthStore);
  const router = inject(Router);
  const notifications = inject(NotificationService);

  if (auth.isAuthenticated()) return true;

  notifications.info('Please login to continue.');
  return router.createUrlTree(['/'], {
    queryParams: { returnUrl: redirectUrl },
  });
}

export const authGuard: CanActivateFn = (_route, state) => {
  return checkAuth(state.url);
};

export const authMatchGuard: CanMatchFn = (_route, segments) => {
  const url = '/' + segments.map(s => s.path).join('/');
  return checkAuth(url);
};