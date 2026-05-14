import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class PropertyTypeDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;
}
