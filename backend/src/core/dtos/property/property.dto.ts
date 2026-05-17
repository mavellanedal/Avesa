import { Expose, Transform, Type } from 'class-transformer';
import { PropertyOwnerDto } from './property-owner.dto';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PropertyTypeDto } from './property-type.dto';
import { PropertyAddressDto } from './property-address.dto';
import { Util } from '@shared/utilities/util';
import { PropertyStateHistoryDto } from './property-state-history.dto';

export class PropertyDto {
  @Expose()
  public id: number;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @Type(() => PropertyOwnerDto)
  public owner: PropertyOwnerDto;

  @Expose()
  @ValidateNested()
  @Type(() => PropertyAddressDto)
  public address: PropertyAddressDto;

  @Expose()
  @ValidateNested()
  @Type(() => PropertyTypeDto)
  public type: PropertyTypeDto;

  @Expose()
  @IsNumber()
  public featuresSurface: number;

  @Expose()
  @IsNumber()
  public featuresRooms: number;

  @Expose()
  @IsNumber()
  public featuresBathrooms: number;

  @Expose()
  @IsBoolean()
  public featuresHasElevator: boolean;

  @Expose()
  @IsBoolean()
  public featuresHasParking: boolean;

  @Expose()
  @IsBoolean()
  public featuresIsFurnished: boolean;

  @Expose()
  @IsNumber()
  public featuresConstructionYear: number;

  @Expose()
  @Type(() => PropertyStateHistoryDto)
  public propertyStateHistories: PropertyStateHistoryDto[];

  @Expose()
  @Transform(({ value }) => Util.parseDateValue(value))
  public createdAt: Date;

  @Expose()
  @IsString()
  public propertyCode: string;
}
