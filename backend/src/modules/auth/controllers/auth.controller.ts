import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/auth.decorator';
import { LoginDto } from '../../../core/dtos/auth/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { accessToken } = await this.authService.validateAndGenerateToken(
      loginDto.username,
      loginDto.password,
    );

    return { accessToken };
  }
}
