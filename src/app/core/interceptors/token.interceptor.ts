import { inject } from '@angular/core';
import { HttpRequest, HttpInterceptorFn, HttpHandlerFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { TokenRefreshState } from '../services/token-refresh.service';
import { JWTTokenService } from '../services/jwt-token.service';


export const tokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const tokenService = inject(JWTTokenService);
  const tokenRefreshState = inject(TokenRefreshState);

  // Ne pas intercepter les URLs d'auth
  if (isAuthUrl(request.url)) {
    return next(request);
  }

  // Cloner et modifier la requête avec les credentials et le token
  const modifiedRequest = addTokenToRequest(request, tokenService.getToken());

  return next(modifiedRequest).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Ne pas tenter de refresh si on est déjà sur l'URL de refresh
        if (request.url.includes('/auth/refresh')) {
          return throwError(() => error);
        }
        return handleUnauthorizedError(modifiedRequest, next, authService, tokenRefreshState);
      }
      return throwError(() => error);
    })
  );
};

// Fonctions utilitaires inchangées
function isAuthUrl(url: string): boolean {
  return url.includes('/api/auth/login') || url.includes('/api/auth/refresh');
}

function addTokenToRequest(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  let modifiedRequest = request.clone({
    withCredentials: true
  });

  if (token) {
    modifiedRequest = modifiedRequest.clone({
      setHeaders: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}` 
      }
    });
  }

  return modifiedRequest;
}

function handleUnauthorizedError(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  tokenRefreshState: TokenRefreshState
): Observable<HttpEvent<any>> {


  if (tokenRefreshState.isCurrentlyRefreshing()) {
    return tokenRefreshState.getRefreshSubject().pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(addTokenToRequest(request, token));
      }),
      catchError(error => {
        authService.logout();
        return throwError(() => new Error('Failed to refresh token'));
      })
    );
  }

  tokenRefreshState.setRefreshing(true);

  return authService.refreshToken().pipe(
    switchMap(newToken => {
      tokenRefreshState.setRefreshing(false);
      return next(addTokenToRequest(request, newToken));
    }),
    catchError(error => {
      authService.logout();
      return throwError(() => error);
    })
  );
}