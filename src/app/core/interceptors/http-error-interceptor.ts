import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { LoggingService } from '../services/logging-service';
import { NotificationService } from '../services/notification-service';
import { catchError, throwError } from 'rxjs';

import { ApiError } from '../models/domain/common.model';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      const normalized = mapToApiError(error, req.url);

      // pa log, luego, recordar
      logger.error('HTTP error', normalized);

      notifications.showHttpError(normalized);

      return throwError(() => normalized);
    })
  );
};

function mapToApiError(error: unknown, url: string): ApiError {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return {
        status: 0,
        url,
        message: 'No se pudo contactar con el servidor.',
        isNetworkError: true,
        details: error.error,
      };
    }

    const messageFromBackend =
      (typeof error.error === 'string'
        ? error.error
        : (error.error?.message as string | undefined)) ?? '';

    return {
      status: error.status,
      url,
      message: messageFromBackend || error.message,
      details: error.error,
    };
  }

  return {
    status: -1,
    url,
    message: 'Error inesperado procesando la petición.',
    details: error,
  };
}
