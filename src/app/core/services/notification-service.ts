import { inject, Injectable } from '@angular/core';
import { NotificationKind, UiStore } from '../state/ui-store';
import { ApiError } from '../models/domain/common.model';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private readonly uiStore = inject(UiStore);

  success(message: string): void {
    this.push('success', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

  warning(message: string): void {
    this.push('warning', message);
  }

  error(message: string): void {
    this.push('error', message);
  }

  // Para cuando se llame desde el interceptor
  showHttpError(error: ApiError): void {
    let message = error.message;

    if (error.isNetworkError) {
      message =
        'Could not connect to the server. Please check your internet connection.';
    } else {
      switch (error.status) {
        case 400:
          message = 'The request is invalid. Please check the data and try again.';
          break;
        case 401:
          message = 'Your session has expired or you are not authenticated.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'We could not find the resource you are looking for.';
          break;
        case 500:
          message = 'We had a problem on the server. Please try again later.';
          break;
        default:
          if (!message) {
            message =
              'An unexpected error occurred. Please try again in a few seconds.';
          }
          break;
      }
    }

    this.error(message);
  }

  // para instertar en el state, revisar luego si se adapta a patron <= OJO
  private push(type: NotificationKind, message: string): void {
    this.uiStore.addNotification({ type, message });
  }
}
