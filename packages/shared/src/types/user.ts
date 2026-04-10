export type UserRole = 'user' | 'admin';

export interface LoginUser {
  id: string;
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  email_verified?: boolean;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  email_verified?: boolean;
  role: UserRole | null;
  avatar?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: LoginUser;
}

export interface RegisterResponse {
  message: string;
  user_id: string;
  email: string;
}
