import { FilterDto } from '@dtos/common/filter.dto';
import { Transform } from 'class-transformer';
import { Util } from '@shared/utilities/util';

export class PropertyFilterDto extends FilterDto {
  public propertyCode: string;
  public stateId: number;
  public typeId: number;
  public city: string;
  @Transform(({ value }) => Util.parseDateValue(value))
  public startDate: Date;
  @Transform(({ value }) => Util.parseDateValue(value))
  public endDate: Date;
  public surfaceMin: number;
  public surfaceMax: number;
  public rooms: number;
  public bathrooms: number;
  public hasElevator: boolean;
  public hasPool: boolean;
  public hasParking: boolean;
  public isFurnished: boolean;
  public constructionYear: number;
  public maxResult: number;
}
