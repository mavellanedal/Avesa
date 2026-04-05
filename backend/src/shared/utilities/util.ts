import { Transactional } from 'typeorm-transactional';

export class Util {
  public static undefinedOrBooleanValue(value: any): boolean | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number') {
      if (value === 1) return true;
      if (value === 0) return false;
    }

    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      if (lowerValue === 'true' || lowerValue === '1') return true;
      if (lowerValue === 'false' || lowerValue === '0') return false;
    }
  }

  @Transactional()
  static async transactional(content) {
    return await content();
  }

  public static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static getDateLastX(interval: string) {
    const typeTime = interval[0];
    const time = Number(interval.substring(1));
    const now = new Date();
    if (typeTime === 'H') {
      now.setHours(now.getHours() - time);
    }
    if (typeTime === 'D') {
      now.setDate(now.getDate() - time);
    }
    if (typeTime === 'M') {
      now.setMonth(now.getMonth() - time);
    }
    return new Date(now);
  }

  static parseDateValue(value: any): Date | null {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? undefined : value;
    }

    const parsedDate = new Date(value);

    if (isNaN(parsedDate.getTime())) {
      return undefined;
    }
    return parsedDate;
  }

  static convertUtcDateStringToDate(utcDateString: string): Date {
    const date = new Date(utcDateString);
    if (isNaN(date.getTime())) {
      return undefined;
    }
    return date;
  }
}
