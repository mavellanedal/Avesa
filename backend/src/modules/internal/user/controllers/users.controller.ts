import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserFilterDto } from '@dtos/user/user-filter.dto';

@ApiBearerAuth()
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  public getUserById(@Param('id') id: string) {
    return this.usersService.findAppUserById(id);
  }

  @Post('getUsers')
  public getUsersByFilter(@Body() userFilterDto: UserFilterDto) {
    return this.usersService.getUsersByFilter(userFilterDto);
  }
}
