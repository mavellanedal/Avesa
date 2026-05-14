import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '@services/login/auth.service';
import { LoginService } from '@services/login/login.service';
import { ErrorManagementService } from '@services/error-managment.service';

const NO_NOTIFY_POPUP_EXCEPTION: string[] = [];
let isRefreshingToken = false;

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorMngtSvc = inject(ErrorManagementService);
  const authSvc = inject(AuthService);
  const loginSvc = inject(LoginService);

  return next(req).pipe(
    catchError((err: any) => {
      if ('status' in err) {
        const apiError = JSON.parse(JSON.stringify(err.error || null));
        if (apiError) {
          apiError.status = err.status;
        }
        return manageError(apiError, err, req, next, { errorMngtSvc, authSvc, loginSvc });
      } else {
        return EMPTY;
      }
    })
  );
};

function manageError(
  apiError: any,
  err: any,
  req: any,
  next: any,
  svcs: {
    errorMngtSvc: ErrorManagementService;
    authSvc: AuthService;
    loginSvc: LoginService;
  }
) {
  switch (err.status) {
    case 500:
      console.error('Error: (Status ', err.status, ') Information: ', err);
      let errorCode;
      if (err.error && err.error.errorCode) {
        errorCode = err.error.errorCode;
      } else if (apiError && apiError.errorCode) {
        errorCode = apiError.errorCode;
      }

      if (errorCode) {
        const noNotify = NO_NOTIFY_POPUP_EXCEPTION.find((x) => x === errorCode);
        if (!noNotify) {
          svcs.errorMngtSvc.onNotify(apiError);
        }
      } else {
        svcs.errorMngtSvc.onNotify(apiError);
      }
      return throwError(() => err);

    case 429:
      return throwError(() => err);

    case 401:
      if (isRefreshingToken || req.url.includes('/auth/login')) {
        svcs.errorMngtSvc.onNotify(apiError);
        return throwError(() => err);
      }
      return refreshToken(req, next, svcs);

    default:
      svcs.errorMngtSvc.onNotify(apiError);
      return throwError(() => err);
  }
}

function refreshToken(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  svcs: {
    errorMngtSvc: ErrorManagementService;
    authSvc: AuthService;
    loginSvc: LoginService;
  }
) {
  if (!isRefreshingToken) {
    console.log('Call to refresh token.... Im the first');
    isRefreshingToken = true;

    const refreshToken = svcs.authSvc.getToken(AuthService.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      redirectToLogin(svcs.authSvc);
      return EMPTY;
    } else {
      return svcs.loginSvc.refresh(refreshToken).pipe(
        take(1),
        switchMap((resp) => {
          const token = resp.headers.get('Authorization');

          if (token) {
            console.log('Token has been received');
            // Save new token
            svcs.authSvc.setAuthToken(resp.headers);

            // Put new token in original request
            const authReq = addToken(req, token);
            isRefreshingToken = false;
            // Re-send original request
            return next(authReq);
          } else {
            isRefreshingToken = false;
            redirectToLogin(svcs.authSvc);
            return EMPTY;
          }
        }),
        catchError((e: any) => {
          isRefreshingToken = false;
          redirectToLogin(svcs.authSvc);
          return EMPTY;
        })
      );
    }
  } else {
    console.log('Waiting to server token');
    return EMPTY;
  }
}

function redirectToLogin(authSvc: AuthService) {
  authSvc.logout();
}

function addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
}
