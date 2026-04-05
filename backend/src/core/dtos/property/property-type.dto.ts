import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class PropertyTypeDto {
  id: number;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;
}
