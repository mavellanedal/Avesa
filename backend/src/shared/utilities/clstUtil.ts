import { ClsService } from 'nestjs-cls';

export class ClsUtil {
  private static clsSvc: ClsService = {
    get: () => undefined,
    set: () => {},
  } as any;

  public static init(cls: ClsService) {
    this.clsSvc = cls;
  }

  static set<T = any>(key: string, value: T) {
    this.clsSvc.set(key, value);
  }

  static get(key: string) {
    return this.clsSvc.get(key);
  }
}
