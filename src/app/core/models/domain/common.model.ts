export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  status: number;
  message: string;
  url?: string;
  details?: unknown;
}
