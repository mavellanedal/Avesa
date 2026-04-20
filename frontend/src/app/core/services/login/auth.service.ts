import { inject, Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { LoginService } from "./login.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { UserToken } from "@models/security/user-token";
import { firstValueFrom } from "rxjs";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { GROUPS } from "@shared/constants/groups.constant";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly jwtHelperSvc = inject(JwtHelperService);
  private readonly loginSvc = inject(LoginService);
  private readonly router = inject(Router);
  private readonly matDialog = inject(MatDialog)

  public static TOKEN = 'Authorization';
  public static REFRESH_TOKEN = 'Refresh-token';
  public static ID_TOKEN = 'Id-token';

  public static ROLES_KEY = 'rolesKey';
  public static TOKEN_KEY = 'authTokenKey';
  public static REFRESH_TOKEN_KEY = 'authRefreshTokenKey';
  public static ID_TOKEN_KEY = 'authIdTokenKey';
  public static SESSION_KEY = 'authSessionKey';
  public static LAST_ACTTIVITY_TIME_KEY = 'lastActivityTimeKey';
  public static CHECK_ACTIVITY_TIME_INTERVAL = 10000;
  public maxInactivityTime = 11800000;

  private activityCheckIntervalId: any;
  private currentSession: UserToken | undefined;

  constructor() {}

  public isAuthenticated(): boolean {
    if (this.jwtHelperSvc.tokenGetter()) {
      return !this.jwtHelperSvc.isTokenExpired();
    }
    return false;
  }

  public async refreshToken() {
    const refreshToken = this.getToken(AuthService.REFRESH_TOKEN_KEY);

    if (refreshToken) {
      const resp = await firstValueFrom(this.loginSvc.refresh(refreshToken)).catch(() => {
        return false;
      });
      if (resp instanceof HttpResponse) {
        const token = resp.headers.get(AuthService.TOKEN);
        if (token) {
          this.setAuthToken(resp.headers)
          const decodedToken = this.jwtHelperSvc.decodeToken(token);
          this.setCurrentSession(decodedToken);
          return true;
        }
      }
    }
    return false;
  }

  public getToken(key: string) {
    let token: string | null = localStorage.getItem(this.getKey(key));
    if (token) {
      return atob(token);
    }
    return null;
  }

  public setAuthToken(headers: HttpHeaders) {
    localStorage.setItem(this.getKey(AuthService.TOKEN_KEY), btoa(<string>headers.get(AuthService.TOKEN)));
    localStorage.setItem(this.getKey(AuthService.REFRESH_TOKEN_KEY), btoa(<string>headers.get(AuthService.REFRESH_TOKEN)));
    localStorage.setItem(this.getKey(AuthService.ID_TOKEN_KEY), btoa(<string>headers.get(AuthService.ID_TOKEN)));
  }

  public getRoles() {
    let roles:string | null = localStorage.getItem(this.getKey(AuthService.ROLES_KEY));
    if (roles) {
      return JSON.parse(atob(roles));
    }
    return null;
  }

  public setRoles(roles: string[]) {
    const rolesMap = roles?.reduce((map: any, obj: string) => {
      map[obj] = obj;
      return map;
    }, {});
    localStorage.setItem(this.getKey(AuthService.ROLES_KEY), btoa(JSON.stringify(rolesMap)));
  }

  public logout(redirect: boolean = true) {
    const idToken = this.getToken(AuthService.ID_TOKEN_KEY);

    localStorage.removeItem(this.getKey(AuthService.TOKEN_KEY));
    localStorage.removeItem(this.getKey(AuthService.REFRESH_TOKEN_KEY));
    localStorage.removeItem(this.getKey(AuthService.ID_TOKEN_KEY));
    localStorage.removeItem(this.getKey(AuthService.SESSION_KEY));
    localStorage.removeItem(this.getKey(AuthService.ROLES_KEY));
    this.currentSession = undefined;
    clearInterval(this.activityCheckIntervalId);
    this.matDialog.closeAll();

    if (redirect) {
      if (idToken) {
        firstValueFrom(this.loginSvc.logout(idToken)).catch(() => {});
      }
      this.router.navigate(['/login']);
    }
  }

  public getKey(key: string) {
    return btoa(key).toLowerCase();
  }

  public getCurrentSession() {
    let currentSession = localStorage.getItem(this.getKey(AuthService.SESSION_KEY));

    if (currentSession) {
      return JSON.parse(decodeURIComponent(encodeURIComponent(atob(atob(currentSession)))));
    }
    return null;
  }

  public setCurrentSession(session: any) {
    const user: UserToken = new UserToken(session);
    localStorage.setItem(this.getKey(AuthService.SESSION_KEY), btoa(btoa(decodeURIComponent(JSON.stringify(user)))));

    this.currentSession = user;
    this.startActivityCheckInterval();
  }

  public startActivityCheckInterval() {
    if (this.activityCheckIntervalId) {
      clearInterval(this.activityCheckIntervalId);
    }
    this.activityCheckIntervalId= setInterval(this.checkUserActivity.bind(this), AuthService.CHECK_ACTIVITY_TIME_INTERVAL);
  }

  public setLastActivityTime(time: number) {
    localStorage.setItem(this.getKey(AuthService.LAST_ACTTIVITY_TIME_KEY), String(time));
  }

  public checkUserActivity() {
    let lastActivity = <number | null>localStorage.getItem(btoa(AuthService.LAST_ACTTIVITY_TIME_KEY));

    const now: number = Date.now();

    if (lastActivity && (now - lastActivity) > this.maxInactivityTime) {
      this.logout();
    }
  }

  public hasRole(role: string) {
    const roles = this.getRoles();
    if (roles) {
      return roles[role] !== undefined;
    }
    return false;
  }

  public isAdmin() {
    if (!this.currentSession) {
      this.currentSession = this.getCurrentSession();
    }
    const user: UserToken | undefined = this.currentSession;

    if (user && user.groups) {
      return user.groups.includes(GROUPS.ADMINISTRATOR);
    }
    return false;
  }
}
