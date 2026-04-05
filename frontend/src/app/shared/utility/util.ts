export class Util {

  static valueOrNull<T>(value: T | null | undefined): T | null {
    return value === undefined ? null : value;
  }
}
