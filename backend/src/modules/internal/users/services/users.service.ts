import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { LoginUser } from 'src/core/entities';
import { CreateUserDto } from 'src/core/dtos/user/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createFullUser(
    createUserDto: CreateUserDto,
  ): Promise<LoginUser> {
    const existingUser = await this.userRepository.findLoginUserByUsername(
      createUserDto.username,
    );
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    return this.userRepository.createFullUser(createUserDto);
  }

  public async findLoginUserByUsername(
    username: string,
  ): Promise<LoginUser | null> {
    return this.userRepository.findLoginUserByUsername(username);
  }

  public async findAppUserById(id: string) {
    return this.userRepository.findAppUserById(id);
  }
}
