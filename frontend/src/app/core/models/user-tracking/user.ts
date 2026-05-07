import {AppUser} from '@models/user-tracking/app-user';
import {Group} from '@models/user-tracking/group';

export class User {
  public id?: string;
  public username?: string;
  public password?: string;
  public isActive?: boolean;
  public appUser?: AppUser;
  public groups?: Group;
}


