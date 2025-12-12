import { Injectable } from '@angular/core';

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

  showSuccess(message: string): void {
    console.log('[NOTIFY SUCCESS]', message);
  }

  showError(message: string): void {
    console.error('[NOTIFY ERROR]', message);
  }

  showInfo(message: string): void {
    console.info('[NOTIFY INFO]', message);
  }
}
