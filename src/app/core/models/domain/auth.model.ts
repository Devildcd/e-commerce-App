import { UserAuth } from "./user.model";

export type AuthStatus = 'idle' | 'logging-in' | 'authenticated' | 'error';

// para el state
export interface AuthStateModel {
  user: UserAuth | null;
  token: string | null;   // recordar, token q viene de la Api al hacer login
  status: AuthStatus;
  errorMessage: string | null;
}
