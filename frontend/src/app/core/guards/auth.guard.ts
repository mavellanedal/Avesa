import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/login/auth.service";
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);
  if (authSvc.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
}
