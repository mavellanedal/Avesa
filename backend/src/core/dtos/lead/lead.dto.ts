import { Expose, Transform, Type } from 'class-transformer';
import { SourceDto } from '../source/source.dto';
import { LeadStateHistoryDto } from './lead-state-history.dto';
import { BaseDto } from '@dtos/common/base.dto';
import { Util } from '@shared/utilities/util';

export class LeadDto {
  @Expose()
  public id: number;
  @Expose()
  public code: string;
  @Expose()
  public name: string;
  @Expose()
  public surname: string;
  @Expose()
  public email: string;
  @Expose()
  public phone: string;
  @Expose()
  @Type(() => SourceDto)
  public source: SourceDto;
  @Expose()
  @Type(() => LeadStateHistoryDto)
  public leadStateHistories: LeadStateHistoryDto[];
  @Expose()
  @Transform(({ value }) => Util.parseDateValue(value))
  public createdAt: Date;
}
