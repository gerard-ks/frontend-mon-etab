import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig, withSessionStorage } from 'ngx-webstorage';
import { provideLottieOptions, provideCacheableAnimationLoader } from 'ngx-lottie';
import player from 'lottie-web';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthService } from './core/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, 
    withViewTransitions(),
    withComponentInputBinding()),
    provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor])),
    provideAnimations(),


    provideNgxWebstorage(
    withNgxWebstorageConfig({
      prefix: 'app',
      separator: '.',
      caseSensitive: false
    }),
    withLocalStorage(),
    withSessionStorage()
    ),
    MessageService,
    AuthService,

    provideLottieOptions({ player: () => player }),
    provideCacheableAnimationLoader(),
  ]
};
