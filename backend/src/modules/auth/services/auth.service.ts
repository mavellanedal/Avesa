import {
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDto } from '@dtos/external-api/create-token.dto';
import { Response, Request } from 'express';
import { ROLES } from '@shared/constants/roles.constant';
import { UserService } from '@modules/internal/user/services/users.service';

export interface JwtPayload {
  sub: string;
  preferred_username: string;
  name: string;
  surname: string;
  email: string;
  groups: string[];
  roles: string[];
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private static REFRESH_TOKEN = 'Refresh-token';
  private static ID_TOKEN = 'Id-token';
  static AUTHORIZATION = 'Authorization';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async login(createToken: CreateTokenDto, res: Response) {
    try {
      const user = await this.userService.validateUserCredentials(
        createToken.username,
        createToken.password,
      );
      if (!user) throw new UnauthorizedException('Credenciales inválidas');

      const user = {
        id: '12345-abcde',
        username: createToken.username,
        name: 'Juan',
        surname: 'Pérez',
        email: 'juan@example.com',
        roles: [ROLES.LOGIN_AVESA, ROLES.EXTERNAL_API],
      };
      // ----------------------------------------------

      if (!user.roles.includes(ROLES.LOGIN_AVESA)) {
        throw new UnauthorizedException(
          'El usuario no tiene permisos para acceder',
        );
      }
      const payload: JwtPayload = {
        sub: user.id,
        preferred_username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        groups: user.roles,
        roles: user.roles,
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '7d' },
      );
      const idToken = this.jwtService.sign(payload, { expiresIn: '15m' });

      this.setTokens(res, accessToken, refreshToken, idToken);

      res.type('text/plain');
      return Buffer.from(JSON.stringify(user.roles)).toString('base64');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .send(new UnauthorizedException(error.message));
      } else {
        throw error;
      }
    }
  }

  public async logout(req: Request) {
    const idToken = req.headers[AuthService.ID_TOKEN.toLowerCase()];
    this.logger.log(`Usuario cerró sesión. Token: ${idToken}`);
  }

  public async refresh(req: Request, res: Response) {
    const oldRefreshToken = req.headers[AuthService.REFRESH_TOKEN.toLowerCase()] as string;

    if (!oldRefreshToken) {
      throw new UnauthorizedException('No se proporcionó Refresh Token');
    }

    try {
      const decoded = this.jwtService.verify(oldRefreshToken);

      const user = await this.userService.findById(decoded.sub);

      const user = {
        id: decoded.sub,
        username: 'Juan',
        name: 'Juan',
        surname: 'Pérez',
        email: 'juan@example.com',
        roles: [ROLES.LOGIN_AVESA, ROLES.EXTERNAL_API],
      };

      const payload: JwtPayload = {
        sub: user.id,
        preferred_username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        groups: user.roles,
        roles: user.roles,
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '7d' },
      );
      const idToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      this.setTokens(res, accessToken, newRefreshToken, idToken);
      return;
    } catch (e) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  private setTokens(
    res: Response,
    accessToken: string,
    refreshToken: string,
    idToken: string,
  ) {
    res.header(AuthService.AUTHORIZATION, accessToken);
    res.header(AuthService.REFRESH_TOKEN, refreshToken);
    res.header(AuthService.ID_TOKEN, idToken);
  }
}
