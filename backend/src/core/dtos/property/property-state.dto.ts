import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class PropertyStateDto {
  public id: number;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;
}
