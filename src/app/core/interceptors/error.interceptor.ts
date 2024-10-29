import { inject } from '@angular/core';
import { HttpRequest, HttpErrorResponse, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ERROR_ROUTES } from '../../domains/constants/auth.constants';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Ne pas traiter les erreurs 401 ici si c'est une requête d'authentification
      if (error.status === 401 && !request.url.includes('/auth/refresh')) {
        return throwError(() => error);
      }

      let errorMessage = 'Une erreur est survenue';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        const errorRoute = ERROR_ROUTES.find(route => route.status === error.status);

        if (errorRoute) {
          errorMessage = error.error?.message || errorRoute.message;
          
          // Ne pas rediriger pour les erreurs 401
          if (error.status !== 401) {
            router.navigate([errorRoute.path]);
          }
        } else {
          errorMessage = `Erreur ${error.status}: ${error.error?.message || 'Une erreur est survenue'}`;
        }
      }

      // Afficher la notification sauf pour les refresh silencieux
      if (!request.url.includes('/auth/refresh')) {
        notificationService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};