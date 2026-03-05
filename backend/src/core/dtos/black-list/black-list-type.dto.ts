import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BlackListTypeDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  public id: number;

  @Expose()
  @IsString()
  @IsOptional()
  public name: string;

  @Expose()
  @IsString()
  @IsOptional()
  public description: string;
}
