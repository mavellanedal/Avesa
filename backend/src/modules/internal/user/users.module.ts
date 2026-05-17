import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { AppUser, LoginUser, FunctionalRole } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature([AppUser, LoginUser, FunctionalRole])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
