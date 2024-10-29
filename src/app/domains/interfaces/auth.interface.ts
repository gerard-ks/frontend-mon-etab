import { Observable } from "rxjs";
import { AuthStatus } from "../enums/auth.enum";

export interface IUser {
  pseudo: string;
  photo?: string;
  roles: IUserRole[];
}

export interface ILoginRequest {
  pseudo: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: IUser;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IUserRole {
  id: number;   
  role: string;
}

export interface IErrorRoute {
  status: number;
  path: string;
  message: string;
}

export interface IAuthenticationService {
  login(credentials: ILoginRequest): Observable<IUser>;
  logout(): void;
  refreshToken(): Observable<string>;
  getAuthStatus(): Observable<AuthStatus>;
  getCurrentUser(): Observable<IUser | null>;
  isAuthenticated(): boolean;
}

export interface ITokenService {
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  isTokenValid(): boolean;
}

export interface IStorageStrategy {
  get(key: string): any;
  set(key: string, value: any): void;
  remove(key: string): void;
  clear(): void;
  watch(key: string): Observable<any>;
}

export interface INotificationStrategy {
  success(message: string, title?: string): void;
  error(message: string, title?: string): void;
  info(message: string, title?: string): void;
  warn(message: string, title?: string): void;
  clear(): void;
}