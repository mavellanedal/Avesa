import {BaseFilter} from '@models/base-filter';

export class PropertyFilter extends BaseFilter {
  public propertyCode?: string;
  public stateId?: number;
  public typeId?: number;
  public city?: string;
  public startDate?: string;
  public endDate?: string;
  public surfaceMin?: number;
  public surfaceMax?: number;
  public rooms?: number;
  public bathrooms?: number;
  public hasElevator?: boolean;
  public hasPool?: boolean;
  public hasParking?: boolean;
  public isFurnished?: boolean;
  public constructionYear?: number;
  public maxResult?: number;
}
