import { inject, Injectable } from '@angular/core';
import { ApiHttpService } from './api-http-service';
import { Observable } from 'rxjs';

import { ApiAuthLoginRequest, ApiAuthLoginResponse } from '../models/api/auth-api.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly basePath = '/auth';

  readonly api = inject(ApiHttpService);

  login(
    username: string,
    password: string
  ): Observable<ApiAuthLoginResponse> {
    const body: ApiAuthLoginRequest = { username, password };
    return this.api.post<ApiAuthLoginResponse>(`${this.basePath}/login`, body);
  }

  logout() {}
}
