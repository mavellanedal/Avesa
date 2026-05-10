import { Expose, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { Util } from '@shared/utilities/util';

export class SourceDto {
  @Expose()
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
  @Transform(({ value }) => Util.undefinedOrBooleanValue(value))
  public active: boolean;
}
