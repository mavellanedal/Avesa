import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@envs/environment.dev";
import { UserFilter } from "@models/user-tracking/user-filter";

@Injectable({
  providedIn: "root"
})
export class UserTrackingService {
  private readonly http = inject(HttpClient);

  getUsersByFilter(userFilter: UserFilter) {
    return this.http.post(environment.api + '/users/getUsers', userFilter);
  }
}
