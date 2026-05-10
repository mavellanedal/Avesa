import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserFilterDto } from '@dtos/user/user-filter.dto';
import { UserDto } from '@dtos/user/user.dto';
import { UserUtil } from '@shared/utilities/userUtil';
import { plainToInstance } from 'class-transformer';
import { ResponseDataDto } from '@dtos/common/response-data.dto';
import { Util } from '@shared/utilities/util';
import { LoginUser } from '@entities';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly userRepository: UserRepository) {}

  private async validateGroupAssigment(groups: string[]) {
    const allGroups = await this.getGroups();

    const userLevel = UserUtil.getUserMinLevel(allGroups);

    if (userLevel === 0) return;

    for (const name of groups) {
      const targetGroup = allGroups.find((g) => g.name === name);
      const targetGroupLevel = UserUtil.getGroupLevel(targetGroup);

      if (targetGroupLevel < userLevel) {
        throw new ForbiddenException(
          `No tienes permisos para asignar el grupo ${name}.`,
        );
      }
    }
  }

  public async createUser(userDto: UserDto): Promise<UserDto> {
    const exists = await this.existsUser(userDto.username);
    if (exists) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    return Util.transactional(async () => {
      const savedUser =
        await this.userRepository.createUserTransaction(userDto);
      return plainToInstance(UserDto, savedUser, { strategy: 'excludeAll' });
    }).catch((error) => {
      if (
        error instanceof ConflictException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error('Se ha producido un error al crear el usuario', error);
      throw new InternalServerErrorException(
        'Se ha producido un error al crear el usuario',
      );
    });
  }

  public async updateUser(userDto: UserDto): Promise<UserDto> {
    return Util.transactional(async () => {
      const updatedUser =
        await this.userRepository.updateUserTransaction(userDto);
      return plainToInstance(UserDto, updatedUser, { strategy: 'excludeAll' });
    }).catch((error) => {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      this.logger.error(
        'Se ha producido un error al actualizar el usuario',
        error,
      );
      throw new InternalServerErrorException(
        'Se ha producido un error al actualizar el usuario',
      );
    });
  }

  public async findLoginUserByUsername(
    username: string,
  ): Promise<LoginUser | null> {
    return this.userRepository.findLoginUserByUsername(username);
  }

  public async getUser(id: string): Promise<UserDto> {
    const user = await this.userRepository.getUser(id);
    return plainToInstance(UserDto, user, { strategy: 'excludeAll' });
  }

  public async getUsersByFilter(
    userFilter: UserFilterDto,
  ): Promise<ResponseDataDto<UserDto[]>> {
    const [users, total] =
      await this.userRepository.getUsersByFilter(userFilter);
    return new ResponseDataDto(
      plainToInstance(UserDto, <LoginUser[]>users, { strategy: 'excludeAll' }),
      <number>total,
    );
  }

  public async getGroups() {
    return this.userRepository.getGroups();
  }

  public existsUser(username: string): Promise<boolean> {
    return this.userRepository.existsUser(username);
  }
}
