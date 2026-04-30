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
import * as bcrypt from 'bcrypt';
import { UsersService } from '@modules/internal/user/services/users.service';

export interface JwtPayload {
  sub: string;
  preferred_username: string;
  name: string;
  surname: string;
  email: string;
  roles: string[];
  groups: string[];
  sourceId?: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private static REFRESH_TOKEN = 'Refresh-token';
  private static ID_TOKEN = 'Id-token';
  static AUTHORIZATION = 'Authorization';

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public async login(createToken: CreateTokenDto, res: Response) {
    try {
      const loginUser = await this.usersService.findLoginUserByUsername(
        createToken.username,
      );

      if (!loginUser) {
        throw new UnauthorizedException('Usuario o contraseña incorrectos');
      }

      // 2. Verificar la contraseña con bcrypt
      const isPasswordValid = await bcrypt.compare(
        createToken.password,
        loginUser.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Usuario o contraseña incorrectos');
      }

      // 3. Extraer los nombres de grupos y roles (quitando duplicados con Set)
      const groupsName = loginUser.groups?.map((g) => g.name) || [];
      const rolesName = [
        ...new Set(
          loginUser.groups?.flatMap(
            (g) => g.functionalRoles?.map((r) => r.name) || [],
          ) || [],
        ),
      ];

      // 4. Validar que tenga el rol necesario para acceder
      // Nota: Revisa si en tu DB es ROLES.LOGIN_LIDIA o 'login_avesa'
      if (!rolesName.includes(ROLES.LOGIN_AVESA)) {
        throw new UnauthorizedException(
          'No tiene permisos para iniciar sesión',
        );
      }

      // 5. Crear el Payload con los datos reales de la BD
      const payload: JwtPayload = {
        sub: loginUser.id,
        preferred_username: loginUser.username,
        name: loginUser.appUser?.name || '',
        surname: loginUser.appUser?.surname || '',
        email: loginUser.appUser?.email || '',
        roles: rolesName,
        groups: groupsName,
        sourceId: loginUser.source?.id, // Si este usuario pertenece a un origen (útil para la API externa)
      };

      // 6. Generar los JWT directamente
      const tokens = await this.generateTokens(payload);

      // 7. Configurar Cabeceras y devolver roles
      this.setTokens(res, tokens);
      res.type('text/plain');
      return btoa(JSON.stringify(rolesName));
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Se mantiene tu lógica original para el interceptor de Angular
        res
          .status(HttpStatus.OK)
          .send(new UnauthorizedException(error.message));
      } else {
        this.logger.error(error);
        throw error;
      }
    }
  }

  public logout(req: Request) {
    const idToken = req.headers[AuthService.ID_TOKEN.toLowerCase()] as string;
    this.logger.log(`Logout ejecutado localmente para el token: ${idToken}`);
  }

  public async refresh(req: Request, res: Response) {
    const refreshTokenHeader = req.headers[
      AuthService.REFRESH_TOKEN.toLowerCase()
    ] as string;

    if (!refreshTokenHeader) {
      throw new UnauthorizedException('Refresh token no proporcionado');
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshTokenHeader);
      const { iat, exp, ...newPayload } = payload as any;

      const tokens = await this.generateTokens(newPayload);
      this.setTokens(res, tokens);
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  public async createToken(
    createToken: CreateTokenDto,
  ): Promise<{ token: string }> {
    const loginUser = await this.usersService.findLoginUserByUsername(
      createToken.username,
    );

    if (!loginUser) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Verificar la contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(
      createToken.password,
      loginUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const groupsName = loginUser.groups?.map((g) => g.name) || [];
    const rolesName = [
      ...new Set(
        loginUser.groups?.flatMap(
          (g) => g.functionalRoles?.map((r) => r.name) || [],
        ) || [],
      ),
    ];

    if (
      !rolesName.includes(ROLES.EXTERNAL_API) &&
      !rolesName.includes(ROLES.EXTERNAL_API_PROPERTY_INSERT)
    ) {
      throw new UnauthorizedException('No tiene permisos para API externa');
    }

    const payload: JwtPayload = {
      sub: loginUser.id,
      preferred_username: loginUser.username,
      name: loginUser.appUser?.name || '',
      surname: loginUser.appUser?.surname || '',
      email: loginUser.appUser?.email || '',
      roles: rolesName,
      groups: groupsName,
      sourceId: loginUser.source?.id,
    };

    // Para la API externa generaremos un token que expire en 1 hora, o según convención.
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });

    return { token: accessToken };
  }

  /**
   * Genera los 3 tokens que espera tu frontend
   */
  private async generateTokens(payload: JwtPayload) {
    const [accessToken, refreshToken, idToken] = await Promise.all([
      // Token de acceso
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      // Token de refresco
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      // Token ID (mismo contenido, para mantener compatibilidad con tu Angular)
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
    ]);

    return { accessToken, refreshToken, idToken };
  }

  /**
   * Setea los headers requeridos en la respuesta de Express
   */
  private setTokens(
    res: Response,
    tokens: { accessToken: string; refreshToken: string; idToken: string },
  ) {
    res.set(AuthService.AUTHORIZATION, tokens.accessToken);
    res.set(AuthService.REFRESH_TOKEN, tokens.refreshToken);
    res.set(AuthService.ID_TOKEN, tokens.idToken);
  }
}
