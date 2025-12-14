import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface ApiRequestOptions {
  headers?:
    | HttpHeaders
    | {
        [key: string]: string | string[];
      };
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  withCredentials?: boolean;
  context?: HttpContext;
}

// Servicio centralizado para manejar la urlBase, usar T para HttpClient, headers
@Injectable({
  providedIn: 'root',
})
export class ApiHttpService {

  private readonly baseUrl = environment.apiBaseUrl;

  http = inject(HttpClient);

  // construir la url y normalizar(por si acaso)
  private buildUrl(path: string): string {
    if(!path) return this.baseUrl;

    if(path.startsWith("http://") || path.startsWith("https://")) return path;

    const normalizedBase = this.baseUrl.replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');

    return `${normalizedBase}/${normalizedPath}`;
  }

  // genericos para no repetir logica en las services
  get<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    return this.http.get<T>(url, options);
  }

  post<T> (path: string, payload: unknown, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    return this.http.post<T>(url, payload, options);
  }

  put<T>(path: string, payload: unknown, options?: ApiRequestOptions): Observable<T>{
    const url = this.buildUrl(path);
    return this.http.put<T>(url, payload, options);
  }

  patch<T>(path: string, payload: unknown, options?: ApiRequestOptions): Observable<T>{
    const url = this.buildUrl(path);
    return this.http.patch<T>(url, payload, options);
  }

  delete<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(path);
    return this.http.delete<T>(url, options);
  }
}
