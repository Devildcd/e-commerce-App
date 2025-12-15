import { Directive, ElementRef, HostListener, inject, input, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LoggingService } from '../../core/services/logging-service';

@Directive({
  selector: '[appTrackClick]',
})
export class TrackClick {

  private readonly logger = inject(LoggingService);
  private readonly router = inject(Router);
  private readonly el = inject(ElementRef<HTMLElement>);

  readonly trackPayload = input<Record<string, unknown> | null>(null);
  readonly eventName = input<string>('', { alias: 'appTrackClick' });

  @HostListener('click', ['$event'])
  onHostClick(_event: MouseEvent): void {
    const name = this.eventName().trim();

    if (!name) {
      return;
    }

    const extraPayload = this.trackPayload() ?? {};
    const element = this.el.nativeElement;
    const tag = element.tagName.toLowerCase();

    this.logger.event(name, {
      ...extraPayload,
      route: this.router.url,
      tag,
    });
  }
}
