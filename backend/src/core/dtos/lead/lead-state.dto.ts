import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class LeadStateDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  description: string;
}
