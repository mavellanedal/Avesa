import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('internal/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  public getUserById(@Param('id') id: string) {
    return this.usersService.findAppUserById(id);
  }
}
