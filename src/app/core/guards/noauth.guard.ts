import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../../domains/enums/auth.enum';
import { NotificationService } from '../services/notification.service';

export const noAuthGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return authService.getAuthStatus().pipe(
    take(1),
    map(status => {
      if (status === AuthStatus.AUTHENTICATED) {
        notificationService.info(
          'Vous êtes déjà connecté',
          'Redirection'
        );
        router.navigate(['/backoffice']);
        return false;
      }
      return true;
    })
  );
};