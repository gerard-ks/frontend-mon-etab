import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { IUserRole } from '../../domains/interfaces/auth.interface';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  
  const requiredRoles = route.data['roles'] as string[];

  return authService.getCurrentUser().pipe(
    take(1),
    map(user => {
      if (!user) {
        notificationService.error('Utilisateur non connecté');
        router.navigate(['/auth/login']);
        return false;
      }

      const hasRequiredRole = requiredRoles.some(requiredRole => 
        user.roles.some((userRole: IUserRole) => userRole.role === requiredRole)
      );

      if (!hasRequiredRole) {
        notificationService.error(
          'Vous n\'avez pas les permissions nécessaires pour accéder à cette page',
          'Accès non autorisé'
        );
        router.navigate(['/error/403']);
        return false;
      }

      return true;
    })
  );
};