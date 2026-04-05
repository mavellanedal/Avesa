import { Util } from '@shared/utilities/util';
import { Transform } from 'class-transformer';

export class LeadWelcomeFilterDto {
  @Transform(({ value }) => Util.parseDateValue(value))
  public startDate?: Date;
  @Transform(({ value }) => Util.parseDateValue(value))
  public endDate?: Date;
}
