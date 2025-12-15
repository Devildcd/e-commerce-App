import { Injectable } from '@angular/core';

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface LogContext {
  url?: string;
  status?: number;
  method?: string;
  route?: string;
  feature?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  context?: LogContext;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private readonly storageKey = 'app_logs';
  private readonly maxEntries = 200;

  info(message: string, data?: unknown, context?: Partial<LogContext>): void {
    this.log('info', message, data, context);
  }

  warning(message: string, data?: unknown, context?: Partial<LogContext>): void {
    this.log('warning', message, data, context);
  }

  error(message: string, data?: unknown, context?: Partial<LogContext>): void {
    this.log('error', message, data, context);
  }

  debug(message: string, data?: unknown, context?: Partial<LogContext>): void {
    this.log('debug', message, data, context);
  }

  // eventos del negocio
  event(name: string, data?: unknown, context?: Partial<LogContext>): void {
    this.log('info', `event:${name}`, data, context);
  }

  // log
  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: Partial<LogContext>
  ): void {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      level,
      message,
      data,
      context,
      timestamp: new Date().toISOString(),
    };

    this.persist(entry);
    this.logToConsole(entry);
  }

  // simula post, pa este caso localStorage ver ahi
  private persist(entry: LogEntry): void {
    try {
      if (typeof window === 'undefined' || !('localStorage' in window)) {
        return;
      }

      const raw = window.localStorage.getItem(this.storageKey);
      const list: LogEntry[] = raw ? JSON.parse(raw) : [];

      list.push(entry);

      // limitar tamaño
      const trimmed =
        list.length > this.maxEntries ? list.slice(-this.maxEntries) : list;

      window.localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
    } catch {
    }
  }

  private logToConsole(entry: LogEntry): void {
    const { level, message, data, context, timestamp } = entry;
    const payload = { message, data, context, timestamp };

    switch (level) {
      case 'error':
        console.error('[LOG ERROR]', payload);
        break;
      case 'warning':
        console.warn('[LOG WARN]', payload);
        break;
      case 'info':
        console.info('[LOG INFO]', payload);
        break;
      case 'debug':
      default:
        console.debug('[LOG DEBUG]', payload);
        break;
    }
  }
}