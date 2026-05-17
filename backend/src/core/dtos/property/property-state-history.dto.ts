import { Expose, Transform, Type } from 'class-transformer';
import { PropertyStateDto } from './property-state.dto';
import { AppUserDto } from '../auth/app-user.dto';
import { Util } from '@shared/utilities/util';

export class PropertyStateHistoryDto {
  public id: string;

  @Expose()
  @Type(() => PropertyStateDto)
  public propertyState: PropertyStateDto;

  @Expose()
  @Type(() => AppUserDto)
  public appUser: AppUserDto;

  @Expose()
  @Transform(({ value }) => Util.parseDateValue(value))
  public changeDate: Date;
}
