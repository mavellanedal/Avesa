import { Expose, Transform, Type } from 'class-transformer';
import { GroupDto } from '@dtos/user/group.dto';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { BaseDto } from '@dtos/common/base.dto';
import { AppUserDto } from '../auth/app-user.dto';
import { Source } from '@entities';
import { SourceDto } from '@dtos/source/source.dto';

export class UserDto {
  @Expose()
  @IsOptional()
  id?: string;

  @Expose()
  @IsString()
  @IsOptional()
  username: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Expose()
  @Type(() => AppUserDto)
  appUser: AppUserDto;

  @Expose()
  @IsOptional()
  @Type(() => GroupDto)
  groups?: GroupDto[];

  @Expose()
  @IsOptional()
  @Type(() => SourceDto)
  public source: Source;
}
