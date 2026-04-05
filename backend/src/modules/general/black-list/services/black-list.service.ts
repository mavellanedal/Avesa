import { Injectable } from '@nestjs/common';

@Injectable()
export class BlackListService {
  public async isPhoneInBlackList(phone: string): Promise<boolean> {
    return false;
  }

  public async isEmailInBlackList(email: string): Promise<boolean> {
    return false;
  }
}
