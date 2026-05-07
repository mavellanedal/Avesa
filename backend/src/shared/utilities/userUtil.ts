import { ClsUtil } from '@shared/utilities/clstUtil';
import { GroupDto } from '@dtos/user/group.dto';

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

  public static getGroupLevel(group: GroupDto) {
    const level = group?.level;
    if (level !== undefined && level !== null) {
      return Number(level);
    }
    return this.NO_LEVEl;
  }

  public static getUserMinLevel(groups: GroupDto[]) {
    const userGroups = this.getGroups();

    if (!userGroups) return this.NO_LEVEl;

    let minLevel = this.NO_LEVEl;

    const levelMap = new Map<string, number>();
    for (const g of groups) {
      levelMap.set(g.name, this.getGroupLevel(g));
    }

    for (const name of userGroups) {
      const level = levelMap.get(name) ?? this.NO_LEVEl;
      if (level < minLevel) {
        minLevel = level;
      }
    }
    return minLevel;
  }
}
