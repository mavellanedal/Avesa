import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class IdDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  public id: number;
}
