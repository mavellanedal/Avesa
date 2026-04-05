import { ClsUtil } from '@shared/utilities/clstUtil';

export class UserUtil {
  public static readonly NO_LEVEl = Infinity;
  public static readonly USER_TOKEN = 'userToken';
  public static readonly USER_ROLES = 'userRoles';

  public static getToken() {
    return ClsUtil.get(this.USER_TOKEN);
  }

  public static getUserId() {
    return this.getToken()?.sub;
  }

  public static getUsername() {
    return this.getToken()?.preferred_username;
  }

  public static getSourceIds(): string[] {
    return this.getToken()?.sourceId ?? [];
  }

  public static getRoles() {
    return ClsUtil.get(this.USER_ROLES) ?? [];
  }

  public static getGroups(): string[] {
    const groups = this.getToken()?.groups ?? [];
    return groups.map((g) => (g.startsWith('/') ? g.substring(1) : g));
  }
}
