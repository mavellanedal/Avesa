import { HttpEvent, HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@services/login/auth.service";
import { tap } from "rxjs";

export const httpActivityInterceptor: HttpInterceptorFn = (req, next) => {
  const authSvc = inject(AuthService)

  return next(req).pipe(
    tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        authSvc.setLastActivityTime(Date.now());
      }
    })
  );
};
