import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco, TRANSLOCO_MISSING_HANDLER } from '@jsverse/transloco';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { TranslocoHttpLoader } from './transloco-loader';
import { TranslationValidationErrorService } from './core/services/translation-validation-error.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['es'],
        defaultLang: 'es',
        fallbackLang: 'es',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        missingHandler: {
          logMissingKey: false,
        }
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: TRANSLOCO_MISSING_HANDLER,
      useClass: TranslationValidationErrorService
    }
  ]
};
