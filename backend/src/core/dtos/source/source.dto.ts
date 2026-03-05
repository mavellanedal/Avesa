import { Expose } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class SourceDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  public id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  public active: boolean;
}
