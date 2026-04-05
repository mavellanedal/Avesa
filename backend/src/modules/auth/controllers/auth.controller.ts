import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { PublicAccess } from '../decorators/auth.decorator';
import { CreateTokenDto } from '@dtos/external-api/create-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAccess()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: CreateTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(loginDto, res);
  }
}
