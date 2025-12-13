import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { UiNotification, UiStore } from '../../../core/state/ui-store';

@Component({
  selector: 'app-notifications',
  imports: [NgClass],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {

  private readonly uiStore = inject(UiStore);

  readonly notifications = this.uiStore.notifications;

  trackById(_: number, item: UiNotification): string {
    return item.id;
  }

  close(id: string): void {
    this.uiStore.dismissNotification(id);
  }

  getContainerClasses(notification: UiNotification): string {
    switch (notification.type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50 text-emerald-900';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-900';
      case 'warning':
        return 'border-amber-200 bg-amber-50 text-amber-900';
      case 'info':
      default:
        return 'border-sky-200 bg-sky-50 text-sky-900';
    }
  }
}
