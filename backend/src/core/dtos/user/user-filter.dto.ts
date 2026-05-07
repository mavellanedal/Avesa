import { FilterDto } from '@dtos/common/filter.dto';

export class UserFilterDto extends FilterDto {
  public id: number;
  public name: string;
  public surname: string;
  public identificationNumber: string;
  public username: string;
  public email: string;
}
