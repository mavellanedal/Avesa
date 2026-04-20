import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@services/login/auth.service";

export const rolesGuard: CanActivateFn = async (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);
  const role: string = route.data['role'] as string;

  if (!authSvc.isAuthenticated() && !(await authSvc.refreshToken())) {
    router.navigate(['/login']);
  }

  if (authSvc.hasRole(role)) {
    return true;
  }

  router.navigate(['/']);
  return false;
}
