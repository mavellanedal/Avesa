import { Transform } from 'class-transformer';
import { Util } from '@shared/utilities/util';

export class FilterDto {
  @Transform(({ value }) => Util.undefinedOrBooleanValue(value))
  public active: boolean;
  public first: number;
  public max: number;
  public sortBy: string;
  public orderBy: 'ASC' | 'DESC';
}
