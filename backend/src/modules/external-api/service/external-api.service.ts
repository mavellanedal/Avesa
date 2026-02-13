import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class ExternalApiService {
  constructor(private readonly authService: AuthService) {}

  public async validateAndGenerateToken(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.validateAndGenerateToken(username, password);
  }
}
