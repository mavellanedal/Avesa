// backend/src/modules/auth/services/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/internal/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: string;
  username: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validateAndGenerateToken(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; user: any }> {
    const loginUser = await this.usersService.findLoginUserByUsername(username);

    if (!loginUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!loginUser.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, loginUser.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: loginUser.appUser?.id ?? loginUser.appUserId,
      username: loginUser.username,
      roles: loginUser.roles?.map(role => role.name) ?? [],
    };

    const appUser = loginUser.appUser;

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: appUser?.id,
        name: appUser?.name,
        surname: appUser?.surname,
        identificationNumber: appUser?.identificationNumber,
        email: appUser?.email,
        phone: appUser?.phone,
      },
    };
  }
}
