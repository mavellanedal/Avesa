import { Transform, Type } from 'class-transformer';
import { LeadStateDto } from './lead-state.dto';
import { Expose } from 'class-transformer';
import { AppUserDto } from '@dtos/auth/app-user.dto';
import { LeadDto } from '@dtos/lead/lead.dto';
import { Util } from '@shared/utilities/util';
import { BaseDto } from '@dtos/common/base.dto';

export class LeadStateHistoryDto {
  @Expose()
  public id: number;
  @Expose()
  @Transform(({ value }) => Util.parseDateValue(value))
  public changeDate: Date;
  @Expose()
  @Type(() => LeadStateDto)
  public leadState: LeadStateDto;
  @Expose()
  @Type(() => LeadStateDto)
  public leadSubState: LeadStateDto;
  @Expose()
  @Type(() => AppUserDto)
  public appUser: AppUserDto;
}
