import { Type } from 'class-transformer';
import { LeadStateDto } from './lead-state.dto';
import { Expose } from 'class-transformer';

export class LeadStateHistoryDto {
  @Expose()
  @Type(() => LeadStateDto)
  state: LeadStateDto;

  @Expose()
  @Type(() => Date)
  changedAt: Date;
}
