import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@envs/environment.dev";
import { UserFilter } from "@models/user-tracking/user-filter";
import { User } from "@models/user-tracking/user";
import {ResponseData} from '@models/response-data';
import {Group} from '@models/user-tracking/group';

@Injectable({
  providedIn: "root"
})
export class UserTrackingService {
  private readonly http = inject(HttpClient);

  getUsersByFilter(userFilter: UserFilter | undefined = undefined) {
    return this.http.post<ResponseData<User[]>>(environment.api + '/users/getUsers', userFilter);
  }

  getUser(id: string) {
    return this.http.post<User>(environment.api + '/users/getUser', {
      idUser: id,
    });
  }

  getGroups() {
    return this.http.post<Group[]>(
      environment.api + '/users/getGroups',
      undefined,
    );
  }

  existsUser(userName: string) {
    return this.http.post<boolean>(environment.api + '/users/existsUser', {
      userName: userName,
    });
  }

  updateUser(user: User) {
    return this.http.post<User>(environment.api + '/users/updateUser', user);
  }

  createUser(user: User) {
    return this.http.post<User>(environment.api + '/users/createUser', user);
  }
}
