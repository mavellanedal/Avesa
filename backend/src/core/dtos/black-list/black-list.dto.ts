import { Expose, Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Util } from '@shared/utilities/util';
import { BlackListTypeDto } from './black-list-type.dto';

export class BlackListDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  public id: number;

  @Expose()
  @IsString()
  @IsOptional()
  public reason: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public value: string;

  @Expose()
  @IsBoolean()
  @Transform(({ value }) => Util.undefinedOrBooleanValue(value))
  public active: boolean;

  @Expose()
  @IsDate()
  public created_at: Date;

  @Expose()
  @ValidateNested()
  @Type(() => BlackListTypeDto)
  public type: BlackListTypeDto;
}
