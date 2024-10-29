import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, map, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthStatus } from '../../domains/enums/auth.enum';
import { AUTH_CONSTANTS } from '../../domains/constants/auth.constants';
import { ILoginRequest, ILoginResponse, IUser } from '../../domains/interfaces/auth.interface';
import { TokenRefreshState } from './token-refresh.service';
import { JWTTokenService } from './jwt-token.service';
import { WebStorageService } from './webstorage.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private readonly authStatus = new BehaviorSubject<AuthStatus>(AuthStatus.LOADING);
  private refreshTokenTimeout?: number;
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly tokenService: JWTTokenService,
    private readonly storage: WebStorageService,
    private readonly notification: NotificationService,
    private readonly tokenRefreshState: TokenRefreshState
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    try {
      if (this.tokenService.isTokenValid()) {
        this.authStatus.next(AuthStatus.AUTHENTICATED);
        this.setupAutoRefresh();
      } else {
        this.clearAuth();
      }
    } catch (error) {
      console.error('Error during auth initialization:', error);
      this.clearAuth();
    }
  }

  login(credentials: ILoginRequest): Observable<IUser> {
    this.notification.info('Connexion en cours...');

    return this.http.post<ILoginResponse>(
      `${this.apiUrl}${AUTH_CONSTANTS.ENDPOINTS.LOGIN}`, 
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ).pipe(
      tap(response => {
        if (!this.validateAuthResponse(response)) {
          throw new Error('Invalid login response format');
        }
        this.handleAuthSuccess(response);
        this.notification.success('Connexion réussie');
      }),
      map(response => response.user),
      catchError(error => {
        const errorMessage = error.error?.message || 'Échec de la connexion';
        this.notification.error(errorMessage);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.stopRefreshTokenTimer();
    this.clearAuth();
    this.tokenRefreshState.setRefreshing(false);
    this.tokenRefreshState.getRefreshSubject().next(null);
    this.notification.success('Déconnexion réussie');
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.storage.get(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    if (this.tokenRefreshState.isCurrentlyRefreshing()) {
      return this.tokenRefreshState.getRefreshSubject().pipe(
        filter(token => token !== null),
        take(1)
      ) as Observable<string>;
    }

    this.tokenRefreshState.setRefreshing(true);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<ILoginResponse>(
      `${this.apiUrl}${AUTH_CONSTANTS.ENDPOINTS.REFRESH}`,
      {},
      { headers }
    ).pipe(
      tap(response => {
        if (!this.validateAuthResponse(response)) {
          throw new Error('Invalid refresh token response');
        }
        this.handleAuthSuccess(response);
      }),
      map(response => response.accessToken),
      catchError(error => {
        this.clearAuth();
        this.notification.error('Session expirée, veuillez vous reconnecter');
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      }),
      finalize(() => {
        this.tokenRefreshState.setRefreshing(false);
      })
    );
  }

  private validateAuthResponse(response: ILoginResponse): boolean {
    return !!(
      response &&
      response.accessToken &&
      response.refreshToken &&
      response.user &&
      response.expiresIn
    );
  }

  private handleAuthSuccess(response: ILoginResponse): void {
    try {

      // Convertir expiresIn (secondes) en date d'expiration
      const expiration = new Date(Date.now() + response.expiresIn * 1000);

      // Stocker les données d'authentification
      this.tokenService.setToken(response.accessToken);
      this.storage.set(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      this.storage.set(AUTH_CONSTANTS.STORAGE_KEYS.USER, response.user);
      this.storage.set(AUTH_CONSTANTS.STORAGE_KEYS.TOKEN_EXPIRATION, expiration.toISOString());

      // Mettre à jour l'état
      this.authStatus.next(AuthStatus.AUTHENTICATED);
      this.tokenRefreshState.getRefreshSubject().next(response.accessToken);

      // Configurer le refresh automatique
      this.setupAutoRefresh();
    } catch (error) {
      console.error('Error in handleAuthSuccess:', error);
      this.clearAuth();
      throw error;
    }
  }

  private setupAutoRefresh(): void {
    // Arrêter le timer existant si présent
    this.stopRefreshTokenTimer();

    const expiration = this.storage.get(AUTH_CONSTANTS.STORAGE_KEYS.TOKEN_EXPIRATION);
    if (!expiration) return;

    const expirationDate = new Date(expiration);
    const timeout = expirationDate.getTime() - Date.now() - (60 * 1000); // 1 minute before expiration

    if (timeout > 0) {
      this.refreshTokenTimeout = window.setTimeout(() => {
        this.refreshToken().subscribe({
          next: () => console.log('Token refreshed successfully'),
          error: () => this.clearAuth()
        });
      }, timeout);
    } else {
      console.warn('Token is expired or about to expire, refreshing immediately');
       this.refreshToken().subscribe({
        error: () => this.clearAuth()
      });
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = undefined;
    }
  }

  private clearAuth(): void {
    this.stopRefreshTokenTimer();
    this.tokenService.removeToken();
    this.storage.clear();
    this.authStatus.next(AuthStatus.UNAUTHENTICATED);
  }

  getAccessToken(): string | null {
    return this.tokenService.getToken();
  }

  isAuthenticated(): boolean {
    return this.authStatus.value === AuthStatus.AUTHENTICATED;
  }

  getAuthStatus(): Observable<AuthStatus> {
    return this.authStatus.asObservable();
  }

  getCurrentUser(): Observable<IUser | null> {
    return of(this.storage.get(AUTH_CONSTANTS.STORAGE_KEYS.USER));
  }
}