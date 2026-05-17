import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Util } from '@shared/utilities/util';
import { IdDto } from './id.dto';
import { Expose, Transform } from 'class-transformer';
export class BaseDto extends IdDto {
  @Expose()
  @IsString()
  @IsOptional()
  public name: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Util.undefinedOrBooleanValue(value))
  public active: boolean;
}
