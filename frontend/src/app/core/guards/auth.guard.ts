import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/login/auth.service";
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authSvc = inject(AuthService);

  authSvc.startActivityCheckInterval();

  if (!authSvc.isAuthenticated()) {
    inject(Router).navigate(['/login']);
    return false;
  }
  return true;
}
