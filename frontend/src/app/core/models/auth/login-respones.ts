import { User } from "../user-tracking/user";

export class LoginResponse {
  public accessToken?: string;
  public user?: User;
}
