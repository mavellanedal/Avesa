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
  @Expose({ name: 'changeDate' })
  @Transform(({ value }) => Util.parseDateValue(value))
  public date: Date;
  @Expose({ name: 'leadState' })
  @Type(() => LeadStateDto)
  public state: LeadStateDto;
  @Expose({ name: 'leadSubState' })
  @Type(() => LeadStateDto)
  public subState: LeadStateDto;
  @Expose()
  @Type(() => AppUserDto)
  public appUser: AppUserDto;
}
