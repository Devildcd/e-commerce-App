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
        'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
    } else {
      switch (error.status) {
        case 400:
          message = 'La petición no es válida. Revisa los datos e inténtalo de nuevo.';
          break;
        case 401:
          message = 'Tu sesión ha expirado o no estás autenticado.';
          break;
        case 403:
          message = 'No tienes permisos para realizar esta acción.';
          break;
        case 404:
          message = 'No encontramos el recurso que estás buscando.';
          break;
        case 500:
          message = 'Tuvimos un problema en el servidor. Inténtalo más tarde.';
          break;
        default:
          if (!message) {
            message =
              'Ocurrió un error inesperado. Inténtalo de nuevo en unos segundos.';
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
