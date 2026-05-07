import {BaseFilter} from '@models/base-filter';

export class UserFilter extends BaseFilter {
  public id?: string;
  public username?: string;
  public name?: string;
  public surname?: string;
  public email?: string;
}
