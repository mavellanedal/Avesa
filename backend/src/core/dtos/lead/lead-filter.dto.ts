import { Transform } from 'class-transformer';
import { Util } from '@shared/utilities/util';
import { FilterDto } from '@dtos/common/filter.dto';

export class LeadFilterDto extends FilterDto {
  public leadCode: string;
  public name: string;
  public surname: string;
  public email: string;
  public phone: string;
  @Transform(({ value }) => Util.parseDateValue(value))
  public startDate: Date;
  @Transform(({ value }) => Util.parseDateValue(value))
  public endDate: Date;
  public sourceId: string;
  public stateId: number;
  public subStateId: number;
  public maxResult: number;
}
