import { Transform } from 'class-transformer';
import { Util } from '@shared/utilities/util';
import { FilterDto } from '@dtos/common/filter.dto';

export class LeadFilterDto extends FilterDto {
  public leadCode: string;
  public phone: string;
  public email: string;
  public name: string;
  public sourceId: number;
  public stateId: number;
  public subStateId: number;
  @Transform(({ value }) => Util.parseDateValue(value))
  public startDate: Date;
  @Transform(({ value }) => Util.parseDateValue(value))
  public endDate: Date;
}
