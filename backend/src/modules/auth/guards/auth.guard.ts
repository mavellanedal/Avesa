import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@shared/constants/key-decorators.conststat';
import { Request } from 'express';
import { ClsUtil } from '@shared/utilities/clstUtil';
import { UserUtil } from '@shared/utilities/userUtil';
import { JwtPayload } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;

    if (
      !authorization ||
      typeof authorization !== 'string' ||
      authorization.trim() === ''
    ) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authorization.replace(/bearer/gim, '').trim();

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      ClsUtil.set(UserUtil.USER_TOKEN, token);
      ClsUtil.set(UserUtil.USER_ROLES, payload.roles);

      request['user'] = payload;
      request['idUser'] = payload.sub;
      request['rolesUser'] = payload.roles;
      request['groups'] = payload.groups;

      return true;
    } catch {
      throw new UnauthorizedException('Token no váldio o expirado');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' && token ? token : undefined;
  }
}
