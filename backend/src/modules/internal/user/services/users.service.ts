import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { LoginUser } from 'src/core/entities';
import { CreateUserDto } from 'src/core/dtos/user/create-user.dto';
import { UserFilterDto } from '@dtos/user/user-filter.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public async validateUserCredentials(
    username: string,
    passwordStr: string,
  ): Promise<LoginUser | null> {
    const user = await this.findLoginUserByUsername(username);

    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(passwordStr, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  public async findById(id: string): Promise<LoginUser | null> {
    return this.userRepository.findLoginUserById(id);
  }

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

  public async getUsersByFilter(userFilterDto: UserFilterDto) {
    return this.userRepository.getUsersByFilter(userFilterDto);
  }
}
