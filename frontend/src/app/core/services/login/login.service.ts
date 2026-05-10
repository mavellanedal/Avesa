import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@envs/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly http = inject(HttpClient);

  login(username: string, password: string) {
    const requestData = { username: username, password: password };
    return this.http.post(environment.api + '/auth/login', requestData, { observe: 'response', responseType: 'text' });
  }

  logout(idToken: string) {
    const header = {[AuthService.ID_TOKEN]: idToken};
    return this.http.post(environment.api + '/auth/refresh', undefined, { observe: 'response', headers: header });
  }

  refresh(refreshToken: string) {
    const header = {[AuthService.REFRESH_TOKEN]: refreshToken};
    return this.http.post(environment.api + '/auth/refresh', undefined, { observe: 'response', headers: header });
  }
}
