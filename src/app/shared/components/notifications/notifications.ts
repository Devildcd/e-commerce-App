import { Component, DestroyRef, effect, inject } from '@angular/core';
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
  private readonly destroyRef = inject(DestroyRef);

  readonly notifications = this.uiStore.notifications;
  private readonly timers = new Map<string, number>();

  constructor() {
    // autocierre si aparecen nuevas
    effect(() => {
      const list = this.notifications();

      for (const n of list) {
        if (this.timers.has(n.id)) continue;

        const t = window.setTimeout(() => {
          this.uiStore.dismissNotification(n.id);
          this.timers.delete(n.id);
        }, 3000);

        this.timers.set(n.id, t);
      }

      // limpia timers de notificaciones
      const ids = new Set(list.map(x => x.id));
      for (const [id, t] of this.timers) {
        if (!ids.has(id)) {
          clearTimeout(t);
          this.timers.delete(id);
        }
      }
    });

    // cleanup si component se va
    this.destroyRef.onDestroy(() => {
      for (const t of this.timers.values()) clearTimeout(t);
      this.timers.clear();
    });
  }

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
