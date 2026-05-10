import {AppUser} from '@models/user-tracking/app-user';
import {LeadState} from '@models/lead/lead-state';

export class LeadStateHistory {
  public id?: number;
  public state?: LeadState;
  public subState?: LeadState;
  public appUser?: AppUser;
  public date?: Date;
}
