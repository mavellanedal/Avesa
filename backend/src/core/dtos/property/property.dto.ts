import { Expose, Type } from 'class-transformer';
import { PropertyOwnerDto } from './property-owner.dto';
import { IsBoolean, IsDate, IsNumber, ValidateNested } from 'class-validator';
import { PropertyTypeDto } from './property-type.dto';
import { PropertyAddressDto } from './property-address.dto';
import { PropertyStateDto } from './property-state.dto';

export class PropertyDto {
  @Expose()
  public id: number;

  @Expose()
  @ValidateNested()
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
  @ValidateNested()
  @Type(() => PropertyStateDto)
  public state: PropertyStateDto;

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
  public featureIsFurnished: boolean;

  @Expose()
  @IsNumber()
  public featureConstructionYear: number;

  @Expose()
  @IsDate()
  public createdAt: Date;
}
