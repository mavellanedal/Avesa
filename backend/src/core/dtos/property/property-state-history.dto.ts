import { Expose } from 'class-transformer';
import { PropertyDto } from './property.dto';
import { PropertyStateDto } from './property-state.dto';
import { AppUserDto } from '@dtos/auth/appUser.dto';
import { IsDate } from 'class-validator';

export class PropertyStateHistoryDto {
  public id: string;

  @Expose()
  public property: PropertyDto;

  @Expose()
  public propertyState: PropertyStateDto;

  @Expose()
  public appUser: AppUserDto;

  @Expose()
  @IsDate()
  public changeDate: Date;
}
