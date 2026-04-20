export class UserToken {
  public id!: string;
  public username!: string;
  public name!: string;
  public surname!: string;
  public email!: string;
  public groups: string[];

  constructor(token?: any) {
    this.id = token?.sub;
    this.username = token?.preferred_username;
    this.name = token?.name;
    this.surname = token?.surname;
    this.email = token?.email;
    this.groups = token?.groups;
  }
}
