import { IdDto } from '@dtos/common/id.dto';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class PropertyStateDto extends IdDto {
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;
}
