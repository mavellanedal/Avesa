import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserFilterDto } from '@dtos/user/user-filter.dto';
import { UserDto } from '@dtos/user/user.dto';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { ROLES } from '@shared/constants/roles.constant';

@ApiBearerAuth()
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/getUser')
  @Roles(ROLES.USERS_READ)
  @HttpCode(HttpStatus.OK)
  async getUser(@Body() { idUser }) {
    return await this.usersService.getUser(idUser);
  }

  @Post('/getUsers')
  @Roles(ROLES.USERS_READ)
  @HttpCode(HttpStatus.OK)
  public getUsersByFilter(@Body() userFilter: UserFilterDto) {
    return this.usersService.getUsersByFilter(userFilter);
  }

  @Post('/getGroups')
  @Roles(ROLES.USERS_READ)
  @HttpCode(HttpStatus.OK)
  async getGroups() {
    return await this.usersService.getGroups();
  }

  @Post('/existsUser')
  @Roles(ROLES.USERS_READ)
  @HttpCode(HttpStatus.OK)
  async existsUser(@Body() { userName }) {
    return await this.usersService.existsUser(userName);
  }

  @Post('/createUser')
  @Roles(ROLES.USERS_WRITE)
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(SanitizeHtmlInterceptor)
  async createUser(@Body() user: UserDto) {
    return await this.usersService.createUser(user);
  }

  @Post('/updateUser')
  @Roles(ROLES.USERS_WRITE)
  @HttpCode(HttpStatus.OK)
  // @UseInterceptors(SanitizeHtmlInterceptor)
  async updateUser(@Body() user: UserDto) {
    return await this.usersService.updateUser(user);
  }
}
