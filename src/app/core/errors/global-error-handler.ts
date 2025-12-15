import { ErrorHandler, inject, Injectable } from "@angular/core";
import { LoggingService } from "../services/logging-service";
import { NotificationService } from "../services/notification-service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggingService);
  private readonly notifications = inject(NotificationService);

  handleError(error: unknown): void {
    this.logger.error('Uncaught error', error, {
      feature: 'global-error-handler',
    });

    this.notifications.error(
      'An unexpected error occurred. Please try again in a few seconds.'
    );
    console.error(error);
  }
}