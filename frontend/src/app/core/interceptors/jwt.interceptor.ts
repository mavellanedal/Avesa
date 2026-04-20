import { HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { AuthService } from "@services/login/auth.service"

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authSvc = inject(AuthService)

  if (authSvc.isAuthenticated()) {
    const authReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${authSvc.getToken(AuthService.TOKEN_KEY)}`
      ),
    });
    return next(authReq);
  }
  return next(req);
}
