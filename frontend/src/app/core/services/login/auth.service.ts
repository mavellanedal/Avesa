import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../../environments/environment.development';
import { Router } from "@angular/router";
import { User } from "../../models/auth/user.model";
import { LoginRequest } from "../../models/auth/login-request.model";
import { LoginResponse } from "../../models/auth/login-respones.model";
import { tap } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class AuthService {

  constructor() {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr && userStr !== 'undefined') {
      try {
        const userObj = JSON.parse(userStr);
        this.currentUser.set(userObj);
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        this.logout();
      }
    }
  }
  private readonly _http = inject(HttpClient);
  private readonly _route = inject(Router);

  private readonly _apiUrl = `${environment.apiUrl}/auth`;

  public currentUser = signal<User | null>(null);
  public isAuthenticated = signal<boolean>(false);

  public login(credentials: LoginRequest) {
    return this._http.post<LoginResponse>(`${this._apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this._saveSession(response);
      })
    )
  }

  public logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this._route.navigate(['/login']);
  }

  private _saveSession(data: LoginResponse) {
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    this.currentUser.set(data.user);
    this.isAuthenticated.set(true);
  }
}
