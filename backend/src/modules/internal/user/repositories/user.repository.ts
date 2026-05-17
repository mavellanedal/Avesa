import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AppUser, LoginUser, Group } from '@entities';
import * as bcrypt from 'bcrypt';
import { UserFilterDto } from '@dtos/user/user-filter.dto';
import { UserDto } from '@dtos/user/user.dto';
import { CustomRepository } from '@shared/repositories/custom-repository';

const USER_SORT_MAP: Record<string, string> = {
  name: 'au.name',
  surname: 'au.surname',
  email: 'au.email',
  identificationNumber: 'au.identificationNumber',
  username: 'lu.username',
};

const USER_RELATIONS = [
  'groups',
  'groups.functionalRoles',
  'appUser',
  'source',
];

@Injectable()
export class UserRepository extends CustomRepository<AppUser> {
  private appUserRepository: Repository<AppUser>;
  private loginUserRepository: Repository<LoginUser>;
  private groupsRepository: Repository<Group>;

  constructor(private dataSource: DataSource) {
    super(AppUser, dataSource.createEntityManager());
    this.appUserRepository = dataSource.getRepository(AppUser);
    this.loginUserRepository = dataSource.getRepository(LoginUser);
    this.groupsRepository = dataSource.getRepository(Group);
  }

  async createUserTransaction(userDto: UserDto): Promise<LoginUser> {
    return this.dataSource.transaction(async (manager) => {
      const newAppUser = manager.create(AppUser, {
        name: userDto.appUser.name,
        surname: userDto.appUser.surname,
        email: userDto.appUser.email,
        identificationNumber: userDto.appUser.identificationNumber,
        phone: userDto.appUser.phone ?? null,
      });
      const savedAppUser = await manager.save(newAppUser);

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userDto.password, salt);

      const newLoginUser = manager.create(LoginUser, {
        username: userDto.username,
        password: hashedPassword,
        isActive: userDto.isActive ?? true,
        appUser: savedAppUser,
        groups: (userDto.groups ?? []) as Group[],
      });

      const savedLoginUser = await manager.save(newLoginUser);
      return manager.findOne(LoginUser, {
        where: { id: savedLoginUser.id },
        relations: USER_RELATIONS,
      });
    });
  }

  async updateUserTransaction(userDto: UserDto): Promise<LoginUser> {
    return this.dataSource.transaction(async (manager) => {
      const loginUser = await manager.findOne(LoginUser, {
        where: { id: userDto.id },
        relations: ['appUser', 'groups'],
      });

      if (!loginUser) {
        throw new NotFoundException(
          `Usuario con ID ${userDto.id} no encontrado`,
        );
      }

      loginUser.appUser.name = userDto.appUser.name ?? loginUser.appUser.name;
      loginUser.appUser.surname =
        userDto.appUser.surname ?? loginUser.appUser.surname;
      loginUser.appUser.email =
        userDto.appUser.email ?? loginUser.appUser.email;
      loginUser.appUser.identificationNumber =
        userDto.appUser.identificationNumber ??
        loginUser.appUser.identificationNumber;
      loginUser.appUser.phone =
        userDto.appUser.phone ?? loginUser.appUser.phone;
      await manager.save(loginUser.appUser);

      if (userDto.password) {
        const salt = await bcrypt.genSalt();
        loginUser.password = await bcrypt.hash(userDto.password, salt);
      }

      if (userDto.isActive !== undefined) {
        loginUser.isActive = userDto.isActive;
      }

      if (userDto.groups !== undefined) {
        loginUser.groups = userDto.groups as Group[];
      }

      const updatedLoginUser = await manager.save(loginUser);
      return manager.findOne(LoginUser, {
        where: { id: updatedLoginUser.id },
        relations: USER_RELATIONS,
      });
    });
  }

  async findLoginUserByUsername(username: string): Promise<LoginUser | null> {
    return this.loginUserRepository.findOne({
      where: { username },
      relations: USER_RELATIONS,
    });
  }

  async getUser(id: string): Promise<LoginUser | null> {
    return this.loginUserRepository.findOne({
      where: { id },
      relations: USER_RELATIONS,
    });
  }

  async getUsersByFilter(userFilterDto: UserFilterDto) {
    const query = this.dataSource
      .createQueryBuilder(LoginUser, 'lu')
      .innerJoinAndSelect('lu.appUser', 'au')
      .leftJoinAndSelect('lu.source', 's')
      .leftJoinAndSelect('lu.groups', 'g');

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

    if (userFilterDto.first !== undefined) {
      query.skip(userFilterDto.first);
    }

    if (userFilterDto.max !== undefined) {
      query.take(userFilterDto.max);
    }

    query.orderBy(
      USER_SORT_MAP[userFilterDto.sortBy] ?? 'au.name',
      userFilterDto.orderBy ?? 'ASC',
    );

    return query.getManyAndCount();
  }

  async getGroups() {
    return this.groupsRepository.find();
  }

  public async existsUser(username: string): Promise<boolean> {
    const count = await this.loginUserRepository.count({ where: { username } });
    return count > 0;
  }
}
