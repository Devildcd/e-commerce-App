export interface ApiAuthLoginRequest {
  username: string;
  password: string;
}

export interface ApiAuthLoginResponse {
  token: string;
}
