import { inject } from "@angular/core";
import { signalStore, withMethods, withState } from "@ngrx/signals";
import { AuthService } from "../services/auth-service";

export type AuthStatus = 'anonymous' | 'authenticating' | 'authenticated' | 'error';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  errorMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'anonymous',
  errorMessage: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, authService = inject(AuthService)) => ({
    login(username: string, password: string): void {
      // TODO: usar authService.login(...)
    },

    logout(): void {
      // TODO
    },

    // útil si algún día hidratas desde storage/token
    setSession(user: AuthUser, token: string): void {
      // TODO
    },
  }))
);
