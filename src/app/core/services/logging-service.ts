import { Injectable } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  log(message: string, ...optional: unknown[]): void {
    console.log('[LOG]', message, ...optional);
  }

  info(message: string, ...optional: unknown[]): void {
    console.info('[INFO]', message, ...optional);
  }

  warn(message: string, ...optional: unknown[]): void {
    console.warn('[WARN]', message, ...optional);
  }

  error(message: string, error?: unknown, ...optional: unknown[]): void {
    console.error('[ERROR]', message, error, ...optional);
  }
}
