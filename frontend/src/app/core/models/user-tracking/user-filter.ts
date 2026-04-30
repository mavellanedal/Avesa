export class UserFilter {
  public name?: string;
  public surname?: string;
  public identificationNumber?: string;
  public username?: string;
  public email?: string;
  public active?: boolean;
  public sortBy?: string;
  public orderBy?: 'ASC' | 'DESC';
  public first?: number;
  public max?: number;
}
