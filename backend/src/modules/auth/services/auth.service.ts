import {
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/internal/user/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateTokenDto } from '@dtos/external-api/create-token.dto';
import { ROLES } from '@shared/constants/roles.constant';
import { ExternalApiException } from '@modules/external-api/exceptions/externa-api.exception';
import { CreateTokenResponseDto } from '@dtos/external-api/create-token-response.dto';
import { Response } from 'express';

export interface AuthResult {
  token: string;
  user: any;
}

export interface JwtPayload {
  sub: string;
  username: string | null;
  roles: string[];
  groups: string[];
  name: string | null;
  surname: string | null;
  identificationNumber: string | null;
  email: string | null;
  phone: string | null;
  sourceId: number | null;
}

@Injectable()
export class AuthService {
  public static readonly AUTHORIZATION = 'Authorization';
  public static readonly REFREESH_TOKEN = 'Refresh-Token';
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async login(createToken: CreateTokenDto, res: Response) {
    try {
      const { user, payload } = await this.validateAndGetPayload(createToken);

      if (!payload.roles.includes(ROLES.LOGIN_AVESA)) {
        throw new UnauthorizedException(
          'El usuario no tiene permisos para acceder a esta aplicación',
        );
      }

      const token = this.generateToken(payload);

      this.setTokens(res, token);
      res.type('text/plain');

      return Buffer.from(JSON.stringify(payload.roles)).toString('base64');
    } catch (error) {
      this.logger.error(error);
      if (error instanceof UnauthorizedException) {
        res
          .status(HttpStatus.OK)
          .send(new UnauthorizedException(error.message));
      } else {
        throw error;
      }
    }
  }

  public async createToken(
    createToken: CreateTokenDto,
  ): Promise<CreateTokenResponseDto> {
    try {
      const { user, payload } = await this.validateAndGetPayload(createToken);

      if (!payload.roles.includes(ROLES.EXTERNAL_API)) {
        throw new UnauthorizedException(
          'El usuario no tiene permisos para acceder a esta aplicación',
        );
      }

      const tokens = this.generateToken(payload);

      return { token: tokens.access_token };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof UnauthorizedException) {
        throw new ExternalApiException('Unauthorized', HttpStatus.UNAUTHORIZED);
      } else {
        throw error;
      }
    }
  }

  private async validateAndGetPayload(createToken: CreateTokenDto) {
    const loginUser = await this.usersService.findLoginUserByUsername(
      createToken.username,
    );

    if (!loginUser) {
      throw new UnauthorizedException(
        'Credenciales inválidas o usuario inactivo',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      createToken.password,
      loginUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const groupsNames = loginUser.groups?.map((g) => g.name) || [];

    const rolesName = [
      ...new Set(
        loginUser.groups?.flatMap(
          (g) => g.functionalRoles?.map((r) => r.name) || [],
        ) || [],
      ),
    ];

    const appUser = loginUser.appUser;

    const payload: JwtPayload = {
      sub: appUser.id ?? loginUser.appUserId,
      username: loginUser.username,
      groups: groupsNames,
      roles: rolesName,
      sourceId: loginUser.source?.id ?? null,
      name: appUser.name,
      surname: appUser?.surname,
      email: appUser?.email,
      identificationNumber: appUser?.identificationNumber,
      phone: appUser?.phone,
    };

    return { user: loginUser, payload };
  }

  private generateToken(payload: JwtPayload) {
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '15min',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  private setTokens(
    res: Response,
    tokens: { access_token: string; refresh_token: string },
  ) {
    res.header(AuthService.AUTHORIZATION, `Bearer ${tokens.access_token}`);
    res.header(AuthService.REFREESH_TOKEN, tokens.refresh_token);
  }
}
