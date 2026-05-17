import {BaseModel} from '@models/base-model';
import {AppUser} from '@models/user-tracking/app-user';
import {PropertyState} from '@models/property/property-state';

export class PropertyStateHistory extends BaseModel {
  public propertyState!: PropertyState;
  public appUser!: AppUser;
  public changeDate!: Date;
}
