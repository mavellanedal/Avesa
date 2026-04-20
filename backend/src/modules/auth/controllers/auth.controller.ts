import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { PublicAccess } from '../decorators/auth.decorator';
import { CreateTokenDto } from '@dtos/external-api/create-token.dto';
import { Logger } from 'winston';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @PublicAccess()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() createToken: CreateTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(createToken, res);
  }

  @PublicAccess()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: Request) {
    await this.authService.logout(req);
  }

  @PublicAccess()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(req, res);
  }
}
