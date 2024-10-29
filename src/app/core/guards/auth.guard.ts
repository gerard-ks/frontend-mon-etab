import { inject, InjectionToken } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../../domains/enums/auth.enum';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return authService.getAuthStatus().pipe(
    take(1),
    map(status => {
      if (status === AuthStatus.AUTHENTICATED) {
        return true;
      }
      
      notificationService.warn('Veuillez vous connecter pour accéder à cette page');
      router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    })
  );
};
