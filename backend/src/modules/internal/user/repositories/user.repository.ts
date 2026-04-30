import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AppUser, LoginUser, FunctionalRole } from 'src/core/entities';
import { CreateUserDto } from 'src/core/dtos/user/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserFilterDto } from '@dtos/user/user-filter.dto';
import { CustomRepository } from '@shared/repositories/custom-repository';

const USER_SORT_MAP: Record<string, string> = {
  name: 'au.name',
  surname: 'au.surname',
  email: 'au.email',
  identificationNumber: 'au.identificationNumber',
  username: 'lu.username',
};

@Injectable()
export class UserRepository extends CustomRepository<AppUser> {
  private appUserRepository: Repository<AppUser>;
  private loginUserRepository: Repository<LoginUser>;

  constructor(private dataSource: DataSource) {
    super(AppUser, dataSource.createEntityManager());
    this.appUserRepository = dataSource.getRepository(AppUser);
    this.loginUserRepository = dataSource.getRepository(LoginUser);
  }

  async findAppUserById(id: string): Promise<AppUser | null> {
    return this.appUserRepository.findOne({ where: { id } });
  }

  async findLoginUserByUsername(username: string): Promise<LoginUser | null> {
    return this.loginUserRepository.findOne({
      where: { username },
      relations: ['groups', 'groups.functionalRoles', 'appUser', 'source'],
    });
  }

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

  async findLoginUserById(id: string): Promise<LoginUser | null> {
    return this.loginUserRepository.findOne({
      where: { id },
      relations: ['groups', 'groups.functionalRoles', 'appUser', 'source'],
    });
  }

  async getUsersByFilter(userFilterDto: UserFilterDto) {
    const query = this.dataSource
      .createQueryBuilder(LoginUser, 'lu')
      .innerJoinAndSelect('lu.appUser', 'au')
      .leftJoinAndSelect('lu.source', 's')
      .innerJoinAndSelect('lu.groups', 'g');

    if (userFilterDto.name) {
      query.andWhere('au.name ILIKE :name', {
        name: `%${userFilterDto.name}%`,
      });
    }
    if (userFilterDto.surname) {
      query.andWhere('au.surname ILIKE :surname', {
        surname: `%${userFilterDto.surname}%`,
      });
    }
    if (userFilterDto.identificationNumber) {
      query.andWhere('au.identificationNumber = :identificationNumber', {
        identificationNumber: userFilterDto.identificationNumber,
      });
    }
    if (userFilterDto.username) {
      query.andWhere('lu.username ILIKE :username', {
        username: `%${userFilterDto.username}%`,
      });
    }
    if (userFilterDto.email) {
      query.andWhere('au.email ILIKE :email', {
        email: `%${userFilterDto.email}%`,
      });
    }
    if (userFilterDto.active !== undefined) {
      query.andWhere('lu.isActive = :active', { active: userFilterDto.active });
    }

    query.take(userFilterDto.maxResult);
    query.orderBy(
      USER_SORT_MAP[userFilterDto.sortBy] ?? 'au.name',
      userFilterDto.orderBy ?? 'ASC',
    );

    return this.paginateResults(
      await query.getMany(),
      userFilterDto.first,
      userFilterDto.max,
      userFilterDto.maxResult,
      true,
    );
  }
}
