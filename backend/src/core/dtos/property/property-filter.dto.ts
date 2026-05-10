import { FilterDto } from '@dtos/common/filter.dto';

export class PropertyFilterDto extends FilterDto {
  public typeId: string;
  public state: number;
  public city: string;
  public ownerName: string;
  public ownerNif: string;
  public surface: number;
  public rooms: number;
  public bathrooms: number;
  public hasElevator: boolean;
  public hasParking: boolean;
  public hasPool: boolean;
  public isFurnished: boolean;
  public constructionYear: number;
  public maxResult: number;
}
