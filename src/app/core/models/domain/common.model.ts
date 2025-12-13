export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  status: number;
  message: string;
  url?: string | null;
  details?: unknown;
  isNetworkError?: boolean;
}
