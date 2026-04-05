import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AppUser, LoginUser, FunctionalRole } from 'src/core/entities';
import { CreateUserDto } from 'src/core/dtos/user/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  private appUserRepository: Repository<AppUser>;
  private loginUserRepository: Repository<LoginUser>;

  constructor(private dataSource: DataSource) {
    this.appUserRepository = this.dataSource.getRepository(AppUser);
    this.loginUserRepository = this.dataSource.getRepository(LoginUser);
  }

  // Busca por ID de AppUser (Perfil)
  async findAppUserById(id: string): Promise<AppUser | null> {
    return this.appUserRepository.findOne({ where: { id } });
  }

  // Busca el LoginUser (necesario para Auth) incluyendo roles y perfil
  async findLoginUserByUsername(username: string): Promise<LoginUser | null> {
    return this.loginUserRepository.findOne({
      where: { username },
      relations: ['groups', 'groups.functionalRoles', 'appUser', 'source'],
    });
  }

  // Crea el usuario completo (AppUser + LoginUser + Roles) en una transacción
  async createFullUser(createUserDto: CreateUserDto): Promise<LoginUser> {
    const {
      name,
      surname,
      identificationNumber,
      phone,
      email,
      username,
      password,
      isActive,
      functionalRoleIds,
    } = createUserDto;

    return this.dataSource.transaction(async (manager) => {
      const newAppUser = manager.create(AppUser, {
        name,
        surname,
        identificationNumber,
        phone,
        email,
      });
      const savedAppUser = await manager.save(newAppUser);
      let roles: FunctionalRole[] = [];
      if (functionalRoleIds && functionalRoleIds.length > 0) {
        roles = functionalRoleIds.map((id) => ({ id }) as FunctionalRole);
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newLoginUser = manager.create(LoginUser, {
        username,
        password: hashedPassword,
        isActive: isActive ?? true,
        appUser: savedAppUser,
        roles: roles,
      });

      return await manager.save(newLoginUser);
    });
  }
}
