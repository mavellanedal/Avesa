import { ApplicationConfig, importProvidersFrom, isDevMode, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco, TRANSLOCO_MISSING_HANDLER } from '@jsverse/transloco';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { TranslationValidationErrorService } from './core/services/translation-validation-error.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { httpActivityInterceptor } from '@core/interceptors/http-activity.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { JwtInterceptor } from '@core/interceptors/jwt.interceptor';
import { pendingRequestsInterceptor$ } from 'ng-http-loader';
import { MatPaginatorIntl } from '@angular/material/paginator';
import {
  DateAdapter,
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import { InstantErrorStateMatcher } from '@core/common/instant-error-state-matcher';
import { provideMomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { httpErrorInterceptor } from '@core/interceptors/http-error.interceptor';


registerLocaleData(localeEs, 'es')

export const CUSTOM_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const CUSTOM_DATE_TIME_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
    monthInput: 'MMMM',
    yearInput: 'YYYY',
    timeInput: 'HH:mm',
    datetimeInput: 'DD/MM/YYYY HH:mm',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthInput: 'MMMM',
    yearInput: 'YYYY',
    timeInput: 'HH:mm',
    datetimeInput: 'DD/MM/YYYY HH:mm',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    popupHeaderDateLabel: 'MMM DD, ddd',
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    provideZoneChangeDetection({ eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([
        JwtInterceptor,
        httpActivityInterceptor,
        httpErrorInterceptor,
        pendingRequestsInterceptor$,
      ])
    ),
    importProvidersFrom([
      JwtModule.forRoot({
        config: {
          tokenGetter: () => getAuthToken(),
        },
      }),
    ]),
    provideTransloco({
      config: {
        availableLangs: ['es'],
        defaultLang: 'es',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    { provide: TRANSLOCO_MISSING_HANDLER, useClass: TranslationValidationErrorService },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false }},
    // { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    { provide: ErrorStateMatcher, useClass: InstantErrorStateMatcher },
    provideMomentDatetimeAdapter(CUSTOM_DATE_TIME_FORMAT),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { panelClass: 'mat-dialog-override'}
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    }
  ]
};

function getAuthToken() {
  const key = btoa('authTokenKey').toLowerCase();
  const authToken: string | null = localStorage.getItem(key);
  return authToken ? atob(authToken) : null;
}
