export class ApiErrorDescriptions {
  static CREATED(entity: string): string {
    return `${entity} created successfully.`;
  }

  public static BAD = 'Bad request. Please check the input data and try again.';

  public static UNAUTHORIZED =
    'Unauthorized. Please provide valid credentials.';

  public static INTERNAL_ERROR =
    'Internal server error. Please try again later.';

  public static NOT_FOUND(entity: string): string {
    return `${entity} not found.`;
  }

  public static CONFLICT(entity: string): string {
    return `${entity} already exists.`;
  }
}

/*
  Ahora tenemos esto:
user.service.ts:
public async getGroups(): Promise<string[]> {
    const groups = await this.keycloakService.getGroups();

    const userLevel = UserUtil.getUserMinLevel(groups);
    const filtered = groups.filter(g => {
        const level = UserUtil.getGroupLevel(g);
        return level >= userLevel;
    });
    return filtered.map(g => g.name);
}

userUtil.ts:
private static readonly TOKEN_KEY = 'userToken';
public static getToken() {
    return ClsUtil.get(this.TOKEN_KEY);
}
public static getGroups(): string[] {
    return this.getToken()?.groups ?? [];
}

public static getGroupLevel(group: GroupRepresentation) {
    const levelStr = group.attributes?.level?.[0];
    return levelStr ? Number(levelStr) : 99;
}

public static getUserMinLevel(groups: GroupRepresentation[]) {
    const userGroups = this.getGroups();

    if (!userGroups ||userGroups.length === 0) return 99;

    let minLevel = 99;

    const levelMap = new Map<string, number>();
    for (const g of groups) {
        levelMap.set(g.name, this.getGroupLevel(g));
    }

    for (const name of userGroups) {
        const level = levelMap.get(name) ?? 99;
        if (level < minLevel) {
            minLevel = level;
        }
    }
    return minLevel;
}

clsUtil.ts:
import {ClsService} from "nestjs-cls";


export class ClsUtil {
    private static clsSvc: ClsService;

    public static init(cls: ClsService) {
        this.clsSvc = cls;
    }

    static set<T = any>(key: string, value: T) {
        this.clsSvc.set(key, value)
    }

    static get(key: string) {
        return this.clsSvc.get(key)
    }
 }

keycloack.serivce.ts:
public async getGroups() {
    try {
        return await this.admin.groups.find({
            realm: this.configKeycloak.realm
        });
    } catch(error) {
        this.logger.error(error, JSON.stringify(error.response?.data));
        throw new KeycloakException(error.response?.data);
    }
}


Si inicio sesión con un usuario que esta en el grupo de supervisor (nivel 1) no debería poder ver el gurpo de administrador, es decir debe devolver todos los grupos menos el de Administrador (level 0) y actualmente lo devuelve. Revisa porque

*/
